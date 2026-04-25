// src/app/api/init/route.ts
// V2 스키마: 멱등(IF NOT EXISTS). 관리자 패널의 'DB 초기화' 버튼이 호출합니다.
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST() {
  // 강연 세션 (관리자가 시작/종료)
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      session_code VARCHAR(20) UNIQUE NOT NULL,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      ended_at TIMESTAMPTZ,
      is_active BOOLEAN DEFAULT TRUE
    )
  `;

  // 참여자 (Prologue QR로 등록)
  await sql`
    CREATE TABLE IF NOT EXISTS participants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      session_id VARCHAR(50) NOT NULL DEFAULT 'default',
      session_code VARCHAR(20),
      entry_motivation TEXT,
      joined_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE participants ADD COLUMN IF NOT EXISTS session_code VARCHAR(20)`;
  await sql`ALTER TABLE participants ADD COLUMN IF NOT EXISTS entry_motivation TEXT`;

  // Part 1 — 회사 인상 응답
  await sql`
    CREATE TABLE IF NOT EXISTS company_perception (
      id SERIAL PRIMARY KEY,
      participant_id INTEGER REFERENCES participants(id),
      perception_choice VARCHAR(50),
      custom_text TEXT,
      session_code VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE company_perception ADD COLUMN IF NOT EXISTS session_code VARCHAR(20)`;

  // Part 2 — HBH 가장 어려운 습관
  await sql`
    CREATE TABLE IF NOT EXISTS hbh_self_assessment (
      id SERIAL PRIMARY KEY,
      participant_id INTEGER REFERENCES participants(id),
      hardest_habit VARCHAR(20),
      session_code VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE hbh_self_assessment ADD COLUMN IF NOT EXISTS session_code VARCHAR(20)`;

  // Part 3 — 감사 리스트
  await sql`
    CREATE TABLE IF NOT EXISTS gratitude_list (
      id SERIAL PRIMARY KEY,
      participant_id INTEGER REFERENCES participants(id),
      saved_from VARCHAR(50),
      session_code VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE gratitude_list ADD COLUMN IF NOT EXISTS session_code VARCHAR(20)`;

  // 기존 응답 행 backfill: 참여자의 session_code 로 채워넣기
  await sql`
    UPDATE company_perception cp
    SET session_code = p.session_code
    FROM participants p
    WHERE cp.participant_id = p.id AND cp.session_code IS NULL
  `;
  await sql`
    UPDATE hbh_self_assessment h
    SET session_code = p.session_code
    FROM participants p
    WHERE h.participant_id = p.id AND h.session_code IS NULL
  `;
  await sql`
    UPDATE gratitude_list g
    SET session_code = p.session_code
    FROM participants p
    WHERE g.participant_id = p.id AND g.session_code IS NULL
  `;

  return NextResponse.json({ ok: true });
}
