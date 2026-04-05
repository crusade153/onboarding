// src/app/part1/Part1Client.tsx
'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import QRCode from 'react-qr-code';

type Tab = 'intro' | 'realcase' | 'mistake' | 'chaos' | 'loss' | 'lesson';

const TABS: { key: Tab; label: string; sub: string }[] = [
  { key: 'intro',    label: '기준정보란?',     sub: '회사의 DNA' },
  { key: 'realcase', label: '실제 사고',       sub: '6,000만 원의 교훈' },
  { key: 'mistake',  label: '사소한 오입력',   sub: '무심코 한 타이핑' },
  { key: 'chaos',    label: '현장의 나비효과', sub: '물리적 대혼돈' },
  { key: 'loss',     label: '숨겨진 적자',     sub: '재무적 재앙' },
  { key: 'lesson',   label: '공감 & 교훈',     sub: '우리의 목소리' },
];

export default function Part1Client() {
  const [tab, setTab] = useState<Tab>('intro');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <NavBar current="Part 1" step="01/04" />

      {/* 헤더 영역 */}
      <div style={{ borderBottom: '1px solid var(--glass-border)', padding: '24px 0 16px' }}>
        <div className="slide-container" style={{ paddingBottom: 0 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 6 }}>Part 1</p>
          <h1 className="headline" style={{ color: 'var(--text)', marginBottom: 8, fontSize: '2rem' }}>
            기준이 무너지면 시스템이 무너진다
          </h1>
          <p className="body-md" style={{ color: 'var(--text2)', maxWidth: 700, wordBreak: 'keep-all', lineHeight: 1.5 }}>
            나의 사소한 '0' 하나가 현장의 트럭을 멈추고, 10억 원의 결산 오류를 만듭니다. 각 부서의 데이터가 어떻게 연결되고, 한 줄의 오타가 어떤 나비효과를 부르는지 확인합니다.
          </p>

          <div style={{ display: 'flex', gap: 4, marginTop: 16, background: 'var(--glass-light)', padding: 4, borderRadius: 12, border: '1px solid var(--glass-border)', width: 'fit-content' }}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '8px 20px', borderRadius: 9, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', border: 'none',
                background: tab === t.key ? 'var(--gold-dim)' : 'transparent',
                color: tab === t.key ? 'var(--gold)' : 'var(--text2)',
                outline: tab === t.key ? '1px solid var(--gold)' : 'none',
                transition: 'all 0.15s',
              }}>
                {t.label}
                <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, opacity: 0.7, marginTop: 2 }}>{t.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="slide-container" style={{ flex: 1, paddingTop: 24, paddingBottom: 24, overflow: 'hidden' }}>
        {tab === 'intro' && <IntroSection />}
        {tab === 'realcase' && <RealCaseSection />}
        {tab === 'mistake' && <MistakeSection />}
        {tab === 'chaos' && <ChaosSection />}
        {tab === 'loss' && <LossSection />}
        {tab === 'lesson' && <LessonSection />}
      </div>
    </div>
  );
}

/* ── 1. 기준정보란? (보강) ── */
function IntroSection() {
  const DEPTS = [
    { name: '영업·마케팅', icon: '🎯', color: 'var(--blue)', items: ['제품명 및 규격', '판매 단위 및 할인율', '거래처 마스터 정보'] },
    { name: '생산', icon: '🏭', color: 'var(--warning)', items: ['BOM 및 목표 수율', '공정 순서 (Routing)', '작업장 및 설비 마스터'] },
    { name: '물류', icon: '🚚', color: 'var(--teal)', items: ['제품 바코드 및 식별자', '보관 조건 (상온/냉장)', '부피(CBM) 및 총 중량'] },
    { name: '구매', icon: '🛒', color: '#A78BFA', items: ['협력사 마스터', '발주 및 납품 단위', '자재 표준 단가'] },
    { name: '재무·원가', icon: '💰', color: 'var(--gold)', items: ['코스트센터 (귀속 부서)', '고정비/변동비 배부 기준', '세무 신고용 품목 분류'] },
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      {/* 상단 설명 */}
      <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderBottom: '3px solid var(--gold)' }}>
        <p className="title" style={{ fontSize: '1.25rem', marginBottom: 8, wordBreak: 'keep-all' }}>
          기준정보(Master Data)는 <span className="text-gold">회사의 DNA</span>입니다.
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', maxWidth: 800, margin: '0 auto', lineHeight: 1.6, wordBreak: 'keep-all' }}>
          ERP 시스템은 스스로 생각하지 않습니다. <strong>내가 입력하는 데이터가 다른 모든 부서 업무의 시작점</strong>이 됩니다.
        </p>
      </div>

      {/* 핵심 구분: 기준정보 vs 트랜잭션 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--gold)' }}>
          <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--gold)', marginBottom: 6 }}>📌 기준정보 (Master Data)</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
            한 번 등록하면 <strong>수백, 수천 건의 거래에 반복 적용</strong>되는 데이터입니다. 품목코드, BOM, 단가, 거래처 정보 등이 여기에 해당합니다.
          </p>
        </div>
        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--blue)' }}>
          <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--blue)', marginBottom: 6 }}>📋 트랜잭션 (Transaction Data)</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
            수주, 발주, 생산오더, 출고 등 <strong>매일 발생하는 업무 전표</strong>입니다. 이 전표들은 기준정보를 자동으로 참조하여 생성됩니다.
          </p>
        </div>
      </div>

      {/* 부서별 기준정보 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, flex: 1 }}>
        {DEPTS.map(dept => (
          <div key={dept.name} className="glass-card" style={{ padding: '16px', borderTop: `3px solid ${dept.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>{dept.icon}</span>
              <p style={{ fontWeight: 800, fontSize: '1rem', color: dept.color, wordBreak: 'keep-all' }}>{dept.name}</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {dept.items.map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: 6, wordBreak: 'keep-all', lineHeight: 1.4 }}>
                  <span style={{ color: dept.color, opacity: 0.5 }}>▪</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 하단 강조 */}
      <div className="glass-card" style={{ padding: '14px 20px', textAlign: 'center', background: 'rgba(201,168,76,0.05)' }}>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text)', fontWeight: 600, wordBreak: 'keep-all' }}>
          기준정보 1건이 틀리면, 그것을 참조하는 <span className="text-gold">수백 건의 전표가 동시에 틀려집니다.</span>
        </p>
      </div>
    </div>
  );
}

/* ── 2. 실제 사고 (프롤로그에서 이동한 6,000만원 사례) ── */
function RealCaseSection() {
  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* 도입 */}
      <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '3px solid var(--red)' }}>
        <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--red)', wordBreak: 'keep-all' }}>
          프롤로그에서 예고한 그 이야기 — 데이터 한 칸이 비었을 때 실제로 무슨 일이 벌어졌는지 함께 보겠습니다.
        </p>
      </div>

      {/* 타임라인 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, flex: 1 }}>
        {/* Step 1 */}
        <div className="glass-card-lg pop-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '3px solid var(--blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--blue)' }}>01</span>
            <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text)', wordBreak: 'keep-all' }}>성공적인 수출 수주</p>
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, wordBreak: 'keep-all', flex: 1 }}>
            영업팀이 해외 바이어의 <strong>라면 20만 식</strong> 수출 오더를 따냈습니다. 생산 라인은 하루 만에 완벽하게 가동되어 전량 생산을 완료했습니다.
          </p>
          <div style={{ padding: '10px 14px', background: 'rgba(79,142,247,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--blue)', fontWeight: 700 }}>✓ 수주 완료 · 생산 완료 · 품질 이상 없음</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card-lg pop-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '3px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--warning)' }}>02</span>
            <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text)', wordBreak: 'keep-all' }}>기준정보 한 칸의 공백</p>
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, wordBreak: 'keep-all', flex: 1 }}>
            그런데 시스템에 <strong>'수출용 날짜 표기(일부인) 기준정보'</strong>가 등록되어 있지 않았습니다. 포장 라인은 기본값인 내수용 표기로 20만 식 전량을 인쇄했습니다.
          </p>
          <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--warning)', fontWeight: 700 }}>⚠ 수출용 일부인 기준정보 — 미등록 상태</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-card-lg pop-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '3px solid var(--red)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--red)' }}>03</span>
            <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text)', wordBreak: 'keep-all' }}>돌이킬 수 없는 결과</p>
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, wordBreak: 'keep-all', flex: 1 }}>
            수출 불가 판정. 현장은 <strong>20만 개의 포장지를 일일이 수작업으로 뜯어내고 재포장</strong>해야 했습니다. 하루치 가공 라인이 통째로 멈췄습니다.
          </p>
          <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 8 }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--red)', fontWeight: 700 }}>✕ 재작업 비용 약 6,000만 원 확정 손실</p>
          </div>
        </div>
      </div>

      {/* 하단 교훈 */}
      <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center', background: 'rgba(201,168,76,0.05)', borderBottom: '3px solid var(--gold)' }}>
        <p style={{ fontSize: '1.0625rem', color: 'var(--text)', fontWeight: 700, lineHeight: 1.7, wordBreak: 'keep-all' }}>
          제품에 아무 문제가 없었습니다. 품질도 완벽했습니다.<br/>
          오직 <span className="text-gold">기준정보 한 칸이 비어 있었을 뿐</span>인데,<br/>
          <strong style={{ color: 'var(--red)' }}>6,000만 원이 허공으로 사라졌습니다.</strong>
        </p>
      </div>
    </div>
  );
}

/* ── 3. 사소한 오입력 ── */
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
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--warning)' }}>
        <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--warning)', marginBottom: 4 }}>"아차, 단위 하나 잘못 골랐네?"</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {MISTAKES.map((m, i) => (
          <div key={i} className="glass-card pop-in" style={{ padding: '20px', background: 'var(--glass-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className="badge" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}>{m.type}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600 }}>{m.dept}</span>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, wordBreak: 'keep-all' }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 4. 현장의 나비효과 ── */
function ChaosSection() {
  const CHAOS = [
    { title: '📦 창고를 덮친 1,000배 발주', cause: '건더기 2g → 2kg 오입력', effect: '시스템(MRP)이 건더기스프를 1,000배 발주합니다. 현장 창고는 터져나가고, 적재 공간이 없어 공장 라인까지 마비됩니다.', icon: '🏭' },
    { title: '💣 원가 폭탄과 배부의 붕괴', cause: '완제품 500g → 500kg 오입력', effect: '시스템은 중량을 기준으로 제조간접비와 물류비를 배부합니다. 이 제품 하나에 전체 공장의 비용이 1,000배 비정상적으로 쏠려버립니다.', icon: '⚖️' },
    { title: '📉 증발해버린 실물 재고', cause: '1박스(12개) → 1개 환산 오류', effect: '100박스(1,200개)를 출고했는데 전산엔 100개만 차감되어 재고 실사 시 현장과 사무실이 대혼란을 겪습니다.', icon: '🕵️‍♂️' },
    { title: '🧊 다 녹아내린 제품들', cause: '냉동 → 냉장 보관조건 오류', effect: 'WMS가 냉동식품을 상온 구역으로 입고 지시하여 수억 원어치가 전량 폐기됩니다.', icon: '🔥' },
  ];

  return (
    <div className="anim-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {CHAOS.map((c, i) => (
        <div key={i} className="glass-card pop-in" style={{ padding: '20px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ fontSize: '2.5rem', flexShrink: 0, width: 50, textAlign: 'center' }}>{c.icon}</div>
          <div>
            <p style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--red)', marginBottom: 6, wordBreak: 'keep-all' }}>{c.title}</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(248,113,113,0.1)', color: 'var(--red)', borderRadius: 4, fontWeight: 700 }}>원인</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text2)', fontWeight: 600, wordBreak: 'keep-all' }}>{c.cause}</span>
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text)', marginTop: 6, lineHeight: 1.5, wordBreak: 'keep-all' }}>{c.effect}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 5. 숨겨진 적자 ── */
function LossSection() {
  return (
    <div className="anim-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div className="glass-card-lg" style={{ padding: '24px', border: '1px solid rgba(45,212,191,0.3)' }}>
        <p className="caption" style={{ color: 'var(--teal)', marginBottom: 8 }}>재고 과잉 및 폐기 손실</p>
        <p style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 12, wordBreak: 'keep-all' }}>건더기 2g → 2kg의 최후</p>
        <p style={{ color: 'var(--text2)', lineHeight: 1.6, fontSize: '0.9375rem', wordBreak: 'keep-all' }}>
          1,000배 과대 발주된 자재는 유통기한 내에 소진하지 못하고 결국 전량 폐기됩니다. <strong>자재 매입에 묶여있던 회사의 소중한 현금은 고스란히 수억 원의 영업외비용(폐기손실)</strong>으로 재무제표에 꽂힙니다.
        </p>
      </div>

      <div className="glass-card-lg" style={{ padding: '24px', border: '1px solid rgba(45,212,191,0.3)' }}>
        <p className="caption" style={{ color: 'var(--teal)', marginBottom: 8 }}>원가 왜곡 (허위 적자)</p>
        <p style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 12, wordBreak: 'keep-all' }}>중량 500g → 500kg의 최후</p>
        <p style={{ color: 'var(--text2)', lineHeight: 1.6, fontSize: '0.9375rem', wordBreak: 'keep-all' }}>
          비정상적인 비용 배부 쏠림으로 인해, 잘 팔리던 효자 상품이 팩당 수만 원의 원가를 가진 심각한 적자 품목으로 둔갑합니다. <strong>경영진은 이 잘못된 데이터를 보고 생산을 강제로 중단시키는 치명적 오판</strong>을 내립니다.
        </p>
      </div>

      <div className="glass-card-lg" style={{ gridColumn: '1 / -1', padding: '20px 24px', background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.3)', display: 'flex', alignItems: 'center', gap: 20 }}>
         <div style={{ flex: 1 }}>
           <p className="caption" style={{ color: 'var(--red)', marginBottom: 8 }}>매출 누락 및 확정 손실</p>
           <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--red)', marginBottom: 8, wordBreak: 'keep-all' }}>1박스(12입) → 1개 단위 오류의 최후</p>
           <p style={{ color: 'var(--text)', lineHeight: 1.6, fontSize: '0.9375rem', wordBreak: 'keep-all' }}>
             12개를 출고하고도 전산에는 1개 분량의 매출만 인식됩니다. <strong>장부상 재고와 실제 창고 재고의 갭(Gap)은 결산 시 결국 회사의 쌩돈(재고자산감모손실)으로 처리</strong>되며, 연말 회계감사 시 중대 리스크로 번집니다.
           </p>
         </div>
      </div>
    </div>
  );
}

/* ── 6. 공감 & 교훈 ── */
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
      {/* 왼쪽: 통계 및 QR */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="glass-card-lg" style={{ padding: '28px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>우리의 공감대</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, wordBreak: 'keep-all', lineHeight: 1.4 }}>
            업무 기준이 모호해서<br/>헷갈렸던 적이 있나요?
          </h2>
          
          <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '16px', display: 'inline-block', margin: '0 auto 20px' }}>
            <QRCode value={qrUrl} size={140} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
          </div>
          
          <div style={{ background: 'var(--glass-hover)', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginBottom: 4 }}>
              접속자 {totalUsers}명 중 응답자 {stats.total_responses}명
            </p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', wordBreak: 'keep-all' }}>
              <span style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 900 }}>{stats.yes_count}명</span>이 '예'라고 답했습니다 ({yesRatio}%)
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽: 라이브 피드 및 결론 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
        
        {/* 결론 메시지 */}
        <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '4px solid var(--gold)' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
            우리 모두가 겪은 이 혼란은 누군가의 잘못이 아닙니다. <br/>
            <span className="text-gold">그래서 우리가 '정확한 기준정보'라는 약속을 세우려는 것입니다.</span>
          </p>
        </div>

        {/* 댓글 피드 */}
        <div className="glass-card-lg" style={{ flex: 1, padding: '24px', overflowY: 'auto', background: 'var(--glass-light)' }}>
          <p className="caption" style={{ marginBottom: 16 }}>동료들의 실제 경험담 (실시간)</p>
          
          {stats.comments.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>
              스마트폰으로 사연을 남겨주세요...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.comments.map((c: any) => (
                <div key={c.id} className="pop-in" style={{ background: 'var(--glass)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gold)' }}>{c.department}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text3)' }}>{new Date(c.created_at).toLocaleTimeString('ko-KR')}</span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                    "{c.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}