'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import SurveyQR from '@/components/v2/SurveyQR';

// 메인 대시보드 3개 — 회사의 정체성을 가장 잘 보여주는 라이브 데모
const LIVE_DEMOS = [
  {
    code: 'S&OP',
    hbh: 'HBH 04',
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
    hbh: 'HBH 02',
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
    hbh: 'HBH 01',
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
  { key: 'excel_calc', emoji: '📋', label: '내 데이터를 오늘 정확하게 입력하는 것',     sub: '데이터 정확성' },
  { key: 'phone_sync', emoji: '🔍', label: '숫자가 현장 실제와 맞는지 직접 확인하는 것', sub: '현장경영' },
  { key: 'manual_log', emoji: '⚡', label: '알람 오기 전에 이상을 먼저 알아채는 것',     sub: '일일관리' },
  { key: 'overtime',   emoji: '🤝', label: '같은 숫자로 다음 부서와 먼저 소통하는 것',   sub: '부서 협업' },
];

// 1위 응답에 따른 강연자 맞춤 피드백
const GRATITUDE_SCRIPTS: Record<string, {
  accent: string; title: string; script: string; bridge: string;
}> = {
  excel_calc: {
    accent: '#2DD4BF',
    title: '정확한 입력 — 시스템의 신뢰는 거기서 시작됩니다.',
    script: 'DAILYCOST가 매일 자정에 원가를 계산해도 — 그 안에 든 투입량, 단가, 수율이 틀리면 전부 틀립니다. Part 1에서 본 1.6억 사고도 표준공정 변경이 입력되지 않아서 생긴 일입니다. 시스템은 입력된 것만 믿습니다. 그 시스템을 신뢰할 수 있게 만드는 사람이 바로 여러분입니다.',
    bridge: '→ HBH 04, 시스템으로 일하는 조직의 출발점이 바로 정확한 입력 한 칸입니다.',
  },
  phone_sync: {
    accent: '#A78BFA',
    title: '현장 확인 — 숫자와 현실 사이의 간격을 메우는 것.',
    script: 'S&OP가 숫자를 정렬해줘도, RAMS가 소진율을 보여줘도 — 그 숫자가 현장 실제와 다를 수 있습니다. 시스템은 입력된 것을 보여주지, 아직 입력되지 않은 현실은 보여주지 않습니다. 현장에 나가는 사람이 그 간격을 발견합니다.',
    bridge: '→ HBH 01, 현장경영이 필요한 이유가 바로 이것입니다. 보고서는 현장의 그림자입니다.',
  },
  manual_log: {
    accent: '#F59E0B',
    title: '먼저 알아채기 — 시스템 알람보다 한 발 앞서는 것.',
    script: 'RAMS의 소진율 알람이 오기 전에, 현장에서는 이미 보입니다. 자재가 줄어드는 속도, 라인의 리듬이 달라지는 것 — 이것을 먼저 알아채는 사람이 일일관리의 진짜 실력자입니다. 알람은 이미 늦은 것입니다. 사람이 빠릅니다.',
    bridge: '→ HBH 02, 일일관리의 핵심은 시스템을 읽는 것이 아니라 시스템보다 먼저 아는 것입니다.',
  },
  overtime: {
    accent: '#4F8EF7',
    title: '먼저 소통하기 — S&OP가 만드는 공통 언어를 먼저 쓰는 것.',
    script: 'S&OP가 영업·생산·구매 숫자를 한 화면에 올려줘도 — 영업이 수량을 조정하거나 생산이 캐파를 올리는 결정은 사람이 합니다. 시스템은 같은 숫자로 대화할 수 있게 해줄 뿐, 그 대화를 먼저 시작하는 것은 사람입니다.',
    bridge: '→ 신뢰자본이 쌓인 조직에서 이 대화가 빠릅니다. Part 2에서 본 신뢰자본이 여기서 씁니다.',
  },
};

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
            HBH 4가지 습관을 — 매일, 전사가, 같은 기준으로 실행하려면 도구가 필요합니다.<br />
            원가기획팀이 직접 만든 시스템들입니다.{' '}
            <strong style={{ color: 'var(--gold)' }}>3개는 지금 이 자리에서 직접 열어보고</strong>, 나머지 7개는 카탈로그로 보여드립니다.
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
                  <div style={{ minWidth: 90, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.5rem', color: d.accent, letterSpacing: '0.02em' }}>
                      {d.code}
                    </span>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 800, color: d.accent,
                      background: `${d.accent}18`, borderRadius: 999, padding: '2px 8px',
                      border: `1px solid ${d.accent}40`, letterSpacing: '0.05em',
                    }}>
                      {d.hbh}
                    </span>
                  </div>
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

        {/* 청중 질문 (4분) */}
        <p className="caption" style={{ marginBottom: 12 }}>③ 청중에게 묻습니다 · 4분</p>
        <div className="glass-card" style={{ padding: 36, background: 'rgba(45,212,191,0.04)' }}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ flex: '1 1 480px', minWidth: 320 }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: 14, wordBreak: 'keep-all' }}>
                방금 본 S&OP·DAILYCOST·RAMS의 공통점은 하나입니다 —<br />
                <strong style={{ color: 'var(--text)' }}>&ldquo;늦게 발견&rdquo;이 &ldquo;미리 발견&rdquo;으로 바뀐 것.</strong><br />
                그 AFTER 상태를 유지하려면, 여러분이 매일 해야 하는 것은?
              </p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20, lineHeight: 1.4 }}>
                이 시스템들의 <span style={{ color: '#2DD4BF' }}>AFTER</span>를<br />
                유지하는 사람이 되려면?
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {GRATITUDE_OPTIONS.map((o) => {
                  const c = gratitude.counts.find((x) => x.saved_from === o.key)?.count ?? 0;
                  const pct = total ? Math.round((c / total) * 100) : 0;
                  return (
                    <div key={o.key} className="glass-card" style={{
                      padding: '13px 18px', position: 'relative', overflow: 'hidden',
                      borderLeft: '3px solid rgba(45,212,191,0.4)',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0, width: `${pct}%`,
                        background: 'rgba(45,212,191,0.08)', transition: 'width 0.6s ease',
                      }} />
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>{o.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>
                            {o.label}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>
                            {o.sub} · {c}명 ({pct}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p style={{ marginTop: 16, fontSize: '0.8125rem', color: 'var(--text3)', textAlign: 'center' }}>
                응답: <strong style={{ color: '#2DD4BF' }}>{total}</strong>건 (중복 선택 가능)
              </p>
            </div>

            <SurveyQR
              path="/gratitude"
              label="Part 3 응답"
              hint="응답이 실시간으로 집계됩니다"
              accent="var(--teal)"
            />
          </div>

          {/* 강연자 맞춤 멘트 — 1위 항목 기준 */}
          {total > 0 && (() => {
            const keys = GRATITUDE_OPTIONS.map((o) => o.key);
            const topKey = keys.reduce((best, key) => {
              const c = gratitude.counts.find((x) => x.saved_from === key)?.count ?? 0;
              const b = gratitude.counts.find((x) => x.saved_from === best)?.count ?? 0;
              return c > b ? key : best;
            }, keys[0]);
            const res = GRATITUDE_SCRIPTS[topKey];
            if (!res) return null;
            return (
              <div className="glass-card anim-up" style={{
                padding: 32, marginTop: 8,
                background: `${res.accent}08`,
                borderLeft: `3px solid ${res.accent}`,
              }}>
                <p className="caption" style={{ color: res.accent, marginBottom: 14, letterSpacing: '0.1em' }}>
                  강연자 멘트 · 1위 응답 기준 자동 생성
                </p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14, lineHeight: 1.4 }}>
                  {res.title}
                </h3>
                <p style={{
                  fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.85,
                  wordBreak: 'keep-all', marginBottom: 16, fontStyle: 'italic',
                }}>
                  &ldquo;{res.script}&rdquo;
                </p>
                <div style={{
                  padding: '12px 18px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  borderLeft: `2px solid ${res.accent}50`,
                  fontSize: '0.9375rem', color: res.accent,
                  lineHeight: 1.7, wordBreak: 'keep-all', fontWeight: 600,
                }}>
                  {res.bridge}
                </div>
                <div style={{
                  marginTop: 16, padding: '12px 16px', borderRadius: 8,
                  background: 'rgba(201,168,76,0.07)',
                  borderLeft: '2px solid var(--gold)',
                  fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.7,
                  wordBreak: 'keep-all',
                }}>
                  <strong style={{ color: 'var(--gold)' }}>사실 네 가지 모두 정답입니다.</strong><br />
                  시스템이 AFTER 상태를 유지하려면 — 정확한 입력, 현장 확인, 먼저 알아채기, 먼저 소통하기,<br />
                  이 모두가 사람의 몫입니다. 시스템은 도구이고, 그것을 살아있게 하는 것은 여러분입니다.
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
