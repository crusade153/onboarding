// src/app/part1/page.tsx
import Part1Client from './Part1Client';
import { getBomItems } from '@/actions/db-actions';

export default async function Part1Page() {
  // Server Action을 통해 미리 데이터를 조회하여 클라이언트로 전달합니다.
  const bomItems = await getBomItems('NR-A-500-RT');

  return <Part1Client initialBomItems={bomItems} />;
}