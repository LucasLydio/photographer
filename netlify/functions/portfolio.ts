import type { Context } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { and, desc, eq } from 'drizzle-orm';
import { getDatabase } from '../../db/index';
import { portfolioItems } from '../../db/schema';

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' };
const categories = new Set(['Retratos', 'Encontros', 'Cotidiano', 'Editorial']);
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonResponse(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...jsonHeaders, 'Cache-Control': 'no-store', ...headers },
  });
}

async function authorizedUser(request: Request) {
  const token = request.headers
    .get('authorization')
    ?.replace(/^Bearer\s+/i, '');
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const allowlist = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (!token || !url || !anonKey || allowlist.length === 0) return null;

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  const email = data.user?.email?.toLowerCase();
  return !error && email && allowlist.includes(email) ? data.user : null;
}

async function readJson(request: Request) {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 16_384) return null;
  try {
    const body: unknown = await request.json();
    return body && typeof body === 'object' && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export default async function handler(
  request: Request,
  _context: Context,
): Promise<Response> {
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: jsonHeaders });
  if (!['GET', 'POST', 'DELETE'].includes(request.method)) {
    return jsonResponse({ error: 'Método não permitido.' }, 405, {
      Allow: 'GET, POST, DELETE, OPTIONS',
    });
  }

  try {
    const database = getDatabase();

    if (request.method === 'GET') {
      const user = await authorizedUser(request);
      const rows = await database
        .select()
        .from(portfolioItems)
        .where(user ? undefined : eq(portfolioItems.published, true))
        .orderBy(desc(portfolioItems.createdAt));
      return jsonResponse(rows);
    }

    if (!(await authorizedUser(request)))
      return jsonResponse({ error: 'Acesso não autorizado.' }, 401);
    const body = await readJson(request);
    if (!body)
      return jsonResponse({ error: 'Envie um JSON válido de até 16 KB.' }, 400);

    if (request.method === 'POST') {
      const { title, category, imageUrl, alt } = body;
      if (
        typeof title !== 'string' ||
        title.trim().length < 2 ||
        title.trim().length > 90
      ) {
        return jsonResponse(
          { error: 'O título deve ter entre 2 e 90 caracteres.' },
          400,
        );
      }
      if (typeof category !== 'string' || !categories.has(category)) {
        return jsonResponse({ error: 'Escolha uma categoria válida.' }, 400);
      }
      if (typeof imageUrl !== 'string' || imageUrl.length > 2048) {
        return jsonResponse(
          { error: 'Informe uma URL de imagem válida.' },
          400,
        );
      }
      try {
        if (new URL(imageUrl).protocol !== 'https:')
          throw new Error('HTTPS required');
      } catch {
        return jsonResponse(
          { error: 'A imagem precisa usar uma URL HTTPS válida.' },
          400,
        );
      }
      if (
        typeof alt !== 'string' ||
        alt.trim().length < 4 ||
        alt.trim().length > 180
      ) {
        return jsonResponse(
          { error: 'A descrição da imagem deve ter entre 4 e 180 caracteres.' },
          400,
        );
      }

      const [created] = await database
        .insert(portfolioItems)
        .values({
          title: title.trim(),
          category,
          imageUrl,
          alt: alt.trim(),
          published: true,
        })
        .returning();
      return jsonResponse(created, 201);
    }

    if (typeof body.id !== 'string' || !uuidPattern.test(body.id)) {
      return jsonResponse({ error: 'Identificador de imagem inválido.' }, 400);
    }
    const [deleted] = await database
      .delete(portfolioItems)
      .where(
        and(eq(portfolioItems.id, body.id), eq(portfolioItems.published, true)),
      )
      .returning({ id: portfolioItems.id });
    if (!deleted) return jsonResponse({ error: 'Imagem não encontrada.' }, 404);
    return jsonResponse({ id: deleted.id });
  } catch (error) {
    console.error('Portfolio function failed:', error);
    if (
      error instanceof Error &&
      error.message === 'DATABASE_URL is not configured.'
    ) {
      return jsonResponse(
        { error: 'O banco de dados ainda não foi configurado.' },
        503,
      );
    }
    return jsonResponse(
      { error: 'Não foi possível concluir a solicitação.' },
      500,
    );
  }
}
