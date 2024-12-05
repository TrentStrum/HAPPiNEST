import type { Config } from 'drizzle-kit';
 
export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  driver: 'libsql',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DB_URL || 'file:local.db',
    authToken: process.env.NEXT_PUBLIC_DB_AUTH_TOKEN,
  },
} satisfies Config;