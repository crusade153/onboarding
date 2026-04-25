// Part 1: 회사 인상 응답
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getActiveSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { participant_id, perception_choice, custom_text } = await req.json();
  if (!participant_id) {
    return NextResponse.json({ error: 'missing participant_id' }, { status: 400 });
  }

  // 참여자에 묶인 session_code 사용 (참여자가 가진 코드 = 그 강연 회차)
  const pRows = await sql`
    SELECT session_code FROM participants WHERE id = ${participant_id}
  `;
  const session_code = (pRows[0] as { session_code: string } | undefined)?.session_code ?? null;

  await sql`DELETE FROM company_perception WHERE participant_id = ${participant_id}`;

  const rows = await sql`
    INSERT INTO company_perception (participant_id, perception_choice, custom_text, session_code)
    VALUES (${participant_id}, ${perception_choice ?? null}, ${custom_text ?? null}, ${session_code})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const explicit = searchParams.get('session_code');
  const active = explicit ? { session_code: explicit } : await getActiveSession();
  if (!active) return NextResponse.json({ counts: [], customs: [] });
  const code = active.session_code;

  const counts = await sql`
    SELECT perception_choice, COUNT(*)::int AS count
    FROM company_perception
    WHERE perception_choice IS NOT NULL AND session_code = ${code}
    GROUP BY perception_choice
    ORDER BY count DESC
  `;
  const customs = await sql`
    SELECT cp.custom_text, p.name, p.department, cp.created_at
    FROM company_perception cp
    JOIN participants p ON cp.participant_id = p.id
    WHERE cp.custom_text IS NOT NULL AND cp.custom_text <> ''
      AND cp.session_code = ${code}
    ORDER BY cp.created_at DESC
    LIMIT 50
  `;
  return NextResponse.json({ counts, customs });
}
