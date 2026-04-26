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

// S.P.A.C.E - X — 관리자의 역량을 6개 축으로 정의 (강연자 프레임)
const SPACE_X = [
  {
    axis: 'S',
    name: 'Support',
    ko: '의사결정의 지원',
    accent: '#4F8EF7',
    oneliner: '동료가 결정해야 할 때 — 필요한 데이터를 먼저 꺼내 놓는다',
    year1: '내 부서의 의사결정 회의에서 쓰이는 핵심 지표 3가지를 안다',
  },
  {
    axis: 'P',
    name: 'Plan',
    ko: '기획역량',
    accent: '#F59E0B',
    oneliner: '문제를 정의하고, 가설과 측정 지표를 함께 설계한다',
    year1: '월 1회 — 작은 개선 1건을 가설·지표·기간으로 문서화한다',
  },
  {
    axis: 'A',
    name: 'Analyze',
    ko: '데이터 분석능력',
    accent: '#2DD4BF',
    oneliner: '결과가 아닌 원인을 분리해 본다 (Philosophy 02)',
    year1: '엑셀 피벗·SQL 기본·시스템 로그 추적 중 1가지를 자력으로 한다',
  },
  {
    axis: 'C',
    name: 'Control',
    ko: '계획 통제역량',
    accent: '#F87171',
    oneliner: '계획대로 안 될 때 — 빠르게 알리고, 빠르게 재계획한다',
    year1: '주간 단위 KPI 이탈을 5일 안에 인지하고, 원인을 한 줄로 보고한다',
  },
  {
    axis: 'E',
    name: 'Evaluate',
    ko: '평가역량',
    accent: '#A78BFA',
    oneliner: '데이터로 판단하고, 결정의 근거를 기록으로 남긴다',
    year1: '내 의사결정 1건을 — 데이터·근거·결과로 회고할 수 있다',
  },
  {
    axis: 'X',
    name: 'eXperience',
    ko: '경험에 대한 적극적 자세',
    accent: '#C9A84C',
    oneliner: '모르는 일·해보지 않은 일에 — 먼저 손을 든다',
    year1: '한 해 동안 — 자기 직무 외 영역의 프로젝트에 1번 이상 참여한다',
  },
] as const;

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
            CEO 신년사가 정의한 <strong style={{ color: 'var(--text)' }}>HBH (Harim Behavioral Habit)</strong> — 하림 사람의 4가지 행동 습관.<br />
            그 중심은 매일 정산하는 <strong style={{ color: 'var(--text)' }}>일일관리</strong>와 <strong style={{ color: 'var(--text)' }}>시스템의 약속을 따르는 조직</strong>입니다.<br />
            시스템은 한 사람이 멈추는 순간 함께 멈춥니다.
          </p>
        </div>

        {/* 섹션 1: HBH 4가지 (6분) */}
        {section === 'hbh' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>7분 · 4가지 습관 + 측정의 사이클 + 신뢰자본</p>

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

            <div
              className="glass-card"
              style={{
                padding: 32,
                marginBottom: 20,
                background: 'rgba(45,212,191,0.06)',
                borderLeft: '3px solid #2DD4BF',
              }}
            >
              <p className="caption" style={{ color: '#2DD4BF', marginBottom: 14 }}>
                PHILOSOPHY 02 · 측정의 사이클
              </p>
              <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.85, wordBreak: 'keep-all', marginBottom: 16 }}>
                매일 측정하는 것은 <strong style={{ color: '#2DD4BF' }}>&ldquo;결과&rdquo;가 아니라 &ldquo;원인&rdquo;</strong>입니다.<br />
                원가가 -3% 떨어졌다는 결과만 보면 어제와 오늘이 끊어집니다.<br />
                원인(어제 입고 단가의 변동)을 매일 측정해야 — 내일을 결정할 수 있습니다.
              </p>
              <div
                style={{
                  background: 'rgba(45,212,191,0.10)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  fontSize: '0.9375rem',
                  color: 'var(--text)',
                  lineHeight: 1.75,
                  marginBottom: 14,
                  fontFamily: 'monospace',
                  letterSpacing: '0.02em',
                }}
              >
                <strong style={{ color: '#2DD4BF' }}>측정 → 관리 → 개선</strong><br />
                측정하지 않으면 관리할 수 없고,<br />
                관리할 수 없으면 개선할 수 없습니다.
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, fontStyle: 'italic', wordBreak: 'keep-all' }}>
                → HBH 02 일일관리의 본 모습은 — 결과 정산이 아니라 <strong style={{ color: 'var(--text)', fontStyle: 'normal' }}>원인의 매일 측정</strong>입니다.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 32, background: 'rgba(201,168,76,0.06)', borderLeft: '3px solid var(--gold)' }}>
              <p className="caption" style={{ color: 'var(--gold)', marginBottom: 14 }}>
                PHILOSOPHY 03 · 시스템은 신뢰자본입니다
              </p>
              <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.85, wordBreak: 'keep-all', marginBottom: 16 }}>
                시스템으로 일한다는 건 — 우리가 서로 세운 약속을 지킨다는 뜻입니다.<br />
                그 약속이 매일 한 칸씩 지켜지면 쌓이는 것이 — <strong style={{ color: 'var(--gold)' }}>신뢰자본</strong>입니다.
              </p>
              <div
                style={{
                  background: 'rgba(201,168,76,0.10)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  fontSize: '0.9375rem',
                  color: 'var(--text)',
                  lineHeight: 1.85,
                  marginBottom: 14,
                }}
              >
                <strong style={{ color: 'var(--gold)' }}>시스템</strong> = 약속에 다른 이름을 붙인 것<br />
                <strong style={{ color: 'var(--gold)' }}>신뢰자본</strong> = 그 약속이 매일 지켜지면서 쌓이는 회사의 자산
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, fontStyle: 'italic', wordBreak: 'keep-all' }}>
                → 측정(02)이 가능하려면 신뢰자본(04)이 먼저 쌓여 있어야 합니다.<br />
                &nbsp;&nbsp;&nbsp;신뢰자본이 안 쌓이는 부분을 다시 정의하는 것 — 그게 다시 <strong style={{ color: 'var(--text)', fontStyle: 'normal' }}>Philosophy 01</strong>로 돌아가는 길입니다.
              </p>
            </div>

            <div
              className="glass-card"
              style={{
                padding: 32,
                marginTop: 20,
                background: 'rgba(248,113,113,0.06)',
                borderLeft: '3px solid #F87171',
              }}
            >
              <p className="caption" style={{ color: '#F87171', marginBottom: 16 }}>
                신뢰자본이 0이 되는 일주일
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <li style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.7 }}>
                  <strong style={{ color: '#F87171' }}>월요일</strong> — 한 사람이 어제의 입력을 빠뜨립니다.
                </li>
                <li style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.7 }}>
                  <strong style={{ color: '#F87171' }}>화요일</strong> — 다음 부서는 빈칸 위에서 결정합니다.
                </li>
                <li style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.7 }}>
                  <strong style={{ color: '#F87171' }}>수요일</strong> — 그 결정이 공장의 생산 지시가 됩니다.
                </li>
                <li style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.7 }}>
                  <strong style={{ color: '#F87171' }}>목요일</strong> — 잘못 만들어진 제품이 출고를 기다립니다.
                </li>
                <li style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.7 }}>
                  <strong style={{ color: '#F87171' }}>금요일</strong> — 결산을 시작하지만, 어디서 어긋났는지 아무도 모릅니다.
                </li>
              </ul>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text2)',
                  lineHeight: 1.75,
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(248,113,113,0.2)',
                  fontStyle: 'italic',
                  wordBreak: 'keep-all',
                }}
              >
                → Part 1에서 본 6,000만원의 사고는 — 한 칸의 빈자리에서 시작되었습니다.<br />
                <strong style={{ color: 'var(--text)', fontStyle: 'normal' }}>신뢰자본은 매일 한 칸씩 쌓이고, 한 칸씩 무너집니다.</strong>
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
            <p className="caption" style={{ marginBottom: 12 }}>7분 · 매일의 책상 위에서, 4가지 습관의 모습</p>

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
            <p className="caption" style={{ marginBottom: 12 }}>7분 · S.P.A.C.E-X · 1년 차의 6개 좌표</p>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
              그래서 우리가 함께 도착할 사람은
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text2)', marginBottom: 28, lineHeight: 1.7, maxWidth: 820 }}>
              <strong style={{ color: 'var(--text)' }}>S.P.A.C.E - X</strong> — 관리자의 역량을 6개 축으로 정의합니다.<br />
              1년 차에 각 축의 어느 좌표에 서 있게 되는지, 측정 가능한 모습으로 보여드립니다.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {SPACE_X.map((s) => (
                <div
                  key={s.axis}
                  className="glass-card"
                  style={{
                    padding: 24,
                    borderLeft: `3px solid ${s.accent}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      fontSize: '2.5rem',
                      lineHeight: 1,
                      color: s.accent,
                      minWidth: 36,
                    }}>
                      {s.axis}
                    </span>
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 800, color: s.accent, letterSpacing: '0.04em' }}>
                        {s.name}
                      </p>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)' }}>
                        {s.ko}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.65, wordBreak: 'keep-all' }}>
                    {s.oneliner}
                  </p>
                  <p style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text3)',
                    lineHeight: 1.65,
                    fontStyle: 'italic',
                    wordBreak: 'keep-all',
                    paddingTop: 10,
                    borderTop: `1px solid ${s.accent}25`,
                  }}>
                    1년 차: {s.year1}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: '16px 20px',
                marginBottom: 36,
                borderRadius: 10,
                background: 'rgba(201,168,76,0.08)',
                borderLeft: '3px solid var(--gold)',
                fontSize: '0.9375rem',
                color: 'var(--text)',
                lineHeight: 1.7,
                wordBreak: 'keep-all',
                fontStyle: 'italic',
              }}
            >
              <strong style={{ color: 'var(--gold)', fontStyle: 'normal' }}>S·P·A·C·E</strong>는 역량의 골격, <strong style={{ color: 'var(--gold)', fontStyle: 'normal' }}>X</strong>는 그 골격을 자라게 하는 — 변화의 동력입니다.
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
              그 6개 좌표를 시간 순으로 보면
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginBottom: 20, lineHeight: 1.6 }}>
              S.P.A.C.E-X 6축이 1·3·6·12개월 마일스톤 위에서 어떻게 자라는지 — 입사 첫 1년의 시간표입니다.
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

