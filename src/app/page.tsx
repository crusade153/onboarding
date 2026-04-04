'use client';

import Link from 'next/link';

const SLIDES = [
  { href: '/prologue', step: '00', label: 'Prologue',  desc: '우리는 지금 흩어져 있다', color: '#4F8EF7' },
  { href: '/part1',   step: '01', label: 'Part 1',    desc: '기준이 무너지면 시스템이 무너진다', color: '#C9A84C' },
  { href: '/part2',   step: '02', label: 'Part 2',    desc: '당신의 행위가 숫자가 된다', color: '#2DD4BF' },
  { href: '/part3',   step: '03', label: 'Part 3',    desc: '우리가 함께 세운다', color: '#C9A84C' },
  { href: '/epilogue',step: '04', label: 'Epilogue',  desc: 'Systema — 지금 이 순간부터', color: '#4F8EF7' },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p className="caption" style={{ color: 'rgba(201,168,76,0.7)', marginBottom: 16 }}>하림산업 원가기획 교육 플랫폼</p>
          <h1 className="display text-gold" style={{ marginBottom: 16 }}>Systema</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', maxWidth: 520, lineHeight: 1.7, letterSpacing: '-0.01em' }}>
            함께 세우는 시스템 &mdash; A system is not given. It is built together.
          </p>
          <hr className="divider" style={{ marginTop: 32 }} />
        </div>

        {/* Two columns: slides + utility */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>

          {/* Slides */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="caption" style={{ marginBottom: 12 }}>강연 슬라이드</p>
            {SLIDES.map((s) => (
              <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', transition: 'all 0.18s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.085)'; (e.currentTarget as HTMLElement).style.borderColor = `${s.color}50`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.borderColor = ''; }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 800, color: s.color, width: 40, flexShrink: 0, opacity: 0.9 }}>{s.step}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 2, letterSpacing: '-0.01em' }}>{s.label}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>{s.desc}</p>
                  </div>
                  <span style={{ color: s.color, fontSize: '1.125rem', opacity: 0.7 }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Utility panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p className="caption" style={{ marginBottom: 12 }}>운영</p>

            {[
              { href: '/join', label: '청중 참여 (QR)', desc: '이름·부서 입력', color: '#4F8EF7' },
              { href: '/vote', label: 'Part 2 투표', desc: '시나리오 선택', color: '#2DD4BF' },
              { href: '/admin', label: 'Admin 패널', desc: 'DB·현황 관리', color: '#C9A84C' },
            ].map((u) => (
              <Link key={u.href} href={u.href} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: '16px 20px', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>{u.label}</p>
                    <span style={{ color: u.color, fontSize: '1rem' }}>↗</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text2)', marginTop: 3 }}>{u.desc}</p>
                </div>
              </Link>
            ))}

            {/* Quick info */}
            <div className="glass-card" style={{ padding: '16px 20px', marginTop: 8 }}>
              <p className="caption" style={{ marginBottom: 10 }}>교육 개요</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { k: '주제', v: '원가기획 기준정보' },
                  { k: '대상', v: '전 부서 임직원' },
                  { k: '구성', v: 'Prologue + 3 Parts + Epilogue' },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text3)', fontWeight: 600 }}>{k}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text2)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
