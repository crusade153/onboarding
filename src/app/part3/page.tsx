'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import SurveyQR from '@/components/v2/SurveyQR';

// 메인 대시보드 3개 — 회사의 정체성을 가장 잘 보여주는 라이브 데모
const LIVE_DEMOS = [
  {
    code: 'S&OP',
    title: '판매·운영 계획 통합 뷰',
    why: '부서 협업의 실체 — 같은 회사, 같은 숫자',
    impact: '영업 ↔ 생산 ↔ 구매 계획을 한 화면에서 정합성 검증',
    before: '영업이 약속한 수량과 생산 캐파가 어긋나도 월말 결산에 가서야 발견.',
    after: '계획 입력 단계에서 자동 충돌 알림 → 사전 조율로 사고 0.',
    link: 'https://snop-mgt.vercel.app/login',
    accent: '#A78BFA',
  },
  {
    code: 'DAILYCOST',
    title: '제조원가 일일결산',
    why: '일일관리 HBH의 정수 — 매일 결정의 근거',
    impact: 'D+1 원가가 자동 산출, 월말 결산 폭주가 매일 5분의 점검으로',
    before: '월말 결산 후에야 적자 발견. 한 달치 의사결정이 이미 굳어 있음.',
    after: '매일 자정 기준 원가 자동 집계 → 다음날 아침 회의에서 즉시 액션.',
    link: 'https://dailycost.zettai.co.kr/',
    accent: '#F59E0B',
  },
  {
    code: 'RAMS',
    title: '자재 소진율 · 유통기한 가시화',
    why: '진짜 식품 회사의 정체성 — 안전과 손실의 경계',
    impact: '부자재가 유통기한 전에 모두 소진되는지 실시간 추적',
    before: '분기 말 폐기 시점에 데드 재고 발견. 손실은 그대로 흡수.',
    after: '소진율 사전 알림 → 라인 우선순위 조정으로 폐기 0.',
    link: 'https://rams.zettai.co.kr/',
    accent: '#2DD4BF',
  },
];

// 나머지 7개 — 카탈로그
const COMPACT = [
  {
    code: 'MIMS',
    title: '재료비 일일실적 관리',
    story: '계획 대비 실제 투입을 실시간 추적, 허용 초과 시 현장 즉시 알림.',
    link: 'https://mims.zettai.co.kr/',
  },
  {
    code: 'MRP',
    title: '생산계획 연동 자재소요량 자동화',
    story: '엑셀로 BOM 펼치는 2~3시간을 1초로. 사람은 검토만.',
    link: 'https://mrp.zettai.co.kr/',
  },
  {
    code: '52HR',
    title: '주 52시간 컴플라이언스',
    story: '임계 도달 전 본인·부서장 모두 알림. 법적 리스크 사전 차단.',
    link: 'https://52hr.vercel.app/',
  },
  {
    code: 'MDM',
    title: '자재 기준정보 표준화',
    story: '같은 자재를 부서마다 다르게 부르던 시절 종료. 단일 기준정보가 출발점.',
    link: 'https://smart-mdm.vercel.app/',
  },
  {
    code: 'OBSOLETE',
    title: '정체 재고 처분 의사결정',
    story: '6개월 무이동 재고 자동 표시. 폐기·재가공·할인 의사결정 지원.',
    link: 'https://obsolete.zettai.co.kr/',
  },
  {
    code: 'BUDGET',
    title: '부서별 예산 실시간 통제',
    story: '예산 소진율을 매일 갱신. 분기 말에 발견하던 초과를 미리 차단.',
    link: 'https://effortless-manatee-2144cb.netlify.app/',
  },
  {
    code: 'ODD',
    title: '일일 출고 · 이슈 통합 관제',
    story: '오늘 나갈 트럭과 오늘 풀어야 할 이슈를 한 화면에서.',
    link: 'https://odd.zettai.co.kr/',
  },
];

const GRATITUDE_OPTIONS = [
  { key: 'excel_calc', emoji: '🧮', label: '엑셀로 수율 계산' },
  { key: 'phone_sync', emoji: '📞', label: '부서 간 숫자 맞추는 전화' },
  { key: 'manual_log', emoji: '📋', label: '수기 일보 작성' },
  { key: 'overtime', emoji: '🌙', label: '월말 야근' },
];

interface GratitudeData {
  counts: { saved_from: string; count: number }[];
}

export default function Part3Page() {
  const [activeDemo, setActiveDemo] = useState<number | null>(0);
  const [gratitude, setGratitude] = useState<GratitudeData>({ counts: [] });

  useEffect(() => {
    const load = () => fetch('/api/gratitude').then((r) => r.json()).then(setGratitude);
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  const total = gratitude.counts.reduce((s, c) => s + c.count, 0);

  return (
    <div style={{ minHeight: '100vh' }}>
      <NavBar current="Part 3" step="03/04" />

      <div className="anim-up" style={{ padding: '24px 0 80px' }}>

        <div style={{ marginBottom: 32 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>Part 3 · 12분</p>
          <h1 className="display text-gold" style={{ marginBottom: 12 }}>
            그 결과 무엇이 만들어졌는가
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text2)', lineHeight: 1.7, maxWidth: 820 }}>
            <em>자랑이 아니라 증거입니다.</em><br />
            앞에서 말한 일하는 방식의 결과로 이런 게 만들어졌습니다 — <strong style={{ color: 'var(--gold)' }}>3개만 직접 열어보고, 7개는 카탈로그로.</strong>
          </p>
        </div>

        {/* 3개 메인 대시보드 (5분) */}
        <p className="caption" style={{ marginBottom: 12 }}>① 메인 대시보드 3개 · 5분</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {LIVE_DEMOS.map((d, i) => {
            const open = activeDemo === i;
            return (
              <div key={d.code} className="glass-card" style={{ overflow: 'hidden' }}>
                <div
                  onClick={() => setActiveDemo(open ? null : i)}
                  style={{ padding: '20px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20 }}
                >
                  <span style={{
                    fontFamily: 'monospace', fontWeight: 900, fontSize: '1.5rem',
                    color: d.accent, minWidth: 90, letterSpacing: '0.02em',
                  }}>
                    {d.code}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                      {d.title}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text3)', fontStyle: 'italic' }}>
                      {d.why}
                    </p>
                  </div>
                  <span style={{
                    width: 36, height: 36, borderRadius: '50%', background: 'var(--glass-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.4s', color: 'var(--text)',
                  }}>↓</span>
                </div>

                <div style={{
                  maxHeight: open ? 800 : 0, opacity: open ? 1 : 0,
                  transition: 'max-height 0.5s, opacity 0.3s', overflow: 'hidden',
                }}>
                  <div style={{ padding: '0 28px 24px' }}>
                    <div style={{
                      padding: '16px 20px', background: `${d.accent}10`,
                      borderRadius: 12, borderLeft: `3px solid ${d.accent}`, marginBottom: 14,
                    }}>
                      <p className="caption" style={{ color: d.accent, marginBottom: 6 }}>임팩트</p>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.7, fontWeight: 500 }}>
                        {d.impact}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.06)', borderRadius: 10 }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F87171', marginBottom: 4 }}>
                          BEFORE
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.6, fontStyle: 'italic' }}>
                          {d.before}
                        </p>
                      </div>
                      <div style={{ padding: '12px 16px', background: `${d.accent}10`, borderRadius: 10 }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: d.accent, marginBottom: 4 }}>
                          AFTER
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6, fontWeight: 500 }}>
                          {d.after}
                        </p>
                      </div>
                    </div>

                    <a href={d.link} target="_blank" rel="noopener noreferrer" style={{
                      display: 'block', padding: '14px 24px', borderRadius: 12,
                      background: `linear-gradient(135deg, ${d.accent}, ${d.accent}dd)`,
                      color: '#fff', fontWeight: 700, textDecoration: 'none',
                      textAlign: 'center',
                    }}>
                      라이브 화면 열기 ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 나머지 7개 카탈로그 (3분) */}
        <p className="caption" style={{ marginBottom: 12 }}>② 나머지 7개 카탈로그 · 3분</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 40 }}>
          {COMPACT.map((c) => (
            <a key={c.code} href={c.link} target="_blank" rel="noopener noreferrer" style={{
              textDecoration: 'none', padding: '16px 18px',
              background: 'var(--glass)', borderRadius: 12,
              transition: 'background 0.2s',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{
                  fontFamily: 'monospace', fontWeight: 900, fontSize: '0.875rem',
                  color: 'var(--gold)', letterSpacing: '0.04em',
                }}>
                  {c.code}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>↗</span>
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text)', fontWeight: 700, lineHeight: 1.4 }}>
                {c.title}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text3)', lineHeight: 1.6 }}>
                {c.story}
              </p>
            </a>
          ))}
        </div>

        {/* 감사 리스트 (4분) */}
        <p className="caption" style={{ marginBottom: 12 }}>③ 청중에게 묻습니다 · 4분</p>
        <div className="glass-card" style={{ padding: 36, background: 'rgba(45,212,191,0.04)' }}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ flex: '1 1 480px', minWidth: 320 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8, lineHeight: 1.4 }}>
                이 시스템들 덕분에<br />
                신입인 내가 <span style={{ color: 'var(--teal)' }}>안 해도 되는 일</span>은?
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginBottom: 20, lineHeight: 1.6 }}>
                <em>위시리스트</em>가 아니라 <strong style={{ color: 'var(--text)' }}>감사 리스트</strong>입니다.<br />
                중복 선택 가능합니다.
              </p>
            </div>

            <SurveyQR
              path="/gratitude"
              label="Part 3 응답"
              hint="중복 선택 OK"
              accent="var(--teal)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {GRATITUDE_OPTIONS.map((o) => {
              const c = gratitude.counts.find((x) => x.saved_from === o.key)?.count ?? 0;
              const pct = total ? Math.round((c / total) * 100) : 0;
              return (
                <div key={o.key} className="glass-card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', inset: 0, width: `${pct}%`,
                    background: 'rgba(45,212,191,0.10)', transition: 'width 0.6s ease',
                  }} />
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: '1.875rem' }}>{o.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>{o.label}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text3)', marginTop: 2 }}>
                        {c}명 ({pct}%)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ marginTop: 24, fontSize: '0.875rem', color: 'var(--text3)', textAlign: 'center' }}>
            응답: <strong style={{ color: 'var(--teal)' }}>{total}</strong>건 (중복 선택 가능)
          </p>
        </div>
      </div>
    </div>
  );
}
