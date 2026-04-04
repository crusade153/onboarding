// src/app/part3/page.tsx
'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

type DashboardCategory = 'core' | 'op';

// lucide-react 대신 온보딩 테마에 맞춘 이모지 아이콘 매핑
const CORE_DASHBOARDS = [
  {
    step: "Phase 1", tagline: "기준 수립", title: "자재 기준정보 표준화", icon: "🧬", color: "var(--blue)",
    subtitle: "부서마다 다른 자재명과 환산 단위를 하나로 통일",
    before: "자재 이름과 단위에 일관된 규칙이 없어 데이터가 틀어졌고, 문제가 생기면 부서 간 책임 공방과 엑셀 교차 검증에 귀중한 시간을 허비했습니다.",
    after: "시스템이 정해진 규칙대로만 자재를 생성하도록 강제하여, 누가 등록해도 똑같은 기준이 적용되고 단위 오류가 완전히 사라졌습니다.",
    impact: "재고 불일치의 가장 큰 원인이었던 단위 오류 0% 달성",
    link: "https://smart-mdm.vercel.app/"
  },
  {
    step: "Phase 3", tagline: "수급 관리", title: "생산계획 연동 MRP 도입", icon: "⚙️", color: "var(--teal)",
    subtitle: "생산계획과 연동하여 필요 자재 소요량을 자동 산출",
    before: "계획이 바뀔 때마다 담당자가 수천 개의 부품을 일일이 엑셀로 다시 계산하느라 시간이 지연되었고, 계산 실수나 누락 리스크가 높았습니다.",
    after: "생산 계획만 입력하면 시스템이 1초 만에 필요한 자재량을 정확히 역산해 주어, 수작업에 의존하던 관행을 탈피했습니다.",
    impact: "자재 소요량 산출 수작업 시간을 혁신적으로 단축",
    link: "https://mrp.zettai.co.kr/"
  },
  {
    step: "Phase 4", tagline: "실적 검증", title: "재료비 일일 실적 관리", icon: "📊", color: "var(--warning)",
    subtitle: "현장 실제 투입량과 수율을 매일 추적하여 낭비 방어",
    before: "투입 내역이 수기로 늦게 보고되어, 며칠이 지난 후에야 손실이나 수율 저하를 인지하는 등 대응의 골든타임을 놓치곤 했습니다.",
    after: "계획 대비 현장의 실제 투입량을 실시간 추적하며, 허용 범위를 초과하는 자재가 투입되면 즉시 현장에 경고 알림을 발송합니다.",
    impact: "자재 낭비를 당일 발견하고 조치하는 정밀 수율 관리 시작",
    link: "https://mims.zettai.co.kr/"
  },
  {
    step: "Phase 6", tagline: "재고 가시화", title: "자재관리 효율증대 및 가시화", icon: "🧊", color: "var(--gold)",
    subtitle: "자재 소진율과 유통기한을 실시간 모니터링",
    before: "재고의 체류 기간이 제대로 추적되지 않아, 제품 가치가 완전히 상실된 이후에야 뒤늦게 폐기 처분하는 등 관리에 허점이 컸습니다.",
    after: "소진율이 70% 이하로 떨어지면 사전 알림을 발송하고, 70% 이하 재고는 '죽은재고'로 분류하여 즉시 처분을 유도합니다.",
    impact: "폐기 직전 방치되던 자산을 골든타임 내 찾아내어 손실 방어",
    link: "https://rams.zettai.co.kr/"
  }
];

const OP_DASHBOARDS = [
  {
    step: "Phase 2", tagline: "계획 동기화", title: "판매·운영 계획 (S&OP) 지원", icon: "🤝", color: "var(--blue)",
    subtitle: "영업과 생산 부서 간의 정보 불일치 해소",
    before: "부서마다 각자 가공한 엑셀을 기준으로 회의를 진행해, 원인 분석보다는 데이터 자체를 검증하는 데 시간을 허비했습니다.",
    after: "SAP·영업·물류·생산 데이터를 통합하여 납품·미납 현황과 미래 수요 대비 재고 가용성을 전사가 한 화면에서 파악합니다.",
    impact: "부서 간 소통 비용 절감 및 신속한 전략 수립",
    link: "https://snop-mgt.vercel.app/login"
  },
  {
    step: "Phase 5", tagline: "일일 마감", title: "제조원가 일일결산 모니터링", icon: "💰", color: "var(--warning)",
    subtitle: "매일매일 실적을 정산하는 일일결산 체계 구축",
    before: "월말에 마감이 몰려, 한 달 전의 생산성 하락이나 비용 초과 원인을 적시에 찾아내기 어려웠습니다.",
    after: "팀별 마감 진척도(%)를 수치화하고 알림을 발송하여, 매일 손익과 실적을 정산하는 일일관리를 루틴으로 정착시킵니다.",
    impact: "신속한 손익 확인 및 문제 발생 시 당일 원인 규명",
    link: "https://dailycost.zettai.co.kr/"
  },
  {
    step: "Phase 7", tagline: "의사결정", title: "정체 재고 처분 의사결정 지원", icon: "🗑️", color: "var(--red)",
    subtitle: "악성 재고 책임 공방을 끝내고 처분 타이밍 도출",
    before: "기말 재고가 쌓이면 영업과 생산이 서로 원인 제공자 탓을 하며 실질적인 처분 및 해결책 마련이 지연되었습니다.",
    after: "객관적인 데이터를 근거로 '누구의 잘못인가'가 아닌 '어떻게 신속히 처분할 것인가'로 회의 안건을 전환했습니다.",
    impact: "재고 처분 의사결정 가속화 및 악성 보관 비용 방어",
    link: "https://obsolete.zettai.co.kr/"
  },
  {
    step: "Phase 8", tagline: "자율 통제", title: "부서별 예산 실시간 통제", icon: "💳", color: "var(--teal)",
    subtitle: "비용 집행 현황을 부서 스스로 매일 점검",
    before: "회계 부서에서 사후 정산해 주기 전까지는 현업에서 자신들의 예산 잔액을 정확히 파악하기 어려웠습니다.",
    after: "부서장들이 매일 아침 전표 데이터를 기반으로 실시간 예산 잔액을 투명하게 확인하고 초과 전 집행을 조율합니다.",
    impact: "비용 초과 집행 선제적 예방 및 자율 예산 통제 정착",
    link: "https://effortless-manatee-2144cb.netlify.app/"
  },
  {
    step: "Phase 9", tagline: "통합 관제", title: "일일 출고·이슈 통합 관제", icon: "🚛", color: "var(--gold)",
    subtitle: "당일 출고 물량 및 물류 지연 이슈 가시화",
    before: "배송 지연 등 현장 이슈가 물류팀 내에만 머물러, 타 부서에서는 고객 클레임에 뒤늦게 대응할 수밖에 없었습니다.",
    after: "지역별 배송 현황과 병목 구간을 전사 대시보드를 통해 직관적으로 가시화하여 누구나 모니터링할 수 있습니다.",
    impact: "배송 병목 발생 시 영업/CS 부서의 즉각적 고객 응대 지원",
    link: "https://odd.zettai.co.kr/"
  },
  {
    step: "Phase 10", tagline: "리스크 관리", title: "주 52시간 컴플라이언스", icon: "⏰", color: "var(--blue)",
    subtitle: "초과 근무 위험을 부서장에게 사전에 경고",
    before: "월말 근태 내역을 종합한 후에야 근무 시간 초과 사실을 알게 되는 구조적 리스크가 존재했습니다.",
    after: "주 50시간 초과가 예상되는 인원이 감지되면 시스템이 즉시 해당 부서장에게 사전 경고 알림을 발송합니다.",
    impact: "근로 시간 관련 법적 리스크 원천 차단",
    link: "https://52hr.vercel.app/"
  }
];

export default function Part3Page() {
  const [category, setCategory] = useState<DashboardCategory>('core');
  const [selectedDashboard, setSelectedDashboard] = useState<any | null>(null);

  const currentData = category === 'core' ? CORE_DASHBOARDS : OP_DASHBOARDS;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <NavBar current="Part 3" step="03/04" />

      {/* 헤더 영역 */}
      <div style={{ borderBottom: '1px solid var(--glass-border)', padding: '24px 0 16px' }}>
        <div className="slide-container" style={{ paddingBottom: 0 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 6 }}>Part 3</p>
          <h1 className="headline" style={{ color: 'var(--text)', marginBottom: 8, fontSize: '2rem', wordBreak: 'keep-all' }}>
            엑셀의 종말, 데이터의 연결
          </h1>
          <p className="body-md" style={{ color: 'var(--text2)', maxWidth: 800, wordBreak: 'keep-all', lineHeight: 1.5 }}>
            Part 1의 <strong>'정확한 기준정보'</strong>와 Part 2의 <strong>'철저한 일일관리'</strong>가 만나면 엑셀 수작업은 사라집니다. 단절된 지식을 연결하여 탄생한 10개의 무인 자동화 대시보드를 소개합니다.
          </p>

          <div style={{ display: 'flex', gap: 4, marginTop: 16, background: 'var(--glass-light)', padding: 4, borderRadius: 12, border: '1px solid var(--glass-border)', width: 'fit-content' }}>
            <button onClick={() => setCategory('core')} style={{
              padding: '8px 24px', borderRadius: 9, fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', border: 'none',
              background: category === 'core' ? 'var(--gold-dim)' : 'transparent',
              color: category === 'core' ? 'var(--gold)' : 'var(--text2)',
              outline: category === 'core' ? '1px solid var(--gold)' : 'none',
              transition: 'all 0.15s',
            }}>
              핵심 자동화 과제 (4)
            </button>
            <button onClick={() => setCategory('op')} style={{
              padding: '8px 24px', borderRadius: 9, fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', border: 'none',
              background: category === 'op' ? 'var(--gold-dim)' : 'transparent',
              color: category === 'op' ? 'var(--gold)' : 'var(--text2)',
              outline: category === 'op' ? '1px solid var(--gold)' : 'none',
              transition: 'all 0.15s',
            }}>
              통합 관제 대시보드 (6)
            </button>
          </div>
        </div>
      </div>

      {/* 대시보드 갤러리 영역 */}
      <div className="slide-container" style={{ flex: 1, paddingTop: 24, paddingBottom: 24, overflowY: 'auto' }}>
        <div className="anim-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {currentData.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedDashboard(item)}
              className="glass-card pop-in hover-scale" 
              style={{ padding: '24px', cursor: 'pointer', borderTop: `4px solid ${item.color}`, display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.2s, box-shadow 0.2s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
                <span className="badge" style={{ color: item.color, borderColor: item.color }}>{item.step}</span>
              </div>
              <div>
                <p className="caption" style={{ color: item.color, marginBottom: 4 }}>{item.tagline}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', wordBreak: 'keep-all', lineHeight: 1.3 }}>{item.title}</p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginTop: 8, wordBreak: 'keep-all', lineHeight: 1.5 }}>{item.subtitle}</p>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--glass-border)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>상세 변화 보기</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* 에필로그로 넘어가는 브릿지 */}
        <div className="anim-up" style={{ marginTop: 32, padding: '20px 24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--blue)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--blue)', marginBottom: 4 }}>시스템의 진정한 완성</p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', wordBreak: 'keep-all' }}>
              이 모든 대시보드는 도구일 뿐입니다. 진짜 변화는 이 데이터를 활용하는 우리의 <strong>'조직 문화'</strong>에서 시작됩니다.
            </p>
          </div>
          <Link href="/epilogue">
            <button style={{ background: 'var(--blue)', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Epilogue. 우리의 결론 ➡️
            </button>
          </Link>
        </div>
      </div>

      {/* 상세 정보 모달 */}
      {selectedDashboard && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedDashboard(null)}>
          <div style={{ background: 'var(--bg)', width: '100%', maxWidth: '800px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: '6px', background: selectedDashboard.color }} />
            
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '2.5rem' }}>{selectedDashboard.icon}</span>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: selectedDashboard.color, padding: '4px 8px', background: 'var(--glass-light)', borderRadius: '8px' }}>{selectedDashboard.step}</span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginTop: 4 }}>{selectedDashboard.title}</h2>
                  </div>
                </div>
                <button onClick={() => setSelectedDashboard(null)} style={{ background: 'transparent', border: 'none', fontSize: '2rem', cursor: 'pointer', color: 'var(--text3)' }}>×</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)', padding: '20px', borderRadius: '16px' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--red)', marginBottom: 8 }}>AS-WAS (과거의 한계)</p>
                  <p style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.6, wordBreak: 'keep-all' }}>{selectedDashboard.before}</p>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '20px', borderRadius: '16px' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#10B981', marginBottom: 8 }}>AS-IS (자동화의 결과)</p>
                  <p style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.6, wordBreak: 'keep-all' }}>{selectedDashboard.after}</p>
                </div>
              </div>

              <div style={{ padding: '20px', background: 'var(--glass-light)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginBottom: 4 }}>비즈니스 임팩트</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)' }}>✨ {selectedDashboard.impact}</p>
                </div>
                <button onClick={() => window.open(selectedDashboard.link, '_blank')} style={{ background: 'var(--text)', color: 'var(--bg)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  실제 대시보드 접속 ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}