import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getActiveSession, isSessionValid } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { name, department, session_code, entry_motivation } = await req.json();

  if (!name || !department) {
    return NextResponse.json({ error: 'name and department required' }, { status: 400 });
  }

  // 세션 코드 필수 (V2)
  const code = typeof session_code === 'string' ? session_code : '';
  if (!code || !(await isSessionValid(code))) {
    return NextResponse.json({ error: 'invalid or missing session_code' }, { status: 403 });
  }

  const motivation = typeof entry_motivation === 'string' && entry_motivation.trim()
    ? entry_motivation.trim().slice(0, 200)
    : null;

  const rows = await sql`
    INSERT INTO participants (name, department, session_id, session_code, entry_motivation)
    VALUES (${name}, ${department}, ${code}, ${code}, ${motivation})
    RETURNING id, name, department, session_code, entry_motivation, joined_at
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get('since');
  const explicitCode = searchParams.get('session_code');

  // 세션 코드 우선순위: URL 파라미터 → 현재 활성 세션
  const active = explicitCode ? { session_code: explicitCode } : await getActiveSession();
  if (!active) return NextResponse.json([]);

  const code = active.session_code;
  const rows = since
    ? await sql`
        SELECT id, name, department, entry_motivation, joined_at
        FROM participants
        WHERE session_code = ${code} AND joined_at > ${since}
        ORDER BY joined_at ASC
      `
    : await sql`
        SELECT id, name, department, entry_motivation, joined_at
        FROM participants
        WHERE session_code = ${code}
        ORDER BY joined_at ASC
      `;

  return NextResponse.json(rows);
}
