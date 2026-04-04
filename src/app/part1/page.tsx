// src/app/part1/page.tsx
import Part1Client from './Part1Client';

export default function Part1Page() {
  // 스토리텔링 위주로 개편되면서 DB에서 BOM을 미리 불러올 필요가 없어졌습니다.
  return <Part1Client />;
}