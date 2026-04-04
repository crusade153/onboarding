// src/app/api/survey/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { participant_id, has_confusion, comment } = await req.json();
  
  if (!participant_id) {
    return NextResponse.json({ error: 'missing participant_id' }, { status: 400 });
  }

  // 한 사람이 여러 번 제출하는 것을 막으려면 기존 응답 삭제 (선택사항)
  await sql`DELETE FROM survey_responses WHERE participant_id = ${participant_id}`;
  
  const rows = await sql`
    INSERT INTO survey_responses (participant_id, has_confusion, comment)
    VALUES (${participant_id}, ${has_confusion}, ${comment || null})
    RETURNING *
  `;
  
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET() {
  // 응답 목록과 참여자 정보를 조인해서 가져옵니다.
  const rows = await sql`
    SELECT s.*, p.name, p.department 
    FROM survey_responses s
    JOIN participants p ON s.participant_id = p.id
    ORDER BY s.created_at DESC
  `;
  
  const yesCount = rows.filter(r => r.has_confusion).length;
  
  return NextResponse.json({
    total_responses: rows.length,
    yes_count: yesCount,
    comments: rows.filter(r => r.comment && r.comment.trim() !== '')
  });
}