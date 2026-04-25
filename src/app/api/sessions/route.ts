// src/app/api/sessions/route.ts
// 청중 세션 코드 발급/조회/종료
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

function genCode() {
  const ch = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // 혼동 문자(I,O) 제외
  const rand = (n: number) =>
    Array.from({ length: n }, () => ch[Math.floor(Math.random() * ch.length)]).join('');
  const num = String(Math.floor(1000 + Math.random() * 9000));
  return `${rand(2)}-${num}`;
}

// 세션 시작 (강연자가 호출)
export async function POST() {
  // 기존 활성 세션 종료
  await sql`UPDATE sessions SET is_active = FALSE, ended_at = NOW() WHERE is_active = TRUE`;

  let code = '';
  for (let i = 0; i < 5; i++) {
    code = genCode();
    const dup = await sql`SELECT 1 FROM sessions WHERE session_code = ${code}`;
    if (dup.length === 0) break;
  }

  const rows = await sql`
    INSERT INTO sessions (session_code, is_active)
    VALUES (${code}, TRUE)
    RETURNING id, session_code, started_at, is_active
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

// 활성 세션 조회 + 코드 검증 + 전체 세션 아카이브
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const all = searchParams.get('all');

  if (code) {
    const rows = await sql`
      SELECT id, session_code, started_at, is_active
      FROM sessions WHERE session_code = ${code} AND is_active = TRUE
    `;
    return NextResponse.json({ valid: rows.length > 0, session: rows[0] ?? null });
  }

  if (all) {
    // 전체 세션 + 응답 카운트
    const rows = await sql`
      SELECT
        s.id,
        s.session_code,
        s.started_at,
        s.ended_at,
        s.is_active,
        (SELECT COUNT(*)::int FROM participants p WHERE p.session_code = s.session_code) AS participants,
        (SELECT COUNT(*)::int FROM company_perception cp WHERE cp.session_code = s.session_code) AS perception,
        (SELECT COUNT(*)::int FROM hbh_self_assessment h WHERE h.session_code = s.session_code) AS hbh,
        (SELECT COUNT(*)::int FROM gratitude_list g WHERE g.session_code = s.session_code) AS gratitude
      FROM sessions s
      ORDER BY s.id DESC
    `;
    return NextResponse.json({ sessions: rows });
  }

  const rows = await sql`
    SELECT id, session_code, started_at
    FROM sessions WHERE is_active = TRUE ORDER BY id DESC LIMIT 1
  `;
  return NextResponse.json({ active: rows[0] ?? null });
}

// 세션 종료
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'missing code' }, { status: 400 });

  await sql`UPDATE sessions SET is_active = FALSE, ended_at = NOW() WHERE session_code = ${code}`;
  return NextResponse.json({ ok: true });
}
