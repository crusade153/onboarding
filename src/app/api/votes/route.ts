import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { participant_id, part, option_key } = await req.json();
  if (!participant_id || !part || !option_key) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  const sql = getDb();
  await sql`DELETE FROM votes WHERE participant_id = ${participant_id} AND part = ${part}`;
  const rows = await sql`
    INSERT INTO votes (participant_id, part, option_key)
    VALUES (${participant_id}, ${part}, ${option_key})
    RETURNING *
  ` as Record<string, unknown>[];
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const part = searchParams.get('part') ?? 'part2';
  const sql = getDb();
  const rows = await sql`
    SELECT option_key, COUNT(*)::int AS count
    FROM votes
    WHERE part = ${part}
    GROUP BY option_key
    ORDER BY count DESC
  `;
  return NextResponse.json(rows);
}
