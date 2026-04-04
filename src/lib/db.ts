import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('환경변수에 DATABASE_URL이 설정되지 않았습니다.');
}

// SQL 태그드 템플릿 리터럴을 통해 안전하게 쿼리 실행
export const sql = neon(process.env.DATABASE_URL);