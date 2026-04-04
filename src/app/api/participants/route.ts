import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { name, department, session_id = 'default' } = await req.json();
  if (!name || !department) {
    return NextResponse.json({ error: 'name and department required' }, { status: 400 });
  }
  const sql = getDb();
  const rows = await sql`
    INSERT INTO participants (name, department, session_id)
    VALUES (${name}, ${department}, ${session_id})
    RETURNING id, name, department, joined_at
  ` as Record<string, unknown>[];
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id') ?? 'default';
  const since = searchParams.get('since');
  const sql = getDb();

  let rows;
  if (since) {
    rows = await sql`
      SELECT id, name, department, joined_at
      FROM participants
      WHERE session_id = ${session_id} AND joined_at > ${since}
      ORDER BY joined_at ASC
    `;
  } else {
    rows = await sql`
      SELECT id, name, department, joined_at
      FROM participants
      WHERE session_id = ${session_id}
      ORDER BY joined_at ASC
    `;
  }
  return NextResponse.json(rows);
}
