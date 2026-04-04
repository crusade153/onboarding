// src/lib/bom-data.ts

// ============================================================
// 데이터 타입 정의 (DB Schema 기준)
// ============================================================

export interface Product {
  code: string;
  name: string;
  category: string;
  unit: string;
  packing_info: string;
  standard_cost: number;
  selling_price: number;
}

export interface BomItem {
  id: number;
  product_code: string;
  item_code: string;
  item_name: string;
  category: '원재료' | '부재료' | '포장재';
  unit: string;
  qty_per: number;
  yield_rate: number;
  unit_price: number;
  note: string | null;
}

export interface FactoryConfig {
  id: number;
  factory_name: string;
  monthly_fixed_cost: number;
  capacity_per_month: number;
  variable_cost_per_pack: number;
}

// ============================================================
// 시뮬레이션 계산 함수 (순수 함수)
// ============================================================

export interface SimResult {
  itemName: string;
  normalYield: number;
  simYield: number;
  normalCostPer: number;
  simCostPer: number;
  diffPer: number;
  diffMonthly: number;
  diffAnnual: number;
}

const MONTHLY_PRODUCTION = 1_000_000; // 월 100만팩 (교육용 가정)

// DB에서 받아온 bomItems 배열을 매개변수로 받아 계산합니다.
export function simulateYield(
  itemCode: string,
  newYield: number,
  bomItems: BomItem[]
): SimResult | null {
  const item = bomItems.find((b) => b.item_code === itemCode);
  if (!item) return null;

  const normalCostPer = (item.qty_per / item.yield_rate) * item.unit_price;
  const simCostPer = (item.qty_per / newYield) * item.unit_price;
  const diffPer = simCostPer - normalCostPer;

  return {
    itemName: item.item_name,
    normalYield: item.yield_rate,
    simYield: newYield,
    normalCostPer: Math.round(normalCostPer),
    simCostPer: Math.round(simCostPer),
    diffPer: Math.round(diffPer),
    diffMonthly: Math.round(diffPer * MONTHLY_PRODUCTION),
    diffAnnual: Math.round(diffPer * MONTHLY_PRODUCTION * 12),
  };
}

// DB에서 받아온 공장 설정과 판가를 매개변수로 받아 계산합니다.
export function simulateUtilization(
  utilizationPct: number, 
  config: FactoryConfig, 
  sellingPrice: number
) {
  const production = Math.round(
    config.capacity_per_month * (utilizationPct / 100)
  );
  const fixedPerPack = production > 0
    ? Math.round(config.monthly_fixed_cost / production)
    : 0;
  const totalCostPerPack = config.variable_cost_per_pack + fixedPerPack;
  const marginPerPack = sellingPrice - totalCostPerPack;
  const marginRate = sellingPrice > 0
    ? ((marginPerPack / sellingPrice) * 100)
    : 0;

  return {
    production,
    fixedPerPack,
    variableCostPerPack: config.variable_cost_per_pack,
    totalCostPerPack,
    marginPerPack,
    marginRate: Math.round(marginRate * 10) / 10,
    isLoss: marginPerPack < 0,
  };
}

// ============================================================
// 판가/단위 및 코드 규칙 시나리오 (DB 의존성 없는 교육용 규칙)
// ============================================================

export const PRICE_SCENARIO = {
  product: '라면 A',
  correctUnit: '1박스 = 20팩',
  correctUnitMultiplier: 20,
  wrongUnit: '1박스 = 2팩',
  wrongUnitMultiplier: 2,
  pricePerPack: 850,   // 소비자가 기준
  monthlyBoxSales: 50000, 
};

export function simulatePriceUnit(useWrongUnit: boolean) {
  const multiplier = useWrongUnit
    ? PRICE_SCENARIO.wrongUnitMultiplier
    : PRICE_SCENARIO.correctUnitMultiplier;

  const revenuePerBox = PRICE_SCENARIO.pricePerPack * multiplier;
  const monthlyRevenue = revenuePerBox * PRICE_SCENARIO.monthlyBoxSales;

  return {
    revenuePerBox,
    monthlyRevenue,
    annualRevenue: monthlyRevenue * 12,
    error: useWrongUnit
      ? monthlyRevenue * 12 -
        PRICE_SCENARIO.pricePerPack *
          PRICE_SCENARIO.correctUnitMultiplier *
          PRICE_SCENARIO.monthlyBoxSales *
          12
      : 0,
  };
}

export const CODE_RULE = {
  pattern: '{카테고리}-{규격}-{용량}-{채널}',
  examples: [
    { code: 'NR-A-500-RT', description: '라면A 500g 소매용', isCorrect: true },
    { code: 'ramen_a_new', description: '임의 생성 — 규칙 미준수', isCorrect: false, problem: '채널 구분 없음 → 채널별 집계 불가' },
    { code: 'NRA500', description: '구분자 생략 — 파싱 불가', isCorrect: false, problem: '시스템 파싱 오류 → 동일 제품 분산 발생' },
  ],
};