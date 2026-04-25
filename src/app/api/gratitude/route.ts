// Part 3: 감사 리스트
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getActiveSession } from '@/lib/session';

const VALID = new Set(['excel_calc', 'phone_sync', 'manual_log', 'overtime']);

export async function POST(req: NextRequest) {
  const { participant_id, saved_from } = await req.json();
  if (!participant_id || !VALID.has(saved_from)) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 });
  }

  const pRows = await sql`
    SELECT session_code FROM participants WHERE id = ${participant_id}
  `;
  const session_code = (pRows[0] as { session_code: string } | undefined)?.session_code ?? null;

  // 같은 항목 중복 방지
  await sql`
    DELETE FROM gratitude_list
    WHERE participant_id = ${participant_id} AND saved_from = ${saved_from}
  `;
  const rows = await sql`
    INSERT INTO gratitude_list (participant_id, saved_from, session_code)
    VALUES (${participant_id}, ${saved_from}, ${session_code})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const explicit = searchParams.get('session_code');
  const active = explicit ? { session_code: explicit } : await getActiveSession();
  if (!active) return NextResponse.json({ counts: [] });
  const code = active.session_code;

  const counts = await sql`
    SELECT saved_from, COUNT(*)::int AS count
    FROM gratitude_list
    WHERE session_code = ${code}
    GROUP BY saved_from
    ORDER BY count DESC
  `;
  return NextResponse.json({ counts });
}
