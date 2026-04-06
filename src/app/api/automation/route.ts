// src/app/api/automation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { participant_id, wish_text, department } = await req.json();

  if (!wish_text?.trim()) {
    return NextResponse.json({ error: 'missing wish_text' }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO automation_wishes (participant_id, wish_text, department)
    VALUES (${participant_id ?? null}, ${wish_text}, ${department ?? null})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET() {
  const rows = await sql`
    SELECT w.id, w.wish_text, w.department, w.created_at,
           p.name
    FROM automation_wishes w
    LEFT JOIN participants p ON w.participant_id = p.id
    ORDER BY w.created_at DESC
    LIMIT 50
  `;
  return NextResponse.json(rows);
}