// src/app/part2/page.tsx
import Part2Client from './Part2Client';

export default function Part2Page() {
  // 스토리텔링 위주로 개편되면서 DB 데이터를 미리 불러와서 넘겨줄 필요가 없어졌습니다.
  return <Part2Client />;
}