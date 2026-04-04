// src/app/part2/page.tsx
import Part2Client from './Part2Client';
import { getFactoryConfig, getProducts } from '@/actions/db-actions';

export default async function Part2Page() {
  const config = await getFactoryConfig();
  const products = await getProducts();
  
  return <Part2Client factoryConfig={config[0]} product={products[0]} />;
}