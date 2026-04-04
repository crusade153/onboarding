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
              ? '반복 작업은 자동화에 맡기고, 우리는 데이터로 미래의 전략을 시뮬레이션합니다.' 
              : '수많은 엑셀과 단절된 시스템 속에서 우리는 분석할 시간을 잃어버리고 있습니다.'}
          </p>
        </div>
      </div>

      <div className="slide-container anim-up" style={{ paddingTop:36, display:'flex', flexDirection:'column', gap:40 }}>

        {/* 혁신 스위치 (테마 전환기) */}
        <div style={{ display:'flex', justifyContent:'center', padding:'20px 0' }}>
          <div style={{ display:'flex', background:'var(--glass)', padding:6, borderRadius:999, border:'1px solid var(--glass-border)', boxShadow:'0 10px 30px rgba(0,0,0,0.1)' }}>
            <button onClick={() => handleToggle(false)} style={{
              padding:'12px 32px', borderRadius:999, fontWeight:800, fontSize:'1rem', cursor:'pointer', border:'none',
              background: !isToBe ? 'var(--red)' : 'transparent',
              color: !isToBe ? '#FFF' : 'var(--text2)', transition:'all 0.3s',
            }}>As-Is (과거)</button>
            <button onClick={() => handleToggle(true)} style={{
              padding:'12px 32px', borderRadius:999, fontWeight:800, fontSize:'1rem', cursor:'pointer', border:'none',
              background: isToBe ? 'var(--blue)' : 'transparent',
              color: isToBe ? '#FFF' : 'var(--text2)', transition:'all 0.3s',
            }}>To-Be (Systema 혁신)</button>
          </div>
        </div>

        {/* 시간 가치 파이 차트 */}
        <section style={{ display:'flex', gap:24, alignItems:'center', justifyContent:'center' }}>
          <div className="glass-card-lg" style={{ padding:40, display:'flex', gap:40, alignItems:'center', width:'100%' }}>
            
            <div className="pie-chart" style={{ 
              background: isToBe 
                ? 'conic-gradient(var(--blue) 0% 60%, var(--teal) 60% 85%, var(--gold) 85% 100%)' 
                : 'conic-gradient(var(--red) 0% 50%, var(--warning) 50% 80%, var(--text3) 80% 100%)' 
            }} />

            <div style={{ flex:1 }}>
              <p className="title" style={{ color:'var(--text)', marginBottom:20 }}>원가기획팀의 하루 일과표</p>
              
              {!isToBe ? (
                <div className="pop-in" style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <Legend color="var(--red)" title="데이터 취합 및 엑셀 노가다 (50%)" desc="부서별로 다른 데이터 형식을 맞추느라 오전이 다 갑니다." />
                  <Legend color="var(--warning)" title="오류 색출 및 수동 검증 (30%)" desc="맞지 않는 숫자의 원인을 찾기 위해 전화를 돌립니다." />
                  <Legend color="var(--text3)" title="분석 및 전략 통찰 (20%)" desc="결산에 쫓겨 깊이 있는 분석은 항상 뒷전이 됩니다." />
                </div>
              ) : (
                <div className="pop-in" style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <Legend color="var(--blue)" title="미래 수익성 시뮬레이션 (60%)" desc="자동 집계된 정확한 원가를 바탕으로 판가/수량 변화에 따른 손익을 즉각 예측합니다." />
                  <Legend color="var(--teal)" title="비즈니스 파트너링 (25%)" desc="현업 부서에 데이터를 제공하고 원가 절감 포인트를 컨설팅합니다." />
                  <Legend color="var(--gold)" title="결산 및 보고 (15%)" desc="연결된 시스템이 마감 즉시 결산 데이터를 도출합니다." />
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function Legend({ color, title, desc }: { color:string, title:string, desc:string }) {
  return (
    <div style={{ display:'flex', gap:12 }}>
      <div style={{ width:16, height:16, borderRadius:4, background:color, marginTop:4, flexShrink:0 }} />
      <div>
        <p style={{ fontWeight:700, color:'var(--text)', fontSize:'1rem' }}>{title}</p>
        <p style={{ color:'var(--text2)', fontSize:'0.875rem', marginTop:4 }}>{desc}</p>
      </div>
    </div>
  );
}