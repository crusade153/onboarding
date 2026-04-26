'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';

const SLIDES = [
  {
    href: '/prologue',
    step: '00',
    label: 'Prologue · 8분',
    desc: '오늘 우리가 함께 풀 질문',
    color: '#4F8EF7',
    image: '/cover-prologue.jpg',
    message: '청중 참여 등록을 열고, 오늘 강연이 답하려는 세 가지 질문을 미리 보여줍니다. 우리 회사는 어떤 회사인가? 어떻게 일하는가? 그 결과 무엇이 만들어졌는가?'
  },
  {
    href: '/part1',
    step: '01',
    label: 'Part 1 · 20분',
    desc: '우리 회사는 어떤 회사인가',
    color: '#F59E0B',
    image: '/cover-part1.jpg',
    message: '회사 정체성을 먼저 잡습니다. 3개 공장(K1·K2·K3)과 파트너 기업 한 곳을 보여주고, 6,000만원짜리 단위 환산 사고를 통해 \"왜 시스템이 필요한가\"를 체감하게 합니다.'
  },
  {
    href: '/part2',
    step: '02',
    label: 'Part 2 · 20분',
    desc: '우리는 어떻게 일하는가 (HBH)',
    color: '#2DD4BF',
    image: '/cover-part2.jpg',
    message: 'CEO 신년사가 정의한 HBH — 하림 사람의 4가지 행동 습관(현장경영·일일관리·수단과 목적의 분리·시스템으로 일하는 조직)과, 그 위에 서있는 우리의 인재상을 봅니다.'
  },
  {
    href: '/part3',
    step: '03',
    label: 'Part 3 · 12분',
    desc: '그 결과 무엇이 만들어졌는가',
    color: '#C9A84C',
    image: '/cover-part3.jpg',
    message: '앞서 본 일하는 방식이 만들어 낸 도구들입니다. 신입이 가장 자주 마주칠 3개 라이브 데모(S&OP·DAILYCOST·RAMS)를 직접 열어보고, 청중이 \"안 해도 되는 일\" 감사 리스트를 함께 만듭니다.'
  },
  {
    href: '/epilogue',
    step: '04',
    label: 'Epilogue · 10분',
    desc: '우리 모두의 약속이 지켜질 때',
    color: '#A78BFA',
    image: '/cover-epilogue.jpg',
    message: '오늘의 응답을 자동으로 집계해 보여드리고, 참여자 한 분 한 분의 입사 동기를 크레딧과 함께 흘려보냅니다. \"하림산업의 시스템은, 우리 모두의 약속이 지켜질 때 비로소 빛을 발합니다.\"'
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
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>하림산업 신규입사자 온보딩 · 70분</p>
          <h1 className="display text-gold" style={{ marginBottom: 16 }}>SYSTEM INNOVATION</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text2)', maxWidth: 720, lineHeight: 1.6, letterSpacing: '-0.01em', fontWeight: 500 }}>
            시스템 혁신 — 우리가 어떤 회사이고, 어떻게 일하며, 그 결과 무엇을 만들어냈는지.
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
                시스템이란, 함께 세운 약속에 다른 이름을 붙인 것입니다.
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                하림산업의 시스템은 — 우리 모두의 약속이 지켜질 때, <span style={{ color: 'var(--gold)' }}>비로소 빛을 발합니다.</span>
              </p>
            </div>

          </div>

          {/* 우측 메뉴 패널 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p className="caption" style={{ marginBottom: 4, paddingLeft: 8 }}>운영 및 도구</p>

            {[
              { href: '/admin', label: 'Admin 패널', desc: '세션 시작 · DB · 현황', color: 'var(--gold)' },
              { href: '/login', label: '발표자 로그인', desc: 'PIN 입력', color: 'var(--blue)' },
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
                  { k: '주관', v: '원가기획팀' },
                  { k: '대상', v: '신규 입사자 + 전 부서' },
                  { k: '구성', v: 'Prologue · 3 Parts · Epilogue' },
                  { k: '시간', v: '70분' },
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