import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: ReturnType<typeof postgres> | undefined;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured.');

  client ??= postgres(connectionString, {
    prepare: false,
    ssl: 'require',
    max: 1,
    idle_timeout: 15,
  });

  return drizzle(client, { schema });
}
