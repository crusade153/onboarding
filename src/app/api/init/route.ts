import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST() {
  await sql`
    CREATE TABLE IF NOT EXISTS participants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      session_id VARCHAR(50) NOT NULL DEFAULT 'default',
      joined_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      participant_id INTEGER REFERENCES participants(id),
      part VARCHAR(50) NOT NULL,
      option_key VARCHAR(100) NOT NULL,
      voted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS responses (
      id SERIAL PRIMARY KEY,
      participant_id INTEGER REFERENCES participants(id),
      question_type VARCHAR(50) NOT NULL,
      response_text TEXT NOT NULL,
      responded_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      participant_id INTEGER REFERENCES participants(id),
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  return NextResponse.json({ ok: true });
}