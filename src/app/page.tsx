'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

const SLIDES = [
  { href: '/prologue', step: '00', label: 'Prologue',  desc: '우리는 지금 흩어져 있다', color: '#4F8EF7' },
  { href: '/part1',   step: '01', label: 'Part 1',    desc: '기준이 무너지면 시스템이 무너진다', color: '#C9A84C' },
  { href: '/part2',   step: '02', label: 'Part 2',    desc: '당신의 행위가 숫자가 된다', color: '#2DD4BF' },
  { href: '/part3',   step: '03', label: 'Part 3',    desc: '우리가 함께 세운다', color: '#C9A84C' },
  { href: '/epilogue',step: '04', label: 'Epilogue',  desc: 'Systema — 지금 이 순간부터', color: '#4F8EF7' },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* 🚀 변경점 1: maxWidth를 900에서 1200으로 넓히고, 좌우 패딩을 48px로 여유롭게 부여 */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 80px' }}>
        
        {/* Theme Toggle Button (Top Right) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button 
            onClick={toggleTheme} 
            className="btn-ghost" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              fontSize: '1.25rem',
              border: '1px solid var(--glass-border)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            aria-label="테마 전환"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 16 }}>하림산업 원가기획 교육 플랫폼</p>
          <h1 className="display text-gold" style={{ marginBottom: 16 }}>Systema</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text2)', maxWidth: 600, lineHeight: 1.7, letterSpacing: '-0.01em' }}>
            함께 세우는 시스템 &mdash; A system is not given. It is built together.
          </p>
          <hr className="divider" style={{ marginTop: 40 }} />
        </div>

        {/* 🚀 변경점 2: 그리드 비율 조정 (280px -> 340px) 및 간격(gap)을 40px로 확대하여 숨통 틔우기 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>

          {/* Slides */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="caption" style={{ marginBottom: 12 }}>강연 슬라이드</p>
            {SLIDES.map((s) => (
              <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
                {/* 🚀 변경점 3: 카드가 넓어진 만큼 내부 패딩(24px 32px)과 gap을 키워 밸런스 조정 */}
                <div className="glass-card" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 24, cursor: 'pointer', transition: 'all 0.18s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--glass-hover)'; (e.currentTarget as HTMLElement).style.borderColor = `${s.color}50`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.borderColor = ''; }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.75rem', fontWeight: 900, color: s.color, width: 48, flexShrink: 0, opacity: 0.9 }}>{s.step}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.01em' }}>{s.label}</p>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text2)' }}>{s.desc}</p>
                  </div>
                  <span style={{ color: s.color, fontSize: '1.25rem', opacity: 0.7 }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Utility panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="caption" style={{ marginBottom: 12 }}>운영 및 도구</p>

            {[
              { href: '/join', label: '청중 참여 (QR)', desc: '이름·부서 입력', color: 'var(--blue)' },
              { href: '/vote', label: 'Part 2 투표', desc: '시나리오 선택', color: 'var(--teal)' },
              { href: '/admin', label: 'Admin 패널', desc: 'DB·현황 관리', color: 'var(--gold)' },
            ].map((u) => (
              <Link key={u.href} href={u.href} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: '20px 24px', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--glass-hover)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{u.label}</p>
                    <span style={{ color: u.color, fontSize: '1.125rem' }}>↗</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginTop: 4 }}>{u.desc}</p>
                </div>
              </Link>
            ))}

            {/* Quick info */}
            <div className="glass-card" style={{ padding: '20px 24px', marginTop: 12 }}>
              <p className="caption" style={{ marginBottom: 12 }}>교육 개요</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { k: '주제', v: '원가기획 기준정보' },
                  { k: '대상', v: '전 부서 임직원' },
                  { k: '구성', v: 'Prologue + 3 Parts + Epilogue' },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: 6 }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text3)', fontWeight: 600 }}>{k}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
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