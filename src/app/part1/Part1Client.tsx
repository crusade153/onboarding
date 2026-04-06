// src/app/part1/Part1Client.tsx
'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import QRCode from 'react-qr-code';

type Tab = 'intro' | 'realcase' | 'mistake' | 'butterfly' | 'shadow' | 'lesson';

const TABS: { key: Tab; label: string; sub: string }[] = [
  { key: 'intro',      label: '기준정보란?',     sub: '회사의 DNA' },
  { key: 'realcase',   label: '실제 사고',       sub: '6,000만 원 이상의 교훈' },
  { key: 'mistake',    label: '사소한 오입력',   sub: '발단: 무심코 한 타이핑' },
  { key: 'butterfly',  label: '시스템 나비효과', sub: '위기: 현장 마비와 적자' }, 
  { key: 'shadow',     label: '그림자 노동',     sub: '반전: 우리의 진짜 현실' },
  { key: 'lesson',     label: '공감 & 교훈',     sub: '결론: 시스템의 필요성' }, // 서브 텍스트 변경
];

export default function Part1Client() {
  const [tab, setTab] = useState<Tab>('intro');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <NavBar current="Part 1" step="01/04" />

      {/* 헤더 영역 */}
      <div style={{ borderBottom: '1px solid var(--glass-border)', padding: '24px 0 0px' }}>
        <div className="slide-container" style={{ paddingBottom: 0 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 6 }}>PART 1</p>
          <h1 className="headline" style={{ color: 'var(--text)', marginBottom: 12, fontSize: '2.25rem', wordBreak: 'keep-all' }}>
            기준이 무너지면 시스템이 무너진다
          </h1>
          <p className="body-md" style={{ color: 'var(--text2)', maxWidth: 800, wordBreak: 'keep-all', lineHeight: 1.6, marginBottom: 24 }}>
            나의 사소한 '0' 하나가 현장의 트럭을 멈추고, 10억 원의 결산 오류를 만듭니다. 각 부서의 
            데이터가 어떻게 연결되고, 한 줄의 오타가 어떤 나비효과를 부르는지 확인합니다.
          </p>

          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '12px 12px 0 0', width: 'fit-content' }}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '12px 24px', borderRadius: 8, cursor: 'pointer', border: 'none', background: 'transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                borderBottom: tab === t.key ? '2px solid var(--gold)' : '2px solid transparent',
                opacity: tab === t.key ? 1 : 0.6,
                transition: 'all 0.2s',
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: tab === t.key ? 'var(--gold)' : 'var(--text)' }}>{t.label}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{t.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="slide-container" style={{ flex: 1, paddingTop: 32, paddingBottom: 32, overflowY: 'auto' }}>
        {tab === 'intro' && <IntroSection />}
        {tab === 'realcase' && <RealCaseSection />}
        {tab === 'mistake' && <MistakeSection />}
        {tab === 'butterfly' && <ButterflySection />}
        {tab === 'shadow' && <ShadowWorkSection />}
        {tab === 'lesson' && <LessonSection />}
      </div>
    </div>
  );
}

/* ── 1. 기준정보란? ── */
function IntroSection() {
  const DEPTS = [
    { name: '영업·마케팅', icon: '🎯', color: 'var(--blue)', items: ['제품명 및 규격', '판매 단위 및 할인율', '거래처 마스터 정보'] },
    { name: '생산', icon: '🏭', color: 'var(--warning)', items: ['BOM 및 목표 수율', '공정 순서 (Routing)', '작업장 및 설비 마스터'] },
    { name: '물류', icon: '🚚', color: 'var(--teal)', items: ['제품 바코드 및 식별자', '보관 조건 (상온/냉장)', '부피(CBM) 및 총 중량'] },
    { name: '구매/자재', icon: '🛒', color: '#A78BFA', items: ['협력사 마스터', '발주 및 납품 단위', '자재 표준 단가'] },
    { name: '재무·원가', icon: '💰', color: 'var(--gold)', items: ['코스트센터 (귀속 부서)', '고정비/변동비 배부 기준', '세무 신고용 품목 분류'] },
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="glass-card" style={{ padding: '24px', borderLeft: '3px solid var(--gold)' }}>
          <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--gold)', marginBottom: 8 }}>📌 기준정보 (Master Data)</p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
            한 번 등록하면 수백, 수천 건의 거래에 반복 적용되는 데이터입니다. 품목코드, BOM, 단가, 거래처 정보 등이 해당합니다.
          </p>
        </div>
        <div className="glass-card" style={{ padding: '24px', borderLeft: '3px solid var(--blue)' }}>
          <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--blue)', marginBottom: 8 }}>📋 트랜잭션 (Transaction Data)</p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
            수주, 발주, 생산오더, 출고 등 매일 발생하는 전표입니다. 이 전표들은 기준정보를 자동으로 참조하여 생성됩니다.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, flex: 1 }}>
        {DEPTS.map(dept => (
          <div key={dept.name} className="glass-card pop-in" style={{ padding: '20px', borderTop: `3px solid ${dept.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: '1.5rem' }}>{dept.icon}</span>
              <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: dept.color, wordBreak: 'keep-all' }}>{dept.name}</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dept.items.map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: 8, wordBreak: 'keep-all', lineHeight: 1.4 }}>
                  <span style={{ color: dept.color, opacity: 0.5 }}>▪</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 2. 실제 사고 ── */
function RealCaseSection() {
  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '3px solid var(--red)' }}>
        <p style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--red)', wordBreak: 'keep-all' }}>
          프롤로그에서 예고한 그 이야기 — 데이터 한 칸이 비었을 때 실제로 무슨 일이 벌어졌는지 함께 보겠습니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, flex: 1 }}>
        <div className="glass-card pop-in" style={{ padding: '32px 24px', borderTop: '4px solid var(--blue)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--blue)' }}>01</span>
            <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', wordBreak: 'keep-all' }}>성공적인 수출 수주</p>
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
            영업팀이 <strong>라면 20만 식</strong> 수출 오더를 따냈습니다. 생산 라인은 완벽하게 가동되어 전량 생산을 완료했습니다.
          </p>
        </div>

        <div className="glass-card pop-in" style={{ padding: '32px 24px', borderTop: '4px solid var(--warning)', display: 'flex', flexDirection: 'column', gap: 16, animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--warning)' }}>02</span>
            <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', wordBreak: 'keep-all' }}>기준정보 한 칸의 공백</p>
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
            하지만 시스템에 <strong>'수출용 일부인 기준정보'</strong>가 미등록 상태였습니다. 포장 라인은 내수용 표기로 20만 식을 인쇄했습니다.
          </p>
        </div>

        <div className="glass-card pop-in" style={{ padding: '32px 24px', borderTop: '4px solid var(--red)', display: 'flex', flexDirection: 'column', gap: 16, animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--red)' }}>03</span>
            <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', wordBreak: 'keep-all' }}>돌이킬 수 없는 결과</p>
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
            현장은 <strong>20만 개의 포장지를 수작업으로 뜯어내고 재포장</strong>해야 했습니다. 재작업 비용 약 6,000만 원 이상 확정 손실이 발생했습니다.
          </p>
        </div>
      </div>

      <div className="glass-card pop-in" style={{ padding: '24px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', animationDelay: '0.4s' }}>
        <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.6 }}>
          제품에 아무 문제가 없었습니다. 품질도 완벽했습니다.<br/>
          <span style={{ color: 'var(--warning)' }}>오직 기준정보 한 칸이 비어 있었을 뿐인데,</span><br/>
          <span style={{ color: 'var(--red)', fontSize: '1.25rem', fontWeight: 800 }}>6,000만 원 이상이 허공으로 사라졌습니다.</span>
        </p>
      </div>
    </div>
  );
}

/* ── 3. 사소한 오입력 (발단) ── */
function MistakeSection() {
  const MISTAKES = [
    { type: '단위 오류', dept: '생산/구매', desc: '건더기스프 소요량 2g을 2kg으로 입력' },
    { type: '중량 오류', dept: '물류/생산', desc: '완제품 중량 500g을 500kg으로 입력' },
    { type: '환산 오류', dept: '영업/물류', desc: '라면 1박스(12개입)를 1개로 입력' },
    { type: '수량 오류', dept: '생산', desc: 'BOM 포장박스 소요량 1개를 10개로 입력' },
    { type: '보관 오류', dept: '물류/마케팅', desc: '냉동식품의 보관조건을 냉장으로 선택' },
    { type: '기한 오류', dept: '품질/영업', desc: '소비기한 300일을 180일로 축소 입력' },
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="glass-card" style={{ padding: '16px 24px', borderLeft: '4px solid var(--warning)' }}>
        <p style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--warning)', wordBreak: 'keep-all' }}>발단: "아차, 단위 하나 잘못 골랐네?"</p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginTop: 8 }}>사고는 언제나 무심코 한 타이핑 한 번에서 시작됩니다.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {MISTAKES.map((m, i) => (
          <div key={i} className="glass-card pop-in" style={{ padding: '24px', background: 'var(--glass-light)', animationDelay: `${i * 0.05}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ padding: '4px 12px', border: '1px solid var(--warning)', color: 'var(--warning)', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
                {m.type}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text3)', fontWeight: 600 }}>{m.dept}</span>
            </div>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.4, wordBreak: 'keep-all' }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 4. 시스템 나비효과 (위기) ── */
function ButterflySection() {
  const EFFECT_CARDS = [
    { icon: '🏭', title: '1,000배 발주 폭탄', cause: '건더기 2g → 2kg 오입력', physical: '시스템이 건더기스프를 무한 발주하여 현장 창고가 터져나가고 라인이 마비됩니다.', financial: '결국 소진하지 못한 자재 전량 폐기로 수억 원의 영업외비용이 발생합니다.' },
    { icon: '💣', title: '배부의 붕괴와 허위 적자', cause: '완제품 500g → 500kg 오입력', physical: '비정상적인 가동률 인식으로 제품 하나에 전체 공장의 원가가 1,000배 쏠립니다.', financial: '잘 팔리던 효자 상품이 심각한 적자 품목으로 둔갑하여 단종 위기를 맞습니다.' },
    { icon: '📉', title: '증발해버린 유령 재고', cause: '1박스(12개) → 1개 환산 오류', physical: '100박스(1,200개)를 출고했는데 전산엔 100개만 차감되어 재고가 맞지 않습니다.', financial: '전산 재고와 실물 갭(Gap)이 결산 시 회사의 쌩돈(재고자산감모손실)으로 처리됩니다.' },
    { icon: '🔥', title: '다 녹아내린 제품들', cause: '냉동 → 냉장 보관조건 오류', physical: 'WMS(창고관리)가 냉동식품을 상온 구역으로 입고 지시하여 제품이 녹아내립니다.', financial: '수억 원어치의 완제품이 전량 폐기 손실로 확정됩니다.' }
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="glass-card" style={{ padding: '16px 24px', borderLeft: '4px solid var(--red)' }}>
        <p style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--red)', wordBreak: 'keep-all' }}>위기: 물리적 대혼돈과 숨겨진 적자</p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginTop: 8 }}>사소한 불씨는 현장을 마비시키고(물리), 결국 회사의 이익을 깎아 먹습니다(재무).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {EFFECT_CARDS.map((card, idx) => (
          <div key={idx} className="glass-card pop-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 16, animationDelay: `${idx * 0.1}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '2rem' }}>{card.icon}</span>
              <div>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', wordBreak: 'keep-all' }}>{card.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ padding: '2px 8px', background: 'rgba(255, 59, 107, 0.1)', color: 'var(--red)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>원인</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>{card.cause}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--warning)' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--warning)', fontWeight: 700, marginBottom: 4 }}>현장 마비 (물리)</p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.5, wordBreak: 'keep-all' }}>{card.physical}</p>
              </div>
              <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--red)' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--red)', fontWeight: 700, marginBottom: 4 }}>재무 손실 (적자)</p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.5, wordBreak: 'keep-all' }}>{card.financial}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 5. 그림자 노동 (반전) ── */
function ShadowWorkSection() {
  const SHADOW_CASES = [
    { dept: '품질팀 (QA)', title: '시한부 재고와 의미 없는 특근', error: "검사 합격 후 '품질 대기' 상태 해제 깜빡함", desc: '전산상 재고 부족으로 불필요한 특근을 돌려 새 제품을 만듭니다. 몇 달 뒤 잊혀진 실물 재고가 창고 구석에서 발견되지만, 소비기한이 임박해 전량 폐기됩니다.', color: '#4F8EF7' },
    { dept: 'BM / 마케팅팀', title: '장기 적치 48만 식의 재앙', error: '판매 계획 단위 입력 시 환산 기준(식/번들) 착각', desc: '시스템이 48만 식을 초과 생산해버립니다. 영업은 못 판다, 마케팅은 난 그렇게 안 넣었다 싸우고, 결국 마진을 포기한 눈물의 땡처리 행사를 기획해야 합니다.', color: '#FF3B6B' },
    { dept: '생산팀', title: '먼지 구덩이 속 지옥의 실사', error: '자재를 넉넉히 타내려 수율(Yield)을 85%로 임의 조작', desc: '조작된 수율 탓에 시스템이 원부자재를 끝없이 초과 발주합니다. 결산 때 실물과 장부가 안 맞아 전 직원이 밤새 창고 먼지를 마시며 수기 재고 실사를 뜁니다.', color: '#D4A800' },
    { dept: '자재팀', title: '멈춰버린 라인과 야간 연장근무', error: '포장지 발주 시 단위(롤/천장) 착각', desc: '자재 고갈로 공장 라인이 올스톱되며 오늘의 생산성이 박살 납니다. 며칠 뒤 자재가 들어오면, 밀린 납기를 맞추기 위해 현장 작업자들은 야간 연장근무에 투입됩니다.', color: '#F97316' }
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '4px solid var(--purple)' }}>
        <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--purple)', marginBottom: 8, wordBreak: 'keep-all' }}>반전: 회사가 쉽게 망하지 않는 진짜 이유</p>
        <p style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
          방금 본 무시무시한 적자 사태가 매일 일어나진 않죠. 왜냐고요? <span style={{ color: 'var(--gold)', fontWeight: 700 }}>누군가 피땀 흘려 막고 있으니까요.</span><br/>
          시스템의 빵꾸를 수습하느라 우리의 소중한 근무 시간이 <strong>엑셀 수기 작성, 책임 공방, 주말 특근</strong> 같은 "그림자 노동"에 버려지고 있습니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {SHADOW_CASES.map((item, idx) => (
          <div key={idx} className="glass-card pop-in" style={{ padding: '24px', borderTop: `3px solid ${item.color}`, animationDelay: `${idx * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: item.color, padding: '4px 10px', background: `${item.color}20`, borderRadius: 12 }}>{item.dept}</span>
            </div>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12, wordBreak: 'keep-all' }}>{item.title}</p>
            <div style={{ background: 'var(--glass-light)', padding: '10px 12px', borderRadius: '8px', marginBottom: 12 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--red)', fontWeight: 700, marginRight: 8 }}>우리의 실수</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>{item.error}</span>
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.5, wordBreak: 'keep-all' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 6. 공감 & 교훈 (결론 및 시스템 예고) ── */
function LessonSection() {
  const [qrUrl, setQrUrl] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({ total_responses: 0, yes_count: 0, comments: [] as any[] });

  useEffect(() => {
    setQrUrl(`${window.location.origin}/survey`);

    const fetchData = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          fetch('/api/participants'),
          fetch('/api/survey')
        ]);
        const pData = await pRes.json();
        const sData = await sRes.json();
        setTotalUsers(pData.length);
        setStats(sData);
      } catch (e) { /* ignore */ }
    };

    fetchData();
    const t = setInterval(fetchData, 3000);
    return () => clearInterval(t);
  }, []);

  const yesRatio = stats.total_responses === 0 ? 0 : Math.round((stats.yes_count / stats.total_responses) * 100);

  return (
    <div className="anim-up" style={{ display: 'flex', gap: 24, height: '100%' }}>
      
      {/* 왼쪽: 실시간 공감 피드 (문제 인식) */}
      <div style={{ width: '420px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="glass-card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <p className="caption" style={{ color: 'var(--gold)', marginBottom: 4 }}>우리의 공감대</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)' }}>기준정보가 헷갈렸던 경험들</p>
            </div>
            <div style={{ background: '#fff', padding: '8px', borderRadius: '8px' }}>
              <QRCode value={qrUrl} size={64} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
            </div>
          </div>

          {/* 댓글 피드 영역 */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
            {stats.comments.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', textAlign: 'center', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                QR코드를 스캔하여<br/>업무 중 헷갈렸던 경험을 남겨주세요
              </div>
            ) : (
              stats.comments.map((c: any) => (
                <div key={c.id} className="pop-in" style={{ background: 'var(--glass-light)', padding: '16px', borderRadius: '12px', borderLeft: '3px solid var(--gold)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)' }}>{c.department}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{new Date(c.created_at).toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.5, wordBreak: 'keep-all' }}>"{c.comment}"</p>
                </div>
              ))
            )}
          </div>
          
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>
              참석자 중 <strong style={{ color: 'var(--gold)', fontSize: '1.0625rem' }}>{yesRatio}%</strong>가 기준정보로 혼란을 겪었습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽: 시스템 솔루션으로의 브릿지 (예고편) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
        <div className="glass-card" style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', borderLeft: '4px solid var(--blue)' }}>
          <p className="caption" style={{ color: 'var(--blue)', marginBottom: 12 }}>결론: 개인의 잘못이 아닙니다</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text)', marginBottom: 24, wordBreak: 'keep-all', lineHeight: 1.4 }}>
            "조심하겠습니다" 라는 다짐으로는<br/>
            결코 나비효과를 막을 수 없습니다.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="pop-in" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', animationDelay: '0.1s' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--warning)', marginBottom: 8 }}>❌ 의지와 엑셀의 한계</p>
              <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
                화면에 올라온 수많은 고민들처럼, 파편화된 환경에서 담당자 개인이 수만 개의 기준정보를 완벽하게 외우고 입력하는 것은 물리적으로 불가능합니다.
              </p>
            </div>
            
            <div className="pop-in" style={{ padding: '20px', background: 'var(--blue-dim)', border: '1px solid var(--blue)', borderRadius: '12px', animationDelay: '0.3s' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>✅ 원천 차단하는 통합 시스템</p>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
                지긋지긋한 그림자 노동을 끝내기 위해, 회사는 개인의 의지가 아닌 <strong>'시스템'</strong>으로 에러를 차단하는 <strong>SSOT(단일 진실 공급원) 환경</strong>을 구축했습니다.
              </p>
            </div>
          </div>

          <div className="pop-in" style={{ marginTop: 32, textAlign: 'center', animationDelay: '0.6s' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '-0.5px' }}>
              자, 이제 다음 장(Part 2)에서 우리의 일하는 방식을 바꿀<br/>새로운 무기들을 직접 확인해 보시죠.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}