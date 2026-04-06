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
      <div className="anim-up" style={{ width: '100%', padding: '32px 0 80px' }}>
        
        {/* Theme Toggle Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          {/* globals.css에서 border:none 처리됨 */}
          <button 
            onClick={toggleTheme} 
            className="glass-card" 
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '44px', height: '44px', borderRadius: '50%', fontSize: '1.25rem',
              cursor: 'pointer'
            }}
            aria-label="테마 전환"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>하림산업 원가TFT 교육 플랫폼</p>
          <h1 className="display text-gold" style={{ marginBottom: 16 }}>시스템으로 일하는 조직</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text2)', maxWidth: 700, lineHeight: 1.6, letterSpacing: '-0.01em', fontWeight: 500 }}>
            데이터로 연결되는 우리의 업무: 신규 입사자 온보딩 교육
          </p>
        </div>

        {/* 그리드 폭 확장 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 56, alignItems: 'start' }}>

          {/* Interactive Accordion Slides */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p className="caption" style={{ marginBottom: 4, paddingLeft: 8 }}>교육 커리큘럼</p>
            
            {SLIDES.map((s, idx) => {
              const isActive = activeIdx === idx;
              const hasImageError = imageErrors[idx];
              
              return (
                <div key={s.href} className="glass-card" style={{ 
                  overflow: 'hidden', 
                  /* 🌟 핵심 수정: 활성화 시 테두리색 변경 로직 제거 (Borderless 유지) */
                  /* border: none 처리는 globals.css의 .glass-card에서 전역 적용됨 */
                  
                  /* 활성화 시 배경색만 미묘하게 다르게 하여 구분 */
                  background: isActive ? 'var(--glass-hover)' : 'var(--glass)'
                }}>
                  {/* Accordion Header */}
                  <div 
                    onClick={() => toggleAccordion(idx)}
                    style={{ 
                      padding: '20px 28px', 
                      display: 'flex', alignItems: 'center', gap: 24, cursor: 'pointer' 
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontSize: '1.625rem', fontWeight: 900, color: s.color, width: 44, flexShrink: 0, opacity: isActive ? 1 : 0.6, transition: 'opacity 0.3s' }}>
                      {s.step}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 4 }}>{s.label}</p>
                      <p style={{ fontSize: '1rem', color: 'var(--text2)', fontWeight: 500 }}>{s.desc}</p>
                    </div>
                    {/* 화살표 아이콘 배경도 선 제거 */}
                    <div style={{ 
                      width: 36, height: 36, borderRadius: '50%', background: 'var(--glass-light)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      /* border 제거 */
                      border: 'none',
                      transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', color: 'var(--text)',
                      fontSize: '1.1rem'
                    }}>
                      ↓
                    </div>
                  </div>

                  {/* Accordion Body */}
                  <div style={{ 
                    maxHeight: isActive ? '450px' : '0px', 
                    opacity: isActive ? 1 : 0,
                    transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                    /* 구분선 제거 */
                    borderTop: 'none'
                  }}>
                    <div style={{ padding: '28px', display: 'flex', gap: '32px', alignItems: 'stretch' }}>
                      
                      {/* 이미지 영역 재조정 (선 제거) */}
                      <div style={{ 
                        flexShrink: 0,
                        width: '220px', 
                        height: '140px', 
                        borderRadius: '12px', 
                        background: 'var(--glass-light)', 
                        /* border 제거 */
                        border: 'none', 
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
                            sizes="220px"
                            onError={() => handleImageError(idx)}
                          />
                        ) : (
                          <span style={{ color: 'var(--text3)', fontSize: '0.875rem', fontWeight: 600 }}>
                            이미지 에셋 필요
                          </span>
                        )}
                      </div>

                      {/* 텍스트 및 버튼 영역 */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.65, wordBreak: 'keep-all', marginBottom: 20 }}>
                          {s.message}
                        </p>
                        
                        <div>
                          <Link href={s.href} style={{ textDecoration: 'none' }}>
                            <button className="btn" style={{
                              padding: '12px 28px',
                              fontSize: '0.9375rem',
                              background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`,
                              color: '#fff',
                              boxShadow: `0 4px 14px ${s.color}40`,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}60`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 4px 14px ${s.color}40`; }}
                            >
                              강연 입장하기 <span style={{ fontSize: '1.2rem', marginLeft: 4 }}>→</span>
                            </button>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* 하단 메시지 영역 */}
            <div style={{ textAlign: 'center', marginTop: '48px', paddingBottom: '24px' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text2)', marginBottom: '8px' }}>
                기준이 무너지면 시스템이 무너집니다.
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                시스템은 단순히 주어지는 것이 아닙니다. 우리가 <span style={{ color: 'var(--gold)' }}>함께 세운 약속</span>입니다.
              </p>
            </div>

          </div>

          {/* 우측 메뉴 패널 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p className="caption" style={{ marginBottom: 4, paddingLeft: 8 }}>운영 및 도구</p>

            {[
              { href: '/join', label: '청중 참여 (QR)', desc: '이름·부서 입력', color: 'var(--blue)' },
              { href: '/vote', label: 'Part 2 투표', desc: '시나리오 선택', color: 'var(--teal)' },
              { href: '/admin', label: 'Admin 패널', desc: 'DB·현황 관리', color: 'var(--gold)' },
            ].map((u) => (
              <Link key={u.href} href={u.href} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: '24px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text)' }}>{u.label}</p>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--glass-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.color, fontSize: '1.1rem', border: 'none' }}>
                      ↗
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginTop: 8 }}>{u.desc}</p>
                </div>
              </Link>
            ))}

            <div className="glass-card" style={{ padding: '28px', marginTop: 16 }}>
              <p className="caption" style={{ marginBottom: 16 }}>교육 개요</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { k: '주관', v: '원가TFT' },
                  { k: '대상', v: '전 부서 임직원' },
                  { k: '구성', v: 'Prologue + 3 Parts' },
                ].map(({ k, v }) => (
                  /* 구분선 제거 및 배경색 미묘한 차이로 항목 구분 */
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--glass-light)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text3)', fontWeight: 700 }}>{k}</span>
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
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