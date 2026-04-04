import { neon } from '@neondatabase/serverless';

type SqlFn = ReturnType<typeof neon>;
let _sql: SqlFn | null = null;

export function getDb(): SqlFn {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}
