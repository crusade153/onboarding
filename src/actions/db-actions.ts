// src/actions/db-actions.ts
'use server';

import { sql } from '@/lib/db';
import { BomItem, FactoryConfig, Product } from '@/lib/bom-data';

export async function getProducts(): Promise<Product[]> {
  const products = await sql`SELECT * FROM products`;
  return products.map(p => ({
    ...p,
    standard_cost: Number(p.standard_cost),
    selling_price: Number(p.selling_price)
  })) as Product[];
}

export async function getBomItems(productCode: string): Promise<BomItem[]> {
  const items = await sql`SELECT * FROM bom_items WHERE product_code = ${productCode} ORDER BY id ASC`;
  return items.map(item => ({
    ...item,
    qty_per: Number(item.qty_per),
    yield_rate: Number(item.yield_rate),
    unit_price: Number(item.unit_price)
  })) as BomItem[];
}

export async function getFactoryConfig(): Promise<FactoryConfig[]> {
  const config = await sql`SELECT * FROM factory_config LIMIT 1`;
  return config.map(c => ({
    ...c,
    monthly_fixed_cost: Number(c.monthly_fixed_cost),
    capacity_per_month: Number(c.capacity_per_month),
    variable_cost_per_pack: Number(c.variable_cost_per_pack)
  })) as FactoryConfig[];
}