// ============================================================
// 픽션 BOM 데이터 — 라면 A (하림산업 교육용 픽션)
// 실제 수치가 아닌 교육 시뮬레이션용 가상 데이터
// ============================================================

export const PRODUCT = {
  code: 'NR-A-500-RT',  // 라면(N) / 레귤러(R) / A / 500g / 소매(RT)
  name: '라면 A',
  unit: 'box',
  packing: '20팩/박스',
  standardCost: 4200, // 원/팩 (정상 기준)
};

export interface BomItem {
  code: string;
  name: string;
  category: '원재료' | '부재료' | '포장재';
  unit: string;
  qtyPer: number;      // 완제품 1팩 기준 투입량
  yieldRate: number;   // 수율 (0~1), 예: 0.92 = 92%
  unitPrice: number;   // 원/kg or 원/ea
  note?: string;
}

export const BOM_ITEMS: BomItem[] = [
  {
    code: 'RM-FLOUR-001',
    name: '밀가루',
    category: '원재료',
    unit: 'kg',
    qtyPer: 0.085,   // 팩당 85g 투입
    yieldRate: 0.92, // 수율 92% — 면 성형 손실
    unitPrice: 620,  // 620원/kg
    note: '면 성형 공정 손실 포함',
  },
  {
    code: 'RM-PALM-001',
    name: '팜유',
    category: '원재료',
    unit: 'kg',
    qtyPer: 0.018,   // 18g
    yieldRate: 0.97,
    unitPrice: 1340,
    note: '튀김 공정 증발 손실',
  },
  {
    code: 'RM-SALT-001',
    name: '정제염',
    category: '원재료',
    unit: 'kg',
    qtyPer: 0.006,   // 6g
    yieldRate: 0.99,
    unitPrice: 180,
  },
  {
    code: 'RM-SPICE-001',
    name: '분말스프 믹스',
    category: '원재료',
    unit: 'kg',
    qtyPer: 0.045,   // 45g
    yieldRate: 0.98,
    unitPrice: 3800,
    note: '계량 손실 포함',
  },
  {
    code: 'RM-VEGE-001',
    name: '건조야채 (건더기)',
    category: '부재료',
    unit: 'kg',
    qtyPer: 0.012,   // 12g
    yieldRate: 0.95,
    unitPrice: 8200,
    note: '건조 공정 중량 손실',
  },
  {
    code: 'PM-FILM-001',
    name: '내포장 필름',
    category: '포장재',
    unit: 'ea',
    qtyPer: 1,
    yieldRate: 0.995,
    unitPrice: 32,   // 32원/매
    note: '불량률 포함',
  },
  {
    code: 'PM-BOX-001',
    name: '외박스 (20팩 단위)',
    category: '포장재',
    unit: 'ea',
    qtyPer: 0.05,    // 1박스 = 20팩 → 팩당 1/20
    yieldRate: 0.998,
    unitPrice: 420,  // 420원/박스
  },
];

// ============================================================
// 수율 시뮬레이션 계산
// ============================================================

export interface SimResult {
  itemName: string;
  normalYield: number;
  simYield: number;
  normalCostPer: number; // 원/팩
  simCostPer: number;
  diffPer: number;       // 팩당 원가 차이
  diffMonthly: number;   // 월 생산 100만팩 기준
  diffAnnual: number;
}

const MONTHLY_PRODUCTION = 1_000_000; // 월 100만팩 (교육용 가정)

export function simulateYield(
  itemCode: string,
  newYield: number
): SimResult | null {
  const item = BOM_ITEMS.find((b) => b.code === itemCode);
  if (!item) return null;

  const normalCostPer =
    (item.qtyPer / item.yieldRate) * item.unitPrice;
  const simCostPer = (item.qtyPer / newYield) * item.unitPrice;
  const diffPer = simCostPer - normalCostPer;

  return {
    itemName: item.name,
    normalYield: item.yieldRate,
    simYield: newYield,
    normalCostPer: Math.round(normalCostPer),
    simCostPer: Math.round(simCostPer),
    diffPer: Math.round(diffPer),
    diffMonthly: Math.round(diffPer * MONTHLY_PRODUCTION),
    diffAnnual: Math.round(diffPer * MONTHLY_PRODUCTION * 12),
  };
}

// ============================================================
// 판가/단위 오류 시나리오
// ============================================================

export const PRICE_SCENARIO = {
  product: '라면 A',
  correctUnit: '1박스 = 20팩',
  correctUnitMultiplier: 20,
  wrongUnit: '1박스 = 2팩',
  wrongUnitMultiplier: 2,
  pricePerPack: 850,   // 소비자가 기준
  monthlyBoxSales: 50000, // 월 5만 박스 판매
};

export function simulatePriceUnit(useWrongUnit: boolean) {
  const multiplier = useWrongUnit
    ? PRICE_SCENARIO.wrongUnitMultiplier
    : PRICE_SCENARIO.correctUnitMultiplier;

  const revenuePerBox =
    PRICE_SCENARIO.pricePerPack * multiplier;
  const monthlyRevenue =
    revenuePerBox * PRICE_SCENARIO.monthlyBoxSales;

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

// ============================================================
// 제품 코드 규칙 시나리오
// ============================================================

export const CODE_RULE = {
  pattern: '{카테고리}-{규격}-{용량}-{채널}',
  segments: [
    { label: '카테고리', example: 'NR (라면-레귤러)', position: 0 },
    { label: '규격', example: 'A / B / C', position: 1 },
    { label: '용량', example: '500 (500g)', position: 2 },
    { label: '채널', example: 'RT(소매) / OT(온라인) / FS(급식)', position: 3 },
  ],
  examples: [
    {
      code: 'NR-A-500-RT',
      description: '라면A 500g 소매용',
      isCorrect: true,
    },
    {
      code: 'NR-A-500-OT',
      description: '라면A 500g 온라인용',
      isCorrect: true,
    },
    {
      code: 'ramen_a_new',
      description: '담당자 임의 생성 — 규칙 미준수',
      isCorrect: false,
      problem: '채널 구분 없음 → 채널별 실적 집계 불가',
    },
    {
      code: 'NRA500',
      description: '구분자 생략 — 파싱 불가',
      isCorrect: false,
      problem: '시스템 파싱 오류 → 동일 제품 3개 코드 발생',
    },
    {
      code: 'NR-A-500',
      description: '채널 코드 누락',
      isCorrect: false,
      problem: '온라인/소매 실적 합산 → 캠페인 효과 측정 불가',
    },
  ],
};
