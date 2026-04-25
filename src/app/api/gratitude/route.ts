// Part 3: 감사 리스트
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

const VALID = new Set(['excel_calc', 'phone_sync', 'manual_log', 'overtime']);

export async function POST(req: NextRequest) {
  const { participant_id, saved_from } = await req.json();
  if (!participant_id || !VALID.has(saved_from)) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 });
  }

  // 같은 항목 중복 방지
  await sql`
    DELETE FROM gratitude_list
    WHERE participant_id = ${participant_id} AND saved_from = ${saved_from}
  `;
  const rows = await sql`
    INSERT INTO gratitude_list (participant_id, saved_from)
    VALUES (${participant_id}, ${saved_from})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET() {
  const counts = await sql`
    SELECT saved_from, COUNT(*)::int AS count
    FROM gratitude_list
    GROUP BY saved_from
    ORDER BY count DESC
  `;
  return NextResponse.json({ counts });
}
