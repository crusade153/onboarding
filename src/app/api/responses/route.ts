import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { participant_id, question_type, response_text } = await req.json();
  if (!participant_id || !question_type || !response_text) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  const sql = getDb();
  const rows = await sql`
    INSERT INTO responses (participant_id, question_type, response_text)
    VALUES (${participant_id}, ${question_type}, ${response_text})
    RETURNING *
  ` as Record<string, unknown>[];
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const question_type = searchParams.get('type');
  const sql = getDb();

  let rows;
  if (question_type) {
    rows = await sql`
      SELECT response_text, responded_at
      FROM responses
      WHERE question_type = ${question_type}
      ORDER BY responded_at DESC
      LIMIT 200
    `;
  } else {
    rows = await sql`
      SELECT question_type, response_text, responded_at
      FROM responses
      ORDER BY responded_at DESC
      LIMIT 200
    `;
  }
  return NextResponse.json(rows);
}
