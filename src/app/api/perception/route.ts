// Part 1: 회사 인상 응답
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { participant_id, perception_choice, custom_text } = await req.json();
  if (!participant_id) {
    return NextResponse.json({ error: 'missing participant_id' }, { status: 400 });
  }

  await sql`DELETE FROM company_perception WHERE participant_id = ${participant_id}`;

  const rows = await sql`
    INSERT INTO company_perception (participant_id, perception_choice, custom_text)
    VALUES (${participant_id}, ${perception_choice ?? null}, ${custom_text ?? null})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET() {
  const counts = await sql`
    SELECT perception_choice, COUNT(*)::int AS count
    FROM company_perception
    WHERE perception_choice IS NOT NULL
    GROUP BY perception_choice
    ORDER BY count DESC
  `;
  const customs = await sql`
    SELECT cp.custom_text, p.name, p.department, cp.created_at
    FROM company_perception cp
    JOIN participants p ON cp.participant_id = p.id
    WHERE cp.custom_text IS NOT NULL AND cp.custom_text <> ''
    ORDER BY cp.created_at DESC
    LIMIT 50
  `;
  return NextResponse.json({ counts, customs });
}
