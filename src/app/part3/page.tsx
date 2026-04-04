'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { useTheme } from '@/components/ThemeProvider';

export default function Part3Page() {
  const { theme, setTheme } = useTheme();
  const isToBe = theme === 'light';

  const handleToggle = (toLight: boolean) => {
    setTheme(toLight ? 'light' : 'dark');
  };

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <NavBar current="Part 3" step="03/04" />

      <div style={{ borderBottom:'1px solid var(--glass-border)', padding:'36px 0 28px' }}>
        <div className="slide-container" style={{ paddingBottom:0 }}>
          <p className="caption" style={{ color:'var(--gold)', marginBottom:10 }}>Part 3</p>
          <h1 className="headline" style={{ color:'var(--text)', marginBottom:8 }}>
            {isToBe ? '단절된 지식을 연결하여, 비즈니스의 통찰을 세우다' : '업무 혁신 — 지식의 연결자'}
          </h1>
          <p className="body-md" style={{ color:'var(--text2)', maxWidth:640 }}>
            {isToBe 
              ? '반복 작업은 시스템에 맡기고, 우리는 데이터로 미래 전략을 시뮬레이션합니다.' 
              : '수많은 엑셀과 단절된 시스템 속에서 우리는 진짜 분석할 시간을 잃어버리고 있습니다.'}
          </p>
        </div>
      </div>

      <div className="slide-container anim-up" style={{ paddingTop:36, display:'flex', flexDirection:'column', gap:40 }}>

        {/* 혁신 스위치 */}
        <div style={{ display:'flex', justifyContent:'center', padding:'20px 0' }}>
          <div style={{ display:'flex', background:'var(--glass)', padding:6, borderRadius:999, border:'1px solid var(--glass-border)', boxShadow:'0 10px 30px rgba(0,0,0,0.1)' }}>
            <button onClick={() => handleToggle(false)} style={{
              padding:'12px 32px', borderRadius:999, fontWeight:800, fontSize:'1rem', cursor:'pointer', border:'none',
              background: !isToBe ? 'var(--red)' : 'transparent',
              color: !isToBe ? '#FFF' : 'var(--text2)', transition:'all 0.3s',
            }}>As-Is (단절의 연속)</button>
            <button onClick={() => handleToggle(true)} style={{
              padding:'12px 32px', borderRadius:999, fontWeight:800, fontSize:'1rem', cursor:'pointer', border:'none',
              background: isToBe ? 'var(--blue)' : 'transparent',
              color: isToBe ? '#FFF' : 'var(--text2)', transition:'all 0.3s',
            }}>To-Be (Systema 혁신)</button>
          </div>
        </div>

        {/* 전 부서 워크플로우 변화 */}
        <section style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <p className="title" style={{ color:'var(--text)', textAlign:'center', marginBottom:12 }}>
            {!isToBe ? '🔥 각 부서의 "단절된 월요일 아침"' : '✨ 연결된 시스템에서의 완벽한 협업'}
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16 }}>
            {[
              { dept: '원가기획', 
                asis: '엑셀 5개 오픈, "이 숫자 왜 안 맞지?" 원인 찾느라 오전 낭비. 분석은 뒷전.', 
                tobe: '수집·검증 자동화, 즉각적인 마진 시뮬레이션 및 현업 컨설팅 집중.',
                color: 'var(--gold)'
              },
              { dept: '마케팅', 
                asis: '임원 보고에 쓸 제품별 정확한 마진 데이터가 없어서 원가팀 답변만 대기.', 
                tobe: '제품별 원가 구조를 명확히 이해하고, 시스템 내에서 채널 전략에 원가 관점 즉각 반영.' ,
                color: 'var(--blue)'
              },
              { dept: '영업', 
                asis: '원가 절감됐대서 싸게 팔았는데 재고 이동평균 때문에 역마진 발생. 견적은 감으로.', 
                tobe: '이동평균의 원리와 시간차를 이해하고, 시스템 기반의 정확한 견적 및 판매 전략 수립.',
                color: 'var(--teal)'
              },
              { dept: '생산', 
                asis: '"수율 좋아졌는데 왜 원가가 올라?" 단편적 지표만 보고 원가팀과 실랑이.', 
                tobe: '수율이 아닌 "원단위"로 진짜 재료비를 관리하고, 공장 가동률의 영향을 명확히 이해함.',
                color: 'var(--warning)'
              },
              { dept: '구매', 
                asis: '단가 5% 낮췄다고 보고했으나 손익에 언제 반영되는지 아무도 모름.', 
                tobe: '단가 인하의 재고 희석 메커니즘을 이해하고, 전략적인 자재 발주 시점을 판단함.',
                color: '#A78BFA'
              },
              { dept: '회계', 
                asis: '월말 결산일마다 쏟아지는 원가 수정 요청. "이번 달도 마감 연기..."', 
                tobe: '가동률·배부율 변동의 구조적 원인을 사전 파악하여, 선제적 검증 및 칼퇴근.',
                color: 'var(--red)'
              }
            ].map((d) => (
              <div key={d.dept} className="glass-card pop-in" style={{ padding:24, borderTop:`3px solid ${d.color}` }}>
                <p style={{ fontWeight:800, fontSize:'1.125rem', color:d.color, marginBottom:12 }}>{d.dept}</p>
                <p style={{ color:'var(--text2)', fontSize:'0.9375rem', lineHeight:1.6 }}>
                  {!isToBe ? d.asis : d.tobe}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3대 핵심 용어 */}
        {isToBe && (
          <section className="glass-card-lg anim-up" style={{ padding:40, marginTop:20, background:'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))' }}>
            <p className="title" style={{ textAlign:'center', marginBottom:32, color:'var(--text)' }}>기억해야 할 시스템 경영의 3대 키워드</p>
            <div style={{ display:'flex', gap:20, justifyContent:'center' }}>
              <div className="glass-card" style={{ flex:1, padding:20, background:'var(--glass)' }}>
                <p style={{ fontWeight:800, color:'var(--teal)', fontSize:'1.125rem', marginBottom:8 }}>① 원단위 (BOM)</p>
                <p style={{ fontSize:'0.875rem', color:'var(--text2)' }}>제품 1단위를 만드는데 실제로 투입된 자재량. <strong>수율이 아닌 원단위</strong>가 진짜 재료비 분석의 핵심입니다.</p>
              </div>
              <div className="glass-card" style={{ flex:1, padding:20, background:'var(--glass)' }}>
                <p style={{ fontWeight:800, color:'var(--gold)', fontSize:'1.125rem', marginBottom:8 }}>② 공장 가동률</p>
                <p style={{ fontSize:'0.875rem', color:'var(--text2)' }}>설비 능력 대비 실제 생산 비율. 고정비 배부의 마스터키이며, <strong>모든 제품 원가에 동시 타격</strong>을 줍니다.</p>
              </div>
              <div className="glass-card" style={{ flex:1, padding:20, background:'var(--glass)' }}>
                <p style={{ fontWeight:800, color:'var(--blue)', fontSize:'1.125rem', marginBottom:8 }}>③ 이동평균가 (MAP)</p>
                <p style={{ fontSize:'0.875rem', color:'var(--text2)' }}>기존 재고 가치와 신규 입고의 평균. 영업과 구매의 행동이 손익계산서에 <strong>시간차를 두고 희석</strong>되어 나타나는 이유입니다.</p>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}