// src/app/part2/Part2Client.tsx
'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

type Tab = 'ownership' | 'daily' | 'chain';

const TABS: { key: Tab; label: string; sub: string }[] = [
  { key: 'ownership', label: '1. 전원의 책임',     sub: '기준정보의 주인' },
  { key: 'daily',     label: '2. 일일관리의 힘',   sub: 'Daily Management' },
  { key: 'chain',     label: '3. 하나의 가치사슬', sub: '모든 부서의 연결' },
];

export default function Part2Client() {
  const [tab, setTab] = useState<Tab>('ownership');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <NavBar current="Part 2" step="02/04" />

      <div style={{ borderBottom: '1px solid var(--glass-border)', padding: '24px 0 16px' }}>
        <div className="slide-container" style={{ paddingBottom: 0 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 6 }}>Part 2</p>
          <h1 className="headline" style={{ color: 'var(--text)', marginBottom: 8, fontSize: '2rem' }}>
            문제를 앞서가는 매일의 습관
          </h1>
          <p className="body-md" style={{ color: 'var(--text2)', maxWidth: 800, wordBreak: 'keep-all', lineHeight: 1.5 }}>
            나비효과를 막는 방법은 멀리 있지 않습니다. 내가 매일 만들고 전달하는 정보의 정확성, 그것이 시작입니다.
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

      <div className="slide-container" style={{ flex: 1, paddingTop: 24, paddingBottom: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {tab === 'ownership' && <OwnershipSection />}
          {tab === 'daily' && <DailySection />}
          {tab === 'chain' && <ChainSection />}
        </div>

        <div className="anim-up" style={{ marginTop: 24, padding: '20px 24px', background: 'rgba(250, 204, 21, 0.05)', border: '1px solid var(--gold)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--gold)', marginBottom: 4 }}>우리의 매일이 완벽한 시스템을 만듭니다.</p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', wordBreak: 'keep-all' }}>
              모든 부서의 일일관리가 만났을 때, 원가팀의 대시보드에 어떤 일이 일어나는지 확인해 보세요.
            </p>
          </div>
          <Link href="/part3">
            <button style={{ background: 'var(--gold)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'transform 0.2s' }}>
              Part 3. 무인 자동화 대시보드 보기 ➡️
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── 1. 전원의 책임 ── */
function OwnershipSection() {
  const DEPTS = [
    { icon: '🎯', dept: '마케팅', color: 'var(--blue)',    owns: '제품 규격 · 용량 · 포장 기준',       risk: '규격이 모호하면 영업·생산·물류가 각각 다른 기준으로 움직입니다' },
    { icon: '💼', dept: '영업',   color: 'var(--teal)',     owns: '수주 조건 · 단가 · 납기 · 출하 조건', risk: '납기 오전달 한 건이 긴급 생산과 할증 비용을 만듭니다' },
    { icon: '🏭', dept: '생산',   color: 'var(--warning)',  owns: 'BOM · 공정 라우팅 · 수율 · 작업 실적', risk: '실적 오기록이 원가 왜곡과 자재 발주 오류로 이어집니다' },
    { icon: '🛒', dept: '구매',   color: '#A78BFA',         owns: '협력사 정보 · 자재 단가 · 리드타임',   risk: '단가·단위 오류가 예산 왜곡과 매입 채무 차이를 만듭니다' },
    { icon: '🔬', dept: '품질',   color: 'var(--red)',      owns: '검사 기준 · 보관 조건 · 소비기한',     risk: '보관 조건 한 줄이 전량 폐기 또는 리콜을 결정합니다' },
    { icon: '💰', dept: '재무·원가', color: 'var(--gold)',  owns: '원가 센터 · 배부 기준 · 세무 분류',    risk: '앞선 부서 데이터가 하나라도 틀리면 손익이 자동 왜곡됩니다' },
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center', borderBottom: '3px solid var(--gold)' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 800, wordBreak: 'keep-all' }}>
          <span className="text-gold">다음 사람이 참고하는 모든 정보</span>가 기준정보입니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, flex: 1 }}>
        {DEPTS.map((d, i) => (
          <div key={i} className="glass-card pop-in" style={{ padding: '16px', borderTop: `3px solid ${d.color}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.5rem' }}>{d.icon}</span>
              <p style={{ fontWeight: 800, fontSize: '1rem', color: d.color }}>{d.dept}</p>
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', wordBreak: 'keep-all' }}>{d.owns}</p>
            <div style={{ padding: '8px 12px', background: 'rgba(248,113,113,0.06)', borderRadius: 8, borderLeft: `3px solid var(--red)`, marginTop: 'auto' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.5, wordBreak: 'keep-all' }}>⚠ {d.risk}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 2. 일일관리의 힘 ── */
function DailySection() {
  const PILLARS = [
    { icon: '🎯', title: '선제적 검증', subtitle: 'Prevention',           desc: '전달 전 수치·단위·조건을 한 번 더 확인합니다.', color: 'var(--blue)' },
    { icon: '⚡', title: '당일 완결',   subtitle: 'Same-day Closure',      desc: '변화와 실적은 발생 당일, 그날 안에 기록합니다.', color: 'var(--warning)' },
    { icon: '🤝', title: '즉시 소통',   subtitle: 'Immediate Escalation',  desc: '이상하면 혼자 판단하지 않고 즉시 확인합니다.',   color: 'var(--teal)' },
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '4px solid var(--gold)' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 800, wordBreak: 'keep-all' }}>
          오늘의 정확한 데이터가 <span className="text-gold">내일의 올바른 의사결정</span>이 됩니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {PILLARS.map((p, idx) => (
          <div key={idx} className="glass-card pop-in" style={{ padding: '28px 24px', background: 'var(--glass-light)', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>{p.icon}</span>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: p.color }}>{p.title}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600, marginTop: 2, marginBottom: 12 }}>{p.subtitle}</p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--red)' }}>
          <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--red)', marginBottom: 8 }}>일일관리 부재 시</p>
          {['월말에 오류 발견 → 원인 추적 불가', '부서 간 수치 불일치 → 불신과 재작업', '소규모 오류 누적 → 수억 원 결산 차이'].map((t, i) => (
            <p key={i} style={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>✕ {t}</p>
          ))}
        </div>
        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--teal)' }}>
          <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--teal)', marginBottom: 8 }}>일일관리 실행 시</p>
          {['당일 이상 포착 → 즉시 원인 제거', '동일 수치로 의사결정 → 신뢰 기반 협업', '일 단위 정합성 → 결산이 확인 절차로'].map((t, i) => (
            <p key={i} style={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>✓ {t}</p>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '16px 24px', textAlign: 'center', background: 'rgba(201,168,76,0.05)', borderBottom: '3px solid var(--gold)' }}>
        <p style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text)', wordBreak: 'keep-all' }}>
          <span style={{ color: 'var(--blue)' }}>선제적 검증</span> + <span style={{ color: 'var(--warning)' }}>당일 완결</span> + <span style={{ color: 'var(--teal)' }}>즉시 소통</span> = <span className="text-gold" style={{ fontSize: '1.25rem', fontWeight: 900 }}>일일관리</span>
        </p>
      </div>
    </div>
  );
}

/* ── 3. 하나의 가치사슬 ── */
function ChainSection() {
  const CHAIN = [
    { dept: '마케팅', color: 'var(--blue)',   icon: '🎯', does: '제품 컨셉·규격·목표가 확정',          gives: '영업에게 스펙을, 생산에게 목표 원가를',       ifWrong: '영업·생산·물류가 각각 다른 기준으로 진행' },
    { dept: '영업',   color: 'var(--teal)',    icon: '💼', does: '수주 확보, 납기·단가·결제조건 협의',    gives: '생산에게 확정 수주를, 물류에게 출하 일정을',   ifWrong: '과잉 생산 또는 긴급 생산 반복, 비용 증가' },
    { dept: '생산',   color: 'var(--warning)', icon: '🏭', does: '원료 투입부터 완제품까지 전 공정 실적 기록', gives: '구매에게 소요량을, 원가에게 투입·수율 데이터를', ifWrong: '원가 왜곡, 다음 생산의 자재 발주량 오류' },
    { dept: '구매',   color: '#A78BFA',        icon: '🛒', does: '협력사 발주, 단가 협상, 입고 검수',     gives: '생산에게 입고 일정을, 재무에게 매입 채무를',    ifWrong: '예산 실적 왜곡, 리드타임 오류로 라인 정지' },
    { dept: '품질',   color: 'var(--red)',      icon: '🔬', does: '입고·공정·출하 검사, 판정 기준 관리',   gives: '생산에게 합격 판정을, 물류에게 보관 조건을',    ifWrong: '부적합 온도 보관 → 전량 폐기, 소비기한 오류 → 리콜' },
    { dept: '재무·원가', color: 'var(--gold)', icon: '💰', does: '전 부서 데이터 집계, 제품별 원가 산출',  gives: '경영진에게 손익 리포트를, 부서에게 실적 피드백을', ifWrong: '데이터 하나라도 틀리면 손익이 자동 왜곡' },
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '4px solid var(--gold)' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 800, wordBreak: 'keep-all' }}>
          <span className="text-gold">내 데이터의 끝</span>이 동료 업무의 시작입니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, flex: 1 }}>
        {CHAIN.map((c, i) => (
          <div key={i} className="glass-card pop-in" style={{ padding: '16px', borderTop: `3px solid ${c.color}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.25rem' }}>{c.icon}</span>
              <p style={{ fontWeight: 800, fontSize: '1rem', color: c.color }}>{c.dept}</p>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5, wordBreak: 'keep-all', flex: 1 }}>{c.does}</p>
            <div style={{ padding: '6px 10px', background: `${c.color}11`, borderRadius: 6 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text2)', wordBreak: 'keep-all' }}><span style={{ fontWeight: 700, color: c.color }}>→</span> {c.gives}</p>
            </div>
            <div style={{ padding: '6px 10px', background: 'rgba(248,113,113,0.05)', borderRadius: 6 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text2)', wordBreak: 'keep-all' }}><span style={{ fontWeight: 700, color: 'var(--red)' }}>⚠</span> {c.ifWrong}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '16px 24px', textAlign: 'center', background: 'rgba(201,168,76,0.05)', borderBottom: '3px solid var(--gold)' }}>
        <p style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
          경영 숫자의 정확도 = <span className="text-gold">가장 부정확한 부서의 수준</span>
        </p>
      </div>
    </div>
  );
}