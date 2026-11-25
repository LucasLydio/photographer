import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Alpine from 'alpinejs';
import { registerSiteShell } from './components/site-shell';
import type { PortfolioItem } from './data/portfolio';
import './scss/main.scss';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

type Draft = Pick<PortfolioItem, 'title' | 'category' | 'imageUrl' | 'alt'>;
type AdminPanelState = {
  configured: boolean;
  authenticated: boolean;
  busy: boolean;
  email: string;
  password: string;
  message: string;
  items: PortfolioItem[];
  draft: Draft;
  sessionToken: string;
  init(this: AdminPanelState): Promise<void>;
  applySession(this: AdminPanelState, token: string): void;
  signIn(this: AdminPanelState): Promise<void>;
  signOut(this: AdminPanelState): Promise<void>;
  loadItems(this: AdminPanelState): Promise<void>;
  addItem(this: AdminPanelState): Promise<void>;
  removeItem(this: AdminPanelState, item: PortfolioItem): Promise<void>;
};

registerSiteShell(Alpine);
Alpine.data(
  'adminPanel',
  (): AdminPanelState => ({
    configured: Boolean(supabase),
    authenticated: false,
    busy: false,
    email: '',
    password: '',
    message: '',
    items: [] as PortfolioItem[],
    draft: { title: '', category: 'Retratos', imageUrl: '', alt: '' } as Draft,
    sessionToken: '',
    async init(this: AdminPanelState) {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      this.applySession(data.session?.access_token ?? '');
      supabase.auth.onAuthStateChange((_event, session) => {
        this.applySession(session?.access_token ?? '');
      });
    },
    applySession(this: AdminPanelState, token: string) {
      this.sessionToken = token;
      this.authenticated = Boolean(token);
      if (token) void this.loadItems();
    },
    async signIn(this: AdminPanelState) {
      if (!supabase) return;
      this.busy = true;
      this.message = '';
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });
      this.busy = false;
      this.message = error?.message ?? '';
    },
    async signOut(this: AdminPanelState) {
      await supabase?.auth.signOut();
      this.items = [];
      this.message = '';
    },
    async loadItems(this: AdminPanelState) {
      if (!this.sessionToken) return;
      this.busy = true;
      this.message = '';
      try {
        const response = await fetch('/api/portfolio', {
          headers: { Authorization: `Bearer ${this.sessionToken}` },
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error ?? 'Não foi possível carregar a galeria.');
        this.items = Array.isArray(data) ? data : [];
      } catch (error) {
        this.message =
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar a galeria.';
      } finally {
        this.busy = false;
      }
    },
    async addItem(this: AdminPanelState) {
      if (!this.sessionToken) return;
      this.busy = true;
      this.message = '';
      try {
        const response = await fetch('/api/portfolio', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.sessionToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.draft),
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            data.error ?? 'Não foi possível publicar esta imagem.',
          );
        this.items = [data, ...this.items];
        this.draft = { title: '', category: 'Retratos', imageUrl: '', alt: '' };
        this.message = 'Imagem publicada na galeria.';
      } catch (error) {
        this.message =
          error instanceof Error
            ? error.message
            : 'Não foi possível publicar esta imagem.';
      } finally {
        this.busy = false;
      }
    },
    async removeItem(this: AdminPanelState, item: PortfolioItem) {
      if (
        !this.sessionToken ||
        !window.confirm(`Remover “${item.title}” da galeria?`)
      )
        return;
      this.busy = true;
      this.message = '';
      try {
        const response = await fetch('/api/portfolio', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.sessionToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: item.id }),
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            data.error ?? 'Não foi possível remover esta imagem.',
          );
        this.items = this.items.filter((entry) => entry.id !== item.id);
        this.message = 'Imagem removida da galeria.';
      } catch (error) {
        this.message =
          error instanceof Error
            ? error.message
            : 'Não foi possível remover esta imagem.';
      } finally {
        this.busy = false;
      }
    },
  }),
);
Alpine.start();
