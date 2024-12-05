import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: process.env.NEXT_PUBLIC_DB_URL || 'file:local.db',
  authToken: process.env.NEXT_PUBLIC_DB_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });