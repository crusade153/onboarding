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
    desc: '기준정보 관리의 필요성', 
    color: '#4F8EF7',
    image: '/cover-prologue.jpg',
    message: '기준정보(Master Data)의 정확성은 전사 시스템의 기반입니다. 현재 부서별로 분산된 데이터를 하나의 통합된 흐름으로 연결하여, 업무 효율을 높이고 결산의 정확도를 확보하는 과정을 안내합니다.'
  },
  { 
    href: '/part1',   
    step: '01', 
    label: 'Part 1',    
    desc: '데이터 오류가 손익에 미치는 영향', 
    color: '#F59E0B',
    image: '/cover-part1.jpg',
    message: 'BOM 수율이나 판가 단위(UoM) 등 핵심 기준정보의 입력 오류가 전체 원가 및 손익에 미치는 영향을 시뮬레이션합니다. 사소한 데이터 오입력이 재무제표에 어떤 차이를 발생시키는지 직관적으로 확인해 봅니다.'
  },
  { 
    href: '/part2',   
    step: '02', 
    label: 'Part 2',    
    desc: '현장 실적과 재무제표의 연결', 
    color: '#2DD4BF',
    image: '/cover-part2.jpg',
    message: '현장에서의 자재 출고와 생산 실적 등록이 ERP 시스템 내에서 제조원가와 매출원가로 변환되는 과정을 살펴봅니다. 각 부서의 물리적 업무가 시스템 상의 재무 수치로 어떻게 연결되는지 파악할 수 있습니다.'
  },
  { 
    href: '/part3',   
    step: '03', 
    label: 'Part 3',    
    desc: '원가TFT의 역할과 협업', 
    color: '#C9A84C',
    image: '/cover-part3.jpg',
    message: '수작업 데이터 취합과 엑셀 검증에 소요되는 시간을 줄이고, 시스템 기반의 자동화를 통해 데이터 분석과 사전 시뮬레이션 업무로 전환하는 원가TFT의 비전과 타 부서와의 협업 가이드를 소개합니다.'
  },
  { 
    href: '/epilogue',
    step: '04', 
    label: 'Epilogue',  
    desc: '정확한 시스템 구축을 위한 실천', 
    color: '#A78BFA',
    image: '/cover-epilogue.jpg',
    message: '투명하고 정확한 손익 관리는 전 부서의 정확한 데이터 입력에서 시작됩니다. 본 교육을 통해 논의된 각 부서별 기준정보 관리 가이드라인과 실천 사항을 최종 정리하고 마무리합니다.'
  },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  // 첫 번째 아코디언(Prologue)을 기본으로 열어둡니다.
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  // 이미지 로드 실패 상태를 인덱스별로 관리합니다.
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const toggleAccordion = (idx: number) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  const handleImageError = (idx: number) => {
    setImageErrors(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* 🚀 maxWidth를 1300으로 늘려 화면을 더 시원하게 확장했습니다. */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '40px 48px 80px' }}>
        
        {/* Theme Toggle Button */}
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
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 16 }}>하림산업 원가TFT 교육 플랫폼</p>
          {/* SYSTEMA를 시스템으로 일하는 조직으로 변경 */}
          <h1 className="display text-gold" style={{ marginBottom: 16 }}>시스템으로 일하는 조직</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text2)', maxWidth: 600, lineHeight: 1.7, letterSpacing: '-0.01em' }}>
            데이터로 연결되는 우리의 업무: 신규 입사자 온보딩 교육
          </p>
          <hr className="divider" style={{ marginTop: 40 }} />
        </div>

        {/* 🚀 좌측 슬라이드 영역의 비율(1fr)이 더 커지도록 우측 메뉴의 크기를 300px로 줄였습니다. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48, alignItems: 'start' }}>

          {/* Interactive Accordion Slides */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p className="caption" style={{ marginBottom: 8 }}>교육 커리큘럼</p>
            
            {SLIDES.map((s, idx) => {
              const isActive = activeIdx === idx;
              const hasImageError = imageErrors[idx];
              
              return (
                <div key={s.href} className="glass-card" style={{ 
                  overflow: 'hidden', 
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderColor: isActive ? `${s.color}60` : 'var(--glass-border)',
                  background: isActive ? 'var(--glass-hover)' : 'var(--glass)'
                }}>
                  {/* Accordion Header (더 시원한 패딩 적용) */}
                  <div 
                    onClick={() => toggleAccordion(idx)}
                    style={{ 
                      padding: '28px 36px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 24, 
                      cursor: 'pointer' 
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontSize: '1.875rem', fontWeight: 900, color: s.color, width: 56, flexShrink: 0, opacity: isActive ? 1 : 0.7, transition: 'opacity 0.3s' }}>
                      {s.step}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em' }}>{s.label}</p>
                      <p style={{ fontSize: '1rem', color: 'var(--text2)' }}>{s.desc}</p>
                    </div>
                    <div style={{ 
                      width: 36, height: 36, borderRadius: '50%', background: 'var(--glass-light)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', color: 'var(--text2)',
                      fontSize: '1.125rem'
                    }}>
                      ↓
                    </div>
                  </div>

                  {/* Accordion Body (확장 영역) */}
                  <div style={{ 
                    maxHeight: isActive ? '1000px' : '0px', 
                    opacity: isActive ? 1 : 0,
                    transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
                    borderTop: isActive ? '1px solid var(--glass-light)' : 'none'
                  }}>
                    {/* 확장 시 내부 콘텐츠: 이미지와 텍스트의 크기를 키웠습니다. */}
                    <div style={{ padding: '36px', display: 'flex', gap: '40px', alignItems: 'stretch' }}>
                      
                      {/* 🖼 이미지 렌더링 영역 (240px -> 320px로 확장) */}
                      <div style={{ 
                        flexShrink: 0,
                        width: '320px', 
                        height: '213px', // 3:2 비율 유지
                        borderRadius: '12px', 
                        background: 'var(--glass-light)', 
                        border: '1px solid var(--glass-border)', 
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                      }}>
                        {!hasImageError ? (
                          <Image 
                            src={s.image} 
                            alt={`${s.label} 커버 이미지`} 
                            fill 
                            style={{ objectFit: 'cover' }}
                            sizes="320px"
                            onError={() => handleImageError(idx)}
                          />
                        ) : (
                          <span style={{ color: 'var(--text3)', fontSize: '0.9375rem', fontWeight: 600 }}>
                            {s.image} 필요
                          </span>
                        )}
                      </div>

                      {/* 텍스트 및 버튼 영역 (폰트 사이즈 증대) */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.75, marginBottom: 24 }}>
                          {s.message}
                        </p>
                        
                        <div>
                          <Link href={s.href} style={{ textDecoration: 'none' }}>
                            <button style={{
                              background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`,
                              color: '#fff',
                              border: 'none',
                              padding: '14px 32px',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '1rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 10,
                              boxShadow: `0 4px 14px ${s.color}40`,
                              transition: 'transform 0.15s, box-shadow 0.15s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${s.color}60`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${s.color}40`; }}
                            >
                              강연 입장하기 <span style={{ fontSize: '1.125rem' }}>→</span>
                            </button>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* 추가된 하단 메시지 영역 */}
            <div className="anim-up" style={{ textAlign: 'center', marginTop: '64px', paddingBottom: '20px' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text2)', marginBottom: '8px' }}>
                기준이 무너지면 시스템이 무너집니다.
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                시스템은 단순히 주어지는 것이 아닙니다. 우리가 <span style={{ color: 'var(--gold)' }}>함께 세운 약속</span>입니다.
              </p>
            </div>

          </div>

          {/* Utility panel (우측 메뉴) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="caption" style={{ marginBottom: 8 }}>운영 및 도구</p>

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
                  { k: '주관', v: '원가TFT' },
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