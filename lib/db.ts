import 'server-only';
import { Pool } from 'pg';

const globalForDb = globalThis as unknown as { postgresPool?: Pool };

export function getDb(): Pool {
  if (globalForDb.postgresPool) return globalForDb.postgresPool;

  if (!process.env.DATABASE_URL) throw new Error('Не задан DATABASE_URL');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });

  pool.on('error', (error) => console.error('PostgreSQL pool error:', error.message));
  globalForDb.postgresPool = pool;

  return pool;
}
