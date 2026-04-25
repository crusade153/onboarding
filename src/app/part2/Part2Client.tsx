'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import HBHCard from '@/components/v2/HBHCard';
import SurveyQR from '@/components/v2/SurveyQR';

type Section = 'hbh' | 'scenarios' | 'profile' | 'survey';

const HABIT_LABELS: Record<string, string> = {
  site_first: '현장경영',
  daily_mgmt: '일일관리',
  tools_means: '수단과 목적의 분리',
  system_org: '시스템으로 일하는 조직',
};

const HABIT_ORDER = ['site_first', 'daily_mgmt', 'tools_means', 'system_org'] as const;

interface HbhData {
  counts: { hardest_habit: string; count: number }[];
  byDept: { department: string; hardest_habit: string; count: number }[];
}

// 월요일 아침 9시, 신입의 책상에서 — 4가지 습관이 어떻게 다르게 보이는가
const MONDAY_SCENARIOS = [
  {
    habit: '현장경영',
    accent: '#F59E0B',
    bad: '"보고서에 의하면 라인 가동률은 92%입니다." — 현장에 가본 적은 없습니다.',
    good: '"현장에 가보니 92% 숫자 뒤에 잦은 짧은 정지(chokotei)가 있었습니다. 정지 사유부터 다시 분류해야 합니다."',
  },
  {
    habit: '일일관리',
    accent: '#2DD4BF',
    bad: '"이번 달 손익은 월말 결산 후에 알 수 있습니다." — 그 시점엔 이미 늦습니다.',
    good: '"오늘 자정 기준 일일 손익이 -3% 떨어졌습니다. 원인은 어제 입고된 자재 단가 변동입니다. 내일 영업 단가에 반영하겠습니다."',
  },
  {
    habit: '수단과 목적의 분리',
    accent: '#A78BFA',
    bad: '"AI 도입 효과를 측정하라고 하셔서 AI 사용량 KPI를 만들었습니다." — 도구가 목표가 됐습니다.',
    good: '"AI는 신제품 BOM 작성 시간을 줄이는 수단입니다. 그래서 측정할 KPI는 AI 사용량이 아니라 BOM 등록 리드타임입니다."',
  },
  {
    habit: '시스템으로 일하는 조직',
    accent: '#C9A84C',
    bad: '"제 경험상 이 자재는 보통 3일이면 입고됩니다." — 그 경험은 시스템에 남아있지 않습니다.',
    good: '"발주 후 입고 리드타임이 시스템상 평균 5일입니다. 제 경험과 다르면, 시스템 데이터부터 의심하고 수정합니다."',
  },
];

// 1년 차에 측정 가능한 행동 변화 (신입을 위한 구체적 기준)
const ONE_YEAR_TRAJECTORY = [
  { month: '1개월', goal: '자기 부서의 데이터가 어떤 시스템에 저장되는지 안다', concrete: '내가 입력한 BOM이 ERP의 어떤 테이블에 저장되는지 그릴 수 있다' },
  { month: '3개월', goal: '내 데이터의 다음 사용자가 누구인지 안다', concrete: '내가 마감한 일일실적이 다음 날 누구의 회의에서 쓰이는지 말할 수 있다' },
  { month: '6개월', goal: '오류를 발견했을 때, 추측 대신 시스템을 본다', concrete: '재고가 안 맞으면 "감"으로 답하지 않고 입출고 로그를 직접 추적한다' },
  { month: '12개월', goal: '시스템에 약속을 더할 수 있다', concrete: '이전엔 없던 기준정보 항목 1개를 정의·등록·운영해 본 적이 있다' },
];

export default function Part2Client() {
  const [section, setSection] = useState<Section>('hbh');
  const [hbh, setHbh] = useState<HbhData>({ counts: [], byDept: [] });

  useEffect(() => {
    if (section !== 'survey') return;
    const load = () => fetch('/api/hbh').then((r) => r.json()).then(setHbh);
    load();
    const t = setInterval(load, 2500);
    return () => clearInterval(t);
  }, [section]);

  const total = hbh.counts.reduce((s, c) => s + c.count, 0);

  const deptTop: Record<string, { habit: string; count: number }> = {};
  for (const row of hbh.byDept) {
    const cur = deptTop[row.department];
    if (!cur || row.count > cur.count) {
      deptTop[row.department] = { habit: row.hardest_habit, count: row.count };
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <NavBar current="Part 2" step="02/04" />

      <div className="anim-up" style={{ padding: '24px 0 80px' }}>

        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <Tab active={section === 'hbh'} onClick={() => setSection('hbh')} label="① HBH 4가지" />
          <Tab active={section === 'scenarios'} onClick={() => setSection('scenarios')} label="② 월요일 아침 9시" />
          <Tab active={section === 'profile'} onClick={() => setSection('profile')} label="③ 1년 차 궤적" />
          <Tab active={section === 'survey'} onClick={() => setSection('survey')} label="④ 가장 어려운 습관" />
        </div>

        <div style={{ marginBottom: 40 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>Part 2 · 20분</p>
          <h1 className="display text-gold" style={{ marginBottom: 12 }}>
            우리 회사는 어떻게 일하는가
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text2)', lineHeight: 1.7, maxWidth: 820 }}>
            CEO 신년사가 정의한 <strong style={{ color: 'var(--text)' }}>HBH (Harim Behavioral Habit)</strong> —
            하림 사람의 4가지 행동 습관입니다. 추상이 아니라, 매일 책상에서 보이는 모습으로 설명합니다.
          </p>
        </div>

        {/* 섹션 1: HBH 4가지 (6분) */}
        {section === 'hbh' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>6분 · 4가지 습관</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 32 }}>
              <HBHCard
                num="01"
                emoji="🔍"
                title="현장경영"
                oneliner="탁상공론 대신 현장의 사실로 말한다"
                action="보고서 쓰기 전, 현장 한 번 다녀오기"
                accent="#F59E0B"
              />
              <HBHCard
                num="02"
                emoji="📅"
                title="일일관리"
                oneliner="월말이 아닌, 매일 정산하고 매일 결정한다"
                action="매일 5분, 그날의 데이터 정리"
                accent="#2DD4BF"
              />
              <HBHCard
                num="03"
                emoji="🎯"
                title="수단과 목적의 분리"
                oneliner="AI도 ERP도 도구일 뿐, 목적은 진짜 식품"
                action='도구를 쓰기 전 "왜?"를 먼저 묻기'
                accent="#A78BFA"
              />
              <HBHCard
                num="04"
                emoji="🤝"
                title="시스템으로 일하는 조직"
                oneliner="내 판단이 아니라 시스템의 약속을 따른다"
                action="모르면 묻고, 알면 시스템에 남기기"
                accent="#C9A84C"
              />
            </div>

            <div className="glass-card" style={{ padding: 36, background: 'rgba(201,168,76,0.06)' }}>
              <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>04번 카드 풀이</p>
              <p style={{ fontSize: '1.125rem', color: 'var(--text)', lineHeight: 1.85, fontStyle: 'italic', wordBreak: 'keep-all' }}>
                시스템으로 일한다는 건 결국, 우리가 서로 세운 약속을 지킨다는 뜻입니다.<br />
                <strong style={{ color: 'var(--gold)', fontStyle: 'normal' }}>
                  시스템이란, 함께 세운 약속에 다른 이름을 붙인 것입니다.
                </strong>
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button onClick={() => setSection('scenarios')} className="btn btn-gold">
                다음 → 월요일 아침 9시
              </button>
            </div>
          </>
        )}

        {/* 섹션 2: 월요일 아침 시나리오 (7분) */}
        {section === 'scenarios' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>7분 · 추상이 아니라, 매일의 책상에서</p>

            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12, lineHeight: 1.4 }}>
              같은 상황, 다르게 일하는 두 사람
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 820 }}>
              4가지 습관이 실제 책상에서 어떻게 다르게 나타나는지 — 한 줄짜리 발언으로 비교해 봅니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {MONDAY_SCENARIOS.map((s) => (
                <div key={s.habit} className="glass-card" style={{ padding: 24, borderLeft: `3px solid ${s.accent}` }}>
                  <p style={{
                    fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em',
                    color: s.accent, textTransform: 'uppercase', marginBottom: 14,
                  }}>
                    {s.habit}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ padding: '14px 16px', background: 'rgba(248,113,113,0.06)', borderRadius: 10 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F87171', marginBottom: 6, letterSpacing: '0.05em' }}>
                        ✗ 어제까지의 일하는 방식
                      </p>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, fontStyle: 'italic' }}>
                        &ldquo;{s.bad}&rdquo;
                      </p>
                    </div>
                    <div style={{ padding: '14px 16px', background: `${s.accent}10`, borderRadius: 10 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 800, color: s.accent, marginBottom: 6, letterSpacing: '0.05em' }}>
                        ✓ 오늘부터의 일하는 방식
                      </p>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.7, fontWeight: 500 }}>
                        &ldquo;{s.good}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button onClick={() => setSection('profile')} className="btn btn-gold">
                다음 → 1년 차 궤적
              </button>
            </div>
          </>
        )}

        {/* 섹션 3: 인재상 + 1년 궤적 (4분) */}
        {section === 'profile' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>4분 · 1년 안에 측정 가능한 변화</p>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
              그래서 우리가 찾는 사람은
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text2)', marginBottom: 28, lineHeight: 1.6 }}>
              추상적 인재상이 아니라, <strong style={{ color: 'var(--text)' }}>1년 안에 측정 가능한 행동 기준</strong>입니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
              <ProfileItem
                num="①"
                title="모르는 것을 모른다고 말할 수 있는 사람"
                desc="추측하지 않고, 가정하지 않고, 동료에게 묻거나 기록을 찾아 확인한다."
              />
              <ProfileItem
                num="②"
                title="자기 업무가 어디로 흘러가는지 궁금해하는 사람"
                desc="내가 입력한 데이터의 다음 사용자가 누구인지 한 번이라도 생각해 본다."
              />
              <ProfileItem
                num="③"
                title="시스템에 입력하는 한 글자의 무게를 아는 사람"
                desc="Part 1에서 본 그대로 — 한 칸의 오류가 6,000만원을 만들 수 있음을 안다."
              />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
              그렇게 1년 차의 모습은
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginBottom: 20, lineHeight: 1.6 }}>
              아래 4개 지점이 — 신입 1년 차에 우리가 함께 도착할 좌표입니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ONE_YEAR_TRAJECTORY.map((t) => (
                <div key={t.month} className="glass-card" style={{ padding: '18px 22px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: 'monospace', fontWeight: 900, fontSize: '1.125rem',
                    color: 'var(--gold)', minWidth: 70, paddingTop: 2,
                  }}>
                    {t.month}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                      {t.goal}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text3)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      예: {t.concrete}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <button onClick={() => setSection('survey')} className="btn btn-gold">
                다음 → 청중에게 묻습니다
              </button>
            </div>
          </>
        )}

        {/* 섹션 4: 투표 (3분) */}
        {section === 'survey' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>3분 · 휴대폰을 꺼내주세요</p>

            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 32 }}>
              <div style={{ flex: '1 1 480px', minWidth: 320 }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
                  4가지 습관 중,<br />가장 어려워 보이는 것은?
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text2)', marginBottom: 20, lineHeight: 1.6 }}>
                  부서별 분포가 함께 표시됩니다. — 같은 회사, 다른 자리에서 보는 어려움이 다를 수 있습니다.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {HABIT_ORDER.map((key) => {
                    const c = hbh.counts.find((c) => c.hardest_habit === key)?.count ?? 0;
                    const pct = total ? Math.round((c / total) * 100) : 0;
                    return (
                      <div key={key} className="glass-card" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                          position: 'absolute', inset: 0, width: `${pct}%`,
                          background: 'rgba(201,168,76,0.10)', transition: 'width 0.6s ease',
                        }} />
                        <div style={{ position: 'relative' }}>
                          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                            {HABIT_LABELS[key]}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                            {c}명 ({pct}%)
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <SurveyQR
                path="/hbh"
                label="Part 2 응답"
                hint="4가지 중 1가지 선택"
                accent="#2DD4BF"
              />
            </div>

            {/* 부서별 분포 */}
            {Object.keys(deptTop).length > 0 && (
              <div>
                <p className="caption" style={{ marginBottom: 12 }}>부서별 가장 많이 선택한 습관</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {Object.entries(deptTop).map(([dept, info]) => (
                    <div key={dept} className="glass-card" style={{ padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)' }}>{dept}</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--gold)', fontWeight: 700 }}>
                        {HABIT_LABELS[info.habit]} · {info.count}명
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text3)' }}>
                응답: <strong style={{ color: 'var(--gold)' }}>{total}</strong>건
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
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

function ProfileItem({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="glass-card" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <span style={{
        fontFamily: 'monospace', fontWeight: 900, fontSize: '1.5rem',
        color: 'var(--gold)', lineHeight: 1, flexShrink: 0,
      }}>
        {num}
      </span>
      <div>
        <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em' }}>
          {title}
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
          {desc}
        </p>
      </div>
    </div>
  );
}
