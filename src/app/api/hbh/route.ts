// Part 2: HBH 자기 인식 (가장 어려워 보이는 습관)
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

const VALID = new Set(['site_first', 'daily_mgmt', 'tools_means', 'system_org']);

export async function POST(req: NextRequest) {
  const { participant_id, hardest_habit } = await req.json();
  if (!participant_id || !VALID.has(hardest_habit)) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 });
  }

  await sql`DELETE FROM hbh_self_assessment WHERE participant_id = ${participant_id}`;
  const rows = await sql`
    INSERT INTO hbh_self_assessment (participant_id, hardest_habit)
    VALUES (${participant_id}, ${hardest_habit})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET() {
  const counts = await sql`
    SELECT hardest_habit, COUNT(*)::int AS count
    FROM hbh_self_assessment
    GROUP BY hardest_habit
    ORDER BY count DESC
  `;
  const byDept = await sql`
    SELECT p.department, h.hardest_habit, COUNT(*)::int AS count
    FROM hbh_self_assessment h
    JOIN participants p ON h.participant_id = p.id
    GROUP BY p.department, h.hardest_habit
    ORDER BY p.department, count DESC
  `;
  return NextResponse.json({ counts, byDept });
}
