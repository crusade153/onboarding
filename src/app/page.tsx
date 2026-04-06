'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';

const SLIDES = [
  { 
    href: '/prologue', 
    step: '00', 
    label: 'Prologue',  
    desc: '가치사슬의 릴레이 경주', 
    color: '#4F8EF7',
    image: '/cover-prologue.jpg',
    message: '내 업무의 결과는 다음 사람의 시작점입니다. 마케팅에서 기획한 신제품이 영업의 수주로 이어지고, 구매가 자재를 발주하면, 생산 현장이 기계를 돌립니다. 물류가 트럭에 제품을 싣고 출발하면, 재무가 최종적으로 우리가 번 돈을 계산하며 결승선을 통과합니다. 우리는 각자의 부서에서 서로의 데이터를 믿고 이어달리는 거대한 가치사슬(Value Chain)의 릴레이 경주를 하고 있습니다.'
  },
  { 
    href: '/part1',   
    step: '01', 
    label: 'Part 1',    
    desc: '기준이 무너지면 시스템이 무너진다', 
    color: '#F59E0B',
    image: '/cover-part1.jpg',
    message: '나의 사소한 \'0\' 하나가 현장의 트럭을 멈추고, 10억 원의 결산 오류를 만듭니다. 각 부서의 데이터가 어떻게 연결되고, 한 줄의 오타가 어떤 나비효과를 부르는지 확인합니다.'
  },
  { 
    href: '/part2',   
    step: '02', 
    label: 'Part 2',    
    desc: '문제를 앞서가는 매일의 습관', 
    color: '#2DD4BF',
    image: '/cover-part2.jpg',
    message: 'Part 1에서 본 끔찍한 나비효과를 막는 방법은 멀리 있지 않습니다. 손익의 왜곡을 역추적해보면 결국 시스템의 근간인 \'기준정보\'와 그것을 다루는 \'우리의 습관\'에 도달하게 됩니다.'
  },
  { 
    href: '/part3',   
    step: '03', 
    label: 'Part 3',    
    desc: '모두가 같은 곳을 보는 업무 표준', 
    color: '#C9A84C',
    image: '/cover-part3.jpg',
    message: 'Part 1의 \'정확한 기준정보\'와 Part 2의 \'철저한 일일관리\'가 만나면 엑셀 수작업은 사라집니다. 단절된 지식을 연결하여 탄생한 10개의 무인 자동화 대시보드를 소개합니다.'
  },
  { 
    href: '/epilogue',
    step: '04', 
    label: 'Epilogue',  
    desc: '시스템은 우리가 함께 세운 \'약속\'', 
    color: '#A78BFA',
    image: '/cover-epilogue.jpg',
    message: '투명하고 정확한 손익 관리는 전 부서의 정확한 데이터 입력에서 시작됩니다. 시스템은 단순히 주어지는 것이 아닙니다. 시스템은 우리가 함께 세운 \'약속\'입니다.'
  },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const toggleAccordion = (idx: number) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  const handleImageError = (idx: number) => {
    setImageErrors(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Container 너비 축소 (1200 -> 1080) 및 위아래 여백 다이어트 */}
      <div className="anim-up" style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px 60px' }}>
        
        {/* Theme Toggle Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button 
            onClick={toggleTheme} 
            className="glass-card" 
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.125rem',
              cursor: 'pointer'
            }}
            aria-label="테마 전환"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Header (여백 대폭 축소) */}
        <div style={{ marginBottom: 40 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>하림산업 원가TFT 교육 플랫폼</p>
          <h1 className="display text-gold" style={{ marginBottom: 12, fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>시스템으로 일하는 조직</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text2)', maxWidth: 650, lineHeight: 1.5, letterSpacing: '-0.01em', fontWeight: 500 }}>
            데이터로 연결되는 우리의 업무: 신규 입사자 온보딩 교육
          </p>
        </div>

        {/* 우측 패널 너비 축소 및 간격 조절 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }}>

          {/* Interactive Accordion Slides */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="caption" style={{ marginBottom: 4, paddingLeft: 8 }}>교육 커리큘럼</p>
            
            {SLIDES.map((s, idx) => {
              const isActive = activeIdx === idx;
              const hasImageError = imageErrors[idx];
              
              return (
                <div key={s.href} className="glass-card" style={{ 
                  overflow: 'hidden', 
                  borderColor: isActive ? `${s.color}50` : 'var(--glass-border)',
                  background: isActive ? 'var(--glass-hover)' : 'var(--glass)'
                }}>
                  {/* Accordion Header (컴팩트하게) */}
                  <div 
                    onClick={() => toggleAccordion(idx)}
                    style={{ 
                      padding: '16px 24px', 
                      display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' 
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 900, color: s.color, width: 40, flexShrink: 0, opacity: isActive ? 1 : 0.6, transition: 'opacity 0.3s' }}>
                      {s.step}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 2 }}>{s.label}</p>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', fontWeight: 500 }}>{s.desc}</p>
                    </div>
                    <div style={{ 
                      width: 32, height: 32, borderRadius: '50%', background: 'var(--glass-light)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)',
                      transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', color: 'var(--text)',
                      fontSize: '1rem'
                    }}>
                      ↓
                    </div>
                  </div>

                  {/* Accordion Body (컴팩트하게) */}
                  <div style={{ 
                    maxHeight: isActive ? '400px' : '0px', 
                    opacity: isActive ? 1 : 0,
                    transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                    borderTop: isActive ? '1px solid var(--glass-light)' : 'none'
                  }}>
                    <div style={{ padding: '20px 24px', display: 'flex', gap: '24px', alignItems: 'stretch' }}>
                      
                      {/* 이미지 영역 크기 축소 (180x120) */}
                      <div style={{ 
                        flexShrink: 0,
                        width: '180px', 
                        height: '120px', 
                        borderRadius: '10px', 
                        background: 'var(--glass-light)', 
                        border: '1px solid var(--glass-border)', 
                        overflow: 'hidden', position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                      }}>
                        {!hasImageError ? (
                          <Image 
                            src={s.image} 
                            alt={`${s.label} 커버 이미지`} 
                            fill 
                            style={{ objectFit: 'cover' }}
                            sizes="180px"
                            onError={() => handleImageError(idx)}
                          />
                        ) : (
                          <span style={{ color: 'var(--text3)', fontSize: '0.75rem', fontWeight: 600 }}>
                            이미지 에셋 필요
                          </span>
                        )}
                      </div>

                      {/* 텍스트 및 버튼 영역 다이어트 */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.6, wordBreak: 'keep-all', marginBottom: 16 }}>
                          {s.message}
                        </p>
                        
                        <div>
                          <Link href={s.href} style={{ textDecoration: 'none' }}>
                            <button className="btn" style={{
                              padding: '10px 24px',
                              fontSize: '0.875rem',
                              background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`,
                              color: '#fff',
                              boxShadow: `0 4px 12px ${s.color}40`,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 6px 20px ${s.color}60`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 4px 12px ${s.color}40`; }}
                            >
                              강연 입장하기 <span style={{ fontSize: '1.1rem', marginLeft: 4 }}>→</span>
                            </button>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* 하단 메시지 영역 축소 */}
            <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '16px' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginBottom: '8px' }}>
                기준이 무너지면 시스템이 무너집니다.
              </p>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)' }}>
                시스템은 단순히 주어지는 것이 아닙니다. 우리가 <span style={{ color: 'var(--gold)' }}>함께 세운 약속</span>입니다.
              </p>
            </div>

          </div>

          {/* 우측 메뉴 패널 (여백 축소) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="caption" style={{ marginBottom: 4, paddingLeft: 8 }}>운영 및 도구</p>

            {[
              { href: '/join', label: '청중 참여 (QR)', desc: '이름·부서 입력', color: 'var(--blue)' },
              { href: '/vote', label: 'Part 2 투표', desc: '시나리오 선택', color: 'var(--teal)' },
              { href: '/admin', label: 'Admin 패널', desc: 'DB·현황 관리', color: 'var(--gold)' },
            ].map((u) => (
              <Link key={u.href} href={u.href} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: '20px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{u.label}</p>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--glass-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.color, fontSize: '1rem' }}>
                      ↗
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginTop: 6 }}>{u.desc}</p>
                </div>
              </Link>
            ))}

            <div className="glass-card" style={{ padding: '20px', marginTop: 12 }}>
              <p className="caption" style={{ marginBottom: 12 }}>교육 개요</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { k: '주관', v: '원가TFT' },
                  { k: '대상', v: '전 부서 임직원' },
                  { k: '구성', v: 'Prologue + 3 Parts' },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: 8 }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text3)', fontWeight: 700 }}>{k}</span>
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