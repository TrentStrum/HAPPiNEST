import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from '.';

// This will automatically run needed migrations on the database
migrate(db, { migrationsFolder: './lib/db/migrations' });