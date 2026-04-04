// src/app/part2/Part2Client.tsx
'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

type Tab = 'rewind' | 'principle' | 'habit';

const TABS: { key: Tab; label: string; sub: string }[] = [
  { key: 'rewind',    label: '1. 되돌리기', sub: '오류의 추적' },
  { key: 'principle', label: '2. 관리 원칙', sub: '살아있는 데이터' },
  { key: 'habit',     label: '3. 하림의 실행습관', sub: '일일관리의 힘' },
];

export default function Part2Client() {
  const [tab, setTab] = useState<Tab>('rewind');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <NavBar current="Part 2" step="02/04" />

      {/* 헤더 영역 */}
      <div style={{ borderBottom: '1px solid var(--glass-border)', padding: '24px 0 16px' }}>
        <div className="slide-container" style={{ paddingBottom: 0 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 6 }}>Part 2</p>
          <h1 className="headline" style={{ color: 'var(--text)', marginBottom: 8, fontSize: '2rem' }}>
            기준을 세우는 사람들
          </h1>
          <p className="body-md" style={{ color: 'var(--text2)', maxWidth: 800, wordBreak: 'keep-all', lineHeight: 1.5 }}>
            Part 1에서 본 끔찍한 나비효과를 막는 방법은 멀리 있지 않습니다. 손익의 왜곡을 역추적해보면 결국 시스템의 근간인 '기준정보'와 그것을 다루는 '우리의 습관'에 도달하게 됩니다.
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
      <div className="slide-container" style={{ flex: 1, paddingTop: 24, paddingBottom: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {tab === 'rewind' && <RewindSection />}
          {tab === 'principle' && <PrincipleSection />}
          {tab === 'habit' && <HabitSection />}
        </div>

        {/* 4. 전환 멘트 (하단 고정) */}
        <div className="anim-up" style={{ marginTop: 24, padding: '20px 24px', background: 'rgba(250, 204, 21, 0.05)', border: '1px solid var(--gold)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--gold)', marginBottom: 4 }}>우리의 '일일관리'가 완벽한 시스템을 만듭니다.</p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', wordBreak: 'keep-all' }}>
              현장의 철저한 일일관리와 정확한 기준정보가 만났을 때, 사람의 손을 타지 않는 원가팀의 대시보드에 어떤 마법이 펼쳐지는지 확인해 보세요.
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

// 1. 되돌리기 — 오류는 어디서 잡아야 하는가
function RewindSection() {
  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%', justifyContent: 'center' }}>
      
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid var(--red)' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8, wordBreak: 'keep-all' }}>
          "문제는 항상 리포트에서 발견되지만, 답은 항상 기준정보에 있다."
        </p>
        <p style={{ color: 'var(--text2)', fontSize: '0.9375rem', wordBreak: 'keep-all' }}>
          결산이 틀어졌을 때, 현장을 탓하거나 시스템 오류를 의심하기 전 과정을 거슬러 올라가 봅니다.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        {/* Step 3 (역추적 시작) */}
        <div className="glass-card pop-in" style={{ flex: 1, padding: '24px', textAlign: 'center', background: 'rgba(248,113,113,0.1)' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>📉</p>
          <p className="caption" style={{ color: 'var(--red)', marginBottom: 4 }}>발견 (결산 마감일)</p>
          <p style={{ fontSize: '1.125rem', fontWeight: 800, wordBreak: 'keep-all' }}>수억 원의 적자 보고</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginTop: 8 }}>경영진 리포트에서 손익 왜곡 확인</p>
        </div>

        <div style={{ margin: '0 16px', fontSize: '1.5rem', color: 'var(--text3)' }}>⬅️</div>

        {/* Step 2 (에러 수정: style 평탄화) */}
        <div className="glass-card pop-in" style={{ flex: 1, padding: '24px', textAlign: 'center', animationDelay: '0.1s' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>🏭</p>
          <p className="caption" style={{ color: 'var(--warning)', marginBottom: 4 }}>추적 (공장 실적)</p>
          <p style={{ fontSize: '1.125rem', fontWeight: 800, wordBreak: 'keep-all' }}>비정상적인 재료비 투입</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginTop: 8 }}>현장 과대 출고 및 수율 악화 기록</p>
        </div>

        <div style={{ margin: '0 16px', fontSize: '1.5rem', color: 'var(--text3)' }}>⬅️</div>

        {/* Step 1 (에러 수정: style 평탄화) */}
        <div className="glass-card pop-in" style={{ flex: 1, padding: '24px', textAlign: 'center', borderTop: '4px solid var(--gold)', animationDelay: '0.2s' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>🧬</p>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 4 }}>해답 (Master Data)</p>
          <p style={{ fontSize: '1.125rem', fontWeight: 800, wordBreak: 'keep-all' }}>BOM / 라우팅 오입력</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 700, marginTop: 8 }}>"건더기 2g → 2kg 오타 한 줄"</p>
        </div>
      </div>
    </div>
  );
}

// 2. 기준정보 관리의 원칙 — 누가, 언제, 어떻게
function PrincipleSection() {
  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--blue)' }}>
        <p style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 8 }}>기준정보는 '살아있는 데이터'입니다</p>
        <p style={{ color: 'var(--text2)', fontSize: '0.9375rem', wordBreak: 'keep-all' }}>
          시스템 오픈할 때 한 번 입력하고 끝나는 정적 데이터가 아닙니다. 현장의 레시피가 바뀌고 포장 규격이 변할 때마다 <strong>유기적으로 호흡하며 업데이트</strong>되어야 합니다.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '32px', background: 'var(--glass-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--glass-border)', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--blue)', width: '28%', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>📝</span>
            <p className="caption" style={{ color: 'var(--blue)', marginBottom: 4 }}>현장 변화 발생</p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700 }}>레시피, 공정, 규격의 변경</p>
          </div>

          <span style={{ position: 'relative', zIndex: 1, background: 'var(--bg)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.875rem', color: 'var(--text2)', border: '1px solid var(--glass-border)' }}>요청 & 승인</span>

          <div style={{ position: 'relative', zIndex: 1, background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gold)', width: '28%', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>💻</span>
            <p className="caption" style={{ color: 'var(--gold)', marginBottom: 4 }}>기준정보 변경</p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700 }}>권한자의 시스템 즉시 업데이트</p>
          </div>

          <span style={{ position: 'relative', zIndex: 1, background: 'var(--bg)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.875rem', color: 'var(--text2)', border: '1px solid var(--glass-border)' }}>동기화</span>

          <div style={{ position: 'relative', zIndex: 1, background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--teal)', width: '28%', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>🔄</span>
            <p className="caption" style={{ color: 'var(--teal)', marginBottom: 4 }}>전사 프로세스 반영</p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700 }}>정확한 발주, 생산, 원가 집계</p>
          </div>
        </div>
        <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--text3)', fontSize: '0.875rem' }}>
          * 임의 변경은 사고의 원인이 됩니다. 반드시 부서 간 합의된 <strong>표준 승인 프로세스</strong>를 준수해야 합니다.
        </div>
      </div>
    </div>
  );
}

// 3. 하림의 실행습관: 일일관리
function HabitSection() {
  const HABITS = [
    {
      icon: '🧐',
      title: '입력 전 1초의 사전 대비',
      desc: '단위(g, kg, BOX)와 소수점 위치를 한 번 더 확인하세요. 이 1초의 선제적 관리가 월말 10억 원의 재무 사고를 막는 가장 강력한 일일관리입니다.',
      color: 'var(--blue)'
    },
    {
      icon: '⚡',
      title: '미루지 않는 당일 반영',
      desc: '"나중에 몰아서 입력해야지"는 일일관리의 적입니다. 현장의 변화와 실적은 사후 수습이 아닌, 발생 즉시 그날그날 시스템에 반영되어야 합니다.',
      color: 'var(--warning)'
    },
    {
      icon: '🤝',
      title: '의심될 땐 선제적 공유',
      desc: '데이터가 이상하거나 기준이 모호하다면 다음 날로 미루지 마세요. 즉시 유관부서와 공유하여 문제를 초기에 차단하는 것이 우리의 방식입니다.',
      color: 'var(--teal)'
    }
  ];

  return (
    <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--teal)' }}>
         <p style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 8 }}>"하림의 실행습관: 일일관리(Daily Management)"</p>
         <p style={{ color: 'var(--text2)', fontSize: '0.9375rem', wordBreak: 'keep-all' }}>
           거창한 시스템 혁신보다 중요한 것은, 미리미리 세부적으로 문제를 관리하고 사전에 대비하는 우리의 일일관리 습관입니다. 내가 꼼꼼하게 입력한 오늘의 데이터가 내일의 정확한 경영 지표가 됩니다.
         </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {HABITS.map((habit, idx) => (
          <div key={idx} className="glass-card pop-in" style={{ padding: '24px', background: 'var(--glass-light)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: '2.5rem' }}>{habit.icon}</span>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: habit.color, wordBreak: 'keep-all' }}>{habit.title}</p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
              {habit.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}