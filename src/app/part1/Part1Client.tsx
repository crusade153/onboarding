'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import PlantCard from '@/components/v2/PlantCard';
import SurveyQR from '@/components/v2/SurveyQR';
import SummaryComic from '@/components/v2/SummaryComic';
import { SUMMARY_COMICS } from '@/lib/summaryComics';

type Section = 'plants' | 'chain' | 'data' | 'survey';

interface PerceptionData {
  counts: { perception_choice: string; count: number }[];
  customs: { custom_text: string; name: string; department: string }[];
}

const PERCEPTION_OPTIONS = [
  { key: 'data_habit',    emoji: '✍️', label: '데이터를 정확하게 입력하는 습관' },
  { key: 'problem_def',  emoji: '🔍', label: '문제가 생기기 전에 먼저 정의하는 것' },
  { key: 'communication',emoji: '🤝', label: '부서 간 명확한 변경 알림 체계' },
  { key: 'better_system',emoji: '🛠️', label: '더 좋은 ERP · 시스템 도입' },
];

// 가치사슬 릴레이: 한 데이터가 어떻게 흐르는가
const RELAY_STAGES = [
  { dept: '마케팅', emoji: '📣', action: '신제품 컨셉을 정의하고', hands: '컨셉과 목표 단가를' },
  { dept: 'R&D',   emoji: '🔬', action: 'BOM·공정표준서를 개발·확정하고', hands: 'BOM과 목표원가를' },
  { dept: '영업',  emoji: '🤝', action: '거래처 수주를 받아', hands: '주차별 발주 수량을' },
  { dept: '구매',  emoji: '🛒', action: '자재 발주를 걸고', hands: '입고 예정일과 단가를' },
  { dept: '생산',  emoji: '🏭', action: '라인을 가동하고', hands: '실제 투입량과 수율을' },
  { dept: '품질',  emoji: '🧪', action: '기준에 맞게 검사하고', hands: '합격률과 클레임 데이터를' },
  { dept: '물류',  emoji: '🚚', action: '완제품을 싣고', hands: '출고 시간과 차량 번호를' },
  { dept: '재무',  emoji: '💰', action: '결산하며 손익을 확정합니다', hands: '매출·원가 데이터를' },
];

export default function Part1Client() {
  const [section, setSection] = useState<Section>('plants');
  const [perception, setPerception] = useState<PerceptionData>({ counts: [], customs: [] });

  useEffect(() => {
    if (section !== 'survey') return;
    const load = () => fetch('/api/perception').then((r) => r.json()).then(setPerception);
    load();
    const t = setInterval(load, 2500);
    return () => clearInterval(t);
  }, [section]);

  const totalVotes = perception.counts.reduce((s, c) => s + c.count, 0);

  return (
    <div style={{ minHeight: '100vh' }}>
      <NavBar current="Part 1" step="01/04" />

      <div className="anim-up" style={{ padding: '24px 0 80px' }}>

        {/* 섹션 탭 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <SectionTab active={section === 'plants'} onClick={() => setSection('plants')} label="① 3개의 키친" />
          <SectionTab active={section === 'chain'} onClick={() => setSection('chain')} label="② 데이터의 릴레이" />
          <SectionTab active={section === 'data'} onClick={() => setSection('data')} label="③ 한 칸의 무게" />
          <SectionTab active={section === 'survey'} onClick={() => setSection('survey')} label="④ 어떤 회사로 느껴지나요" />
        </div>

        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>Part 1 · 20분</p>
          <h1 className="display text-gold" style={{ marginBottom: 12 }}>
            우리 회사는 무엇을 만드는가
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text2)', lineHeight: 1.7, maxWidth: 820 }}>
            하림산업은 매일, 한국인의 식탁에 오를 식품을 만듭니다.<br />
            <strong style={{ color: 'var(--text)' }}>세 개의 키친</strong>에서 시작해, <strong style={{ color: 'var(--text)' }}>한 끼의 음식</strong>으로 끝나는 길.<br />
            그 길 위를 함께 달리는 것이 — <strong style={{ color: 'var(--text)' }}>데이터의 릴레이</strong>입니다.
          </p>
        </div>

        {/* 섹션 1: 공장 (5분) */}
        {section === 'plants' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>5분 · 우리가 매일 만들어내는 양</p>

            <div
              className="glass-card"
              style={{
                padding: 28,
                marginBottom: 24,
                background: 'rgba(201,168,76,0.05)',
                borderLeft: '3px solid var(--gold)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                <span style={{
                  fontFamily: 'monospace', fontWeight: 900, fontSize: '2.5rem',
                  color: 'var(--gold)', lineHeight: 1, flexShrink: 0,
                }}>
                  K
                </span>
                <div style={{ flex: 1 }}>
                  <p className="caption" style={{ color: 'var(--gold)', marginBottom: 8 }}>
                    WHY K · 공장이 아닌 키친
                  </p>
                  <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.8, wordBreak: 'keep-all' }}>
                    P(Plant)가 아니라 <strong style={{ color: 'var(--gold)' }}>K(Kitchen)</strong>의 약자입니다.<br />
                    하림산업의 K1·K2·K3는 단순 제조 공장이 아니라 — <strong style={{ color: 'var(--text)' }}>소비자의 식탁을 위한 공유주방</strong>입니다.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
              <PlantCard
                code="K1"
                name="냉동 · HMI · 국탕찌개 키친"
                products="만두 · 튀김 · 핫도그 · 국탕찌개 · 소스류"
                productCount="200여 개"
                lines="10개"
                capacity="162톤 · 81만 식/일"
                metaphor="잠실 올림픽주경기장을 12번 꽉 채운 관중 전원이 오늘 한 끼를 해결할 수 있는 양"
                accent="#A78BFA"
              />
              <PlantCard
                code="K2"
                name="즉석밥 키친"
                products="더미식 · 푸디버디 즉석밥류 · FD가공식품"
                productCount="25개"
                lines="2개"
                capacity="25만 7천 식/일"
                metaphor="서울 지하철 강남역을 오늘 지나간 사람들이 모두 밥 한 끼씩 받아갈 수 있는 양"
                accent="#2DD4BF"
              />
              <PlantCard
                code="K3"
                name="라면 키친"
                products="장인라면 · 더미식 · 푸디버디 라면류"
                productCount="50여 개"
                lines="4개"
                capacity="110만 식/일"
                metaphor="전국 편의점(5만 개) 한 곳마다 라면 22봉지씩 — K3 풀가동이면 오늘 대한민국 편의점 전체를 채웁니다"
                accent="#F59E0B"
              />
            </div>

            {/* 거래처 카드 */}
            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>🛒</span>
                <div style={{ flex: 1 }}>
                  <p className="caption" style={{ color: 'var(--gold)', marginBottom: 6 }}>어디로 흘러가는가</p>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
                    거래처 · 납품처 — 월평균 <span style={{ color: 'var(--gold)' }}>1,411개사</span>
                  </h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                    {['쿠팡', '네이버', '카카오', '컬리', '11번가'].map((name) => (
                      <span key={name} style={{
                        padding: '4px 12px', borderRadius: 999,
                        background: 'rgba(201,168,76,0.12)',
                        border: '1px solid rgba(201,168,76,0.35)',
                        color: 'var(--gold)', fontSize: '0.8125rem', fontWeight: 700,
                      }}>{name}</span>
                    ))}
                    <span style={{
                      padding: '4px 12px', borderRadius: 999,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'var(--text3)', fontSize: '0.8125rem',
                    }}>외 1,406개사</span>
                  </div>
                  <p style={{
                    fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text)',
                    fontStyle: 'italic', lineHeight: 1.7,
                    borderLeft: '2px solid var(--gold)', paddingLeft: 14,
                  }}>
                    &ldquo;한국 주요 유통채널 전체로, 오늘도 하림산업의 식품이 흘러갑니다.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* 규모감 한 줄 요약 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
              <ScaleStat n="3" unit="개의 키친" caption="K1 · K2 · K3 — 모두 Kitchen" accent="#F59E0B" />
              <ScaleStat n="217만+" unit="식 / 일" caption="K1 81만 + K2 25.7만 + K3 110만 (풀가동 합산)" accent="#2DD4BF" />
              <ScaleStat n="1,411" unit="개 거래처" caption="월평균 납품처 수" accent="#A78BFA" />
              <ScaleStat n="?" unit="명의 약속" caption="오늘 등록된 참여자만큼" accent="#C9A84C" />
            </div>

            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <button onClick={() => setSection('chain')} className="btn btn-gold">
                다음 → 데이터는 이렇게 흘러갑니다
              </button>
            </div>
          </>
        )}

        {/* 섹션 2: 가치사슬 릴레이 (7분) */}
        {section === 'chain' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>7분 · 부서는 다르지만, 데이터는 하나의 흐름</p>

            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16, lineHeight: 1.4 }}>
              우리는 매일, <span style={{ color: 'var(--gold)' }}>가치 사슬의 릴레이</span>를 뛰고 있습니다.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: 28, maxWidth: 820 }}>
              내 업무의 결과는 다음 사람의 시작점입니다.
              한 명이 손에서 놓친 데이터 한 칸은 — 다음 주자에게는 거짓말이 됩니다.
            </p>

            {/* 수직 타임라인 */}
            <div style={{ position: 'relative', paddingLeft: 56, marginBottom: 28 }}>
              {/* 세로 골드 라인 */}
              <div style={{
                position: 'absolute', left: 20, top: 0, bottom: 0,
                width: 2,
                background: 'linear-gradient(to bottom, var(--gold) 0%, rgba(201,168,76,0.08) 100%)',
                borderRadius: 1,
              }} />

              {RELAY_STAGES.map((s, i) => {
                const isLast = i === RELAY_STAGES.length - 1;
                return (
                  <div key={s.dept} style={{ position: 'relative', marginBottom: isLast ? 0 : 6 }}>
                    {/* 스텝 번호 원 */}
                    <div style={{
                      position: 'absolute', left: -56, top: '50%', transform: 'translateY(-50%)',
                      width: 32, height: 32, borderRadius: '50%',
                      background: isLast ? 'rgba(201,168,76,0.15)' : 'var(--gold)',
                      border: isLast ? '2px solid var(--gold)' : 'none',
                      color: isLast ? 'var(--gold)' : '#0B0E1A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'monospace', fontWeight: 900, fontSize: '0.75rem',
                      zIndex: 1,
                    }}>
                      {isLast ? '🔄' : String(i + 1)}
                    </div>

                    {/* 카드 */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '13px 20px', borderRadius: 10,
                      background: isLast
                        ? 'rgba(201,168,76,0.06)'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isLast ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                      <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>{s.emoji}</span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                          fontWeight: 800, color: 'var(--gold)',
                          fontSize: '0.9375rem', marginRight: 8,
                        }}>{s.dept}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>{s.action}</span>
                      </div>

                      <div style={{
                        flexShrink: 0,
                        padding: '5px 14px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.8rem', color: 'var(--text3)',
                        whiteSpace: 'nowrap',
                      }}>
                        {s.hands} {isLast ? '→ 마케팅으로' : '↓'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="glass-card" style={{
              padding: 32, background: 'rgba(248,113,113,0.06)',
              borderLeft: '3px solid #F87171',
            }}>
              <p className="caption" style={{ color: '#F87171', marginBottom: 10 }}>그래서 — 멈추는 순간은</p>
              <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.85, fontWeight: 500, wordBreak: 'keep-all' }}>
                한 명이 한 줄을 잘못 넘기면, 뒤따르는 모든 주자는 <strong style={{ color: '#F87171' }}>거짓말로 일합니다.</strong><br />
                그리고 그 거짓말이 어디서 시작됐는지 — 결산 시점에는 아무도 모릅니다.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <button onClick={() => setSection('data')} className="btn btn-gold">
                다음 → 한 칸의 무게
              </button>
            </div>
          </>
        )}

        {/* 섹션 3: 데이터 한 칸 (5분) */}
        {section === 'data' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>7분 · 실제 사례, 그리고 우리가 매일 마주칠 위험</p>

            <div className="glass-card" style={{ padding: 36, marginBottom: 24 }}>
              <p className="caption" style={{ color: '#F87171', marginBottom: 16 }}>실제 사례 · 표준제조공정 한 칸이 빠졌습니다</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20, lineHeight: 1.4 }}>
                최대 <span style={{ color: '#F87171' }}>1억 6천만원</span>이 흔들린 하루
              </h2>
              <p style={{ fontSize: '1.0625rem', color: 'var(--text2)', lineHeight: 1.85, wordBreak: 'keep-all', marginBottom: 16 }}>
                &ldquo;이 제품의 일부인(* 쉽게 도장)은 이 모양으로 찍혀야 한다&rdquo;는
                표준제조공정 규칙이 변경됐습니다.<br />
                그런데 그 변경사항이 시스템에 반영되지 않았습니다.<br /><br />
                영업에서 발주가 들어왔지만 명확한 이상 알림은 없었고,
                품질 단계에서도 변경 전 기준으로 검사가 통과됐습니다.
              </p>
              <div style={{
                background: 'rgba(201,168,76,0.08)', borderRadius: 10,
                padding: '16px 20px', fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.8,
                marginBottom: 12,
              }}>
                K3(라면 키친) 평균 하루 생산량 <strong style={{ color: 'var(--gold)' }}>30만 봉지</strong>,
                라면 한 봉지 평균 원가 <strong style={{ color: 'var(--gold)' }}>550원</strong> 기준 —<br />
                하루치 전량이 불용 손실이 되면 <strong style={{ color: '#F87171' }}>1억 6,500만원</strong>입니다.
              </div>
              <div style={{
                background: 'rgba(248,113,113,0.08)', borderRadius: 10,
                padding: '14px 18px', fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.7,
              }}>
                <strong style={{ color: '#F87171' }}>다행히</strong> 이번 사고는 일부 라인에서만 발생해 손실은 훨씬 작게 끝났습니다.
                하지만 — 그것은 운이었지, <strong style={{ color: 'var(--text)' }}>시스템이 막은 것이 아니었습니다.</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 }}>
              <ErrorCard
                title="단위 오류"
                desc='"개" 단위와 "박스" 단위를 혼동해 입력 → 출고 수량 12배 차이'
                color="#F87171"
              />
              <ErrorCard
                title="환산 오류"
                desc="원/kg과 원/g을 잘못 매핑 → 단가 1,000배 왜곡, 손익 보고서가 거꾸로 찍힘"
                color="#F59E0B"
              />
              <ErrorCard
                title="표준공정 미반영"
                desc="표준제조공정 변경 시 일부인 규격 한 칸이 미반영 → 구 기준으로 생산·검사 통과 → 불용 손실"
                color="#A78BFA"
              />
              <ErrorCard
                title="시점 불일치"
                desc="발주 입력일과 입고 실제일을 같은 날로 처리 → 재고가 실제와 1주 어긋남, 결품 발생"
                color="#2DD4BF"
              />
            </div>

            {/* 캐치프레이즈 */}
            <div className="glass-card" style={{ padding: 40, marginBottom: 24, background: 'rgba(201,168,76,0.06)' }}>
              <p style={{
                fontSize: '1.375rem', color: 'var(--text)', lineHeight: 1.85,
                fontWeight: 500, wordBreak: 'keep-all', textAlign: 'center',
              }}>
                평균 <span style={{ color: 'var(--gold)', fontWeight: 800 }}>30만 봉지</span> — 오늘도 K3에서 라면이 나옵니다.<br />
                봉지 하나의 원가 550원. 데이터 한 칸이 비어있다면?<br />
                <span style={{ fontWeight: 700, color: '#F87171' }}>
                  하루에만 1억 6천만원이 흔들립니다.
                </span>
              </p>
              <p style={{
                fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7,
                textAlign: 'center', marginTop: 20, fontStyle: 'italic',
              }}>
                모든 것은 결국 <strong style={{ color: 'var(--gold)', fontStyle: 'normal' }}>원가</strong>로 귀결됩니다.<br />
                그래서 원가기획팀이 여러분에게 이 이야기를 먼저 꺼내는 겁니다.
              </p>
            </div>

            {/* 원가기획팀 브리지 */}
            <div className="glass-card" style={{ padding: 28, marginBottom: 24, background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.85, wordBreak: 'keep-all' }}>
                원가기획팀은 숫자를 집계하는 팀이 아닙니다.<br />
                데이터의 흐름에서 <strong style={{ color: 'var(--text)' }}>&ldquo;어디에 구멍이 뚫렸는가&rdquo;</strong>를 가장 먼저 발견하는 팀입니다.<br />
                그래서 — 우리는 문제가 생긴 뒤가 아니라, <strong style={{ color: 'var(--text)' }}>문제가 정의되기 전부터</strong> 움직입니다.
              </p>
            </div>

            {/* PHILOSOPHY 01 */}
            <div
              className="glass-card"
              style={{
                padding: 32,
                marginBottom: 24,
                background: 'rgba(201,168,76,0.05)',
                borderLeft: '3px solid var(--gold)',
              }}
            >
              <p className="caption" style={{ color: 'var(--gold)', marginBottom: 14 }}>
                PHILOSOPHY 01 · 원가기획팀이 일하는 방식
              </p>
              <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.85, wordBreak: 'keep-all', marginBottom: 16 }}>
                이 사고를 막으려면 더 좋은 <strong>ERP와 시스템</strong>이 필요했을까요?<br /><br />
                아닙니다.<br />
                먼저 필요한 것은 — <strong style={{ color: 'var(--gold)' }}>&ldquo;왜 그 항목이 표준공정에서 빠졌는가&rdquo;</strong>라는<br />
                정확한 문제 정의였습니다.
              </p>
              <div
                style={{
                  background: 'rgba(201,168,76,0.08)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  fontSize: '0.9375rem',
                  color: 'var(--text)',
                  lineHeight: 1.75,
                  marginBottom: 14,
                }}
              >
                문제 해결에 들어가는 에너지의 <strong style={{ color: 'var(--gold)' }}>90%는 정확한 문제 정의</strong>에 있습니다.<br />
                나머지 10%가 — 어떤 도구로 풀 것인가의 선택입니다.
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, fontStyle: 'italic', wordBreak: 'keep-all' }}>
                → 시스템·AI·ERP는 모두 &ldquo;도구&rdquo;의 영역입니다. 그 앞에는 항상 <strong style={{ color: 'var(--text)', fontStyle: 'normal' }}>문제 정의</strong>가 먼저입니다.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <button onClick={() => setSection('survey')} className="btn btn-gold">
                다음 → 청중에게 묻습니다
              </button>
            </div>
          </>
        )}

        {/* 섹션 4: 회사 인상 + QR (3분) */}
        {section === 'survey' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>3분 · 방금 본 사례 — 가장 중요한 것은 무엇이었나요?</p>

            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 32 }}>
              <div style={{ flex: '1 1 480px', minWidth: 320 }}>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: 12, wordBreak: 'keep-all', fontStyle: 'italic' }}>
                  그 한 칸은 왜 빠졌을까요?{' '}
                  <strong style={{ color: 'var(--text)', fontStyle: 'normal' }}>부서 간 변경 알림 체계가 없었기 때문입니다.</strong>{' '}
                  귀찮아서도, 몰라서도 아닙니다.
                </p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16, wordBreak: 'keep-all' }}>
                  표준제조공정 한 칸이 빠져 하루 <strong style={{ color: '#F87171' }}>1.6억이 흔들린 사고</strong>를 방금 같이 봤습니다.<br />
                  여러분이라면 무엇을 가장 먼저 바꾸겠습니까?
                </p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
                  이 사고를 막으려면,<br />
                  가장 먼저 필요한 것은?
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text3)', lineHeight: 1.6, marginBottom: 20 }}>
                  오른쪽 QR을 스캔하면 응답 화면이 열립니다. 응답이 실시간으로 집계됩니다.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {PERCEPTION_OPTIONS.map((opt) => {
                    const c = perception.counts.find((c) => c.perception_choice === opt.key)?.count ?? 0;
                    const pct = totalVotes ? Math.round((c / totalVotes) * 100) : 0;
                    return (
                      <div key={opt.key} className="glass-card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                          position: 'absolute', inset: 0, width: `${pct}%`,
                          background: 'rgba(201,168,76,0.10)', transition: 'width 0.6s ease',
                        }} />
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{ fontSize: '1.75rem' }}>{opt.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)' }}>{opt.label}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>
                              {c}명 ({pct}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <SurveyQR
                path="/perception"
                label="Part 1 응답"
                hint="응답이 실시간으로 집계됩니다"
              />
            </div>

            {perception.customs.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <p className="caption" style={{ marginBottom: 12 }}>자유 응답</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {perception.customs.slice(0, 8).map((c, i) => (
                    <div key={i} className="glass-card" style={{ padding: '14px 18px' }}>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: 6 }}>
                        &ldquo;{c.custom_text}&rdquo;
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600 }}>
                        — {c.department} {c.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text3)' }}>
                응답: <strong style={{ color: 'var(--gold)' }}>{totalVotes}</strong>건
              </p>
            </div>

            <SummaryComic {...SUMMARY_COMICS.part1} />
          </>
        )}
      </div>
    </div>
  );
}

function SectionTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 18px', borderRadius: 999,
      background: active ? 'var(--gold)' : 'var(--glass)',
      color: active ? '#0B0E1A' : 'var(--text2)',
      border: 'none', fontWeight: 700, fontSize: '0.875rem',
      cursor: 'pointer', transition: 'all 0.2s',
    }}>
      {label}
    </button>
  );
}

function ErrorCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  return (
    <div className="glass-card" style={{ padding: 24, borderLeft: `3px solid ${color}` }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 800, color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
        {title}
      </p>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
        {desc}
      </p>
    </div>
  );
}

function ScaleStat({ n, unit, caption, accent }: { n: string; unit: string; caption: string; accent: string }) {
  return (
    <div className="glass-card" style={{ padding: '16px 18px', borderTop: `2px solid ${accent}` }}>
      <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.625rem', color: accent, lineHeight: 1, marginBottom: 4 }}>
        {n}
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text2)', fontWeight: 700, marginBottom: 6 }}>
        {unit}
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.5 }}>
        {caption}
      </p>
    </div>
  );
}
