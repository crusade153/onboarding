// 청중용 세션 검증
import { sql } from '@/lib/db';

export async function getActiveSession(): Promise<{ session_code: string } | null> {
  const rows = await sql`
    SELECT session_code FROM sessions
    WHERE is_active = TRUE
    ORDER BY id DESC LIMIT 1
  `;
  return (rows[0] as { session_code: string }) ?? null;
}

export async function isSessionValid(code: string | null | undefined): Promise<boolean> {
  if (!code) return false;
  const rows = await sql`
    SELECT 1 FROM sessions
    WHERE session_code = ${code} AND is_active = TRUE
    LIMIT 1
  `;
  return rows.length > 0;
}
