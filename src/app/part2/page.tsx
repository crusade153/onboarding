'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';

const FLOW_STEPS = [
  { dept:'마케팅', color:'#4F8EF7', action:'제품코드 생성', type:'기준정보', edu:'제품 코드는 시스템이 제품을 인식하는 유일한 식별자입니다. 규칙을 무시하면 동일 제품이 여러 코드로 쪼개져 실적 집계가 불가능해집니다.', risk:'채널별 매출 집계 불가 → 캠페인 효과 측정 불가' },
  { dept:'영업', color:'#2DD4BF', action:'판가 · 단위 등록', type:'기준정보', edu:'판가와 단위는 매출을 계산하는 직접 입력값입니다. 단위 한 자리 오류가 전체 매출 집계를 완전히 뒤틀어 놓습니다.', risk:'매출 10배 왜곡 → 월말 결산 마비' },
  { dept:'생산·구매', color:'#F87171', action:'BOM · 공정 등록', type:'기준정보', edu:'BOM(자재명세서)의 수율과 단가는 제조원가의 유일한 근거입니다. 수율 1%p 오차가 월 수억원의 원가 차이로 이어집니다.', risk:'원가 과소계상 → 역마진 판매' },
  { dept:'원가기획', color:'#C9A84C', action:'원가기준 설정', type:'기준정보', edu:'원가기획팀은 위 모든 기준정보를 바탕으로 표준원가와 예산을 수립합니다. 기준이 잘못되면 예산 자체가 무의미해집니다.', risk:'경영 계획 전체 신뢰도 하락' },
  { dept:'현장', color:'#F59E0B', action:'자재투입 → 생산확정 → 완제품입고 → 출하', type:'실적', edu:'현장의 실제 움직임이 시스템에 정확히 반영되어야 합니다. 실적 오입력은 재고와 원가를 동시에 왜곡합니다.', risk:'재고 오차 → 원가 집계 오류' },
  { dept:'시스템', color:'#A78BFA', action:'제조원가 → 손익계산서', type:'결과', edu:'앞의 모든 기준정보와 실적이 정확할 때 비로소 올바른 손익이 계산됩니다. 이것이 경영진의 유일한 의사결정 근거입니다.', risk:'잘못된 기준 → 잘못된 손익 → 잘못된 결정' },
];

const VOTE_OPTIONS = [
  { key:'A', label:'정상 가동', desc:'모든 기준정보 정상 입력', color:'#2DD4BF', sub:'월 영업이익 24.0억원' },
  { key:'B', label:'수율 저하 5%', desc:'밀가루 수율 92% → 87%로 오입력', color:'#F59E0B', sub:'월 영업이익 15.3억원 (-8.7억)' },
  { key:'C', label:'판가 단위 오류', desc:'1박스=20팩 → 2팩으로 오입력', color:'#F87171', sub:'매출 집계 불가 — 손익 계산 중단' },
];

interface VoteCount { option_key: string; count: number; }

export default function Part2Page() {
  const [activeStep, setActiveStep] = useState<number|null>(null);
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [simResult, setSimResult] = useState<string|null>(null);

  useEffect(() => {
    const load = async () => { try { setVoteCounts(await fetch('/api/votes?part=part2').then(r => r.json())); } catch { /* */ } };
    load(); const t = setInterval(load, 3000); return () => clearInterval(t);
  }, []);

  const totalVotes = voteCounts.reduce((s, v) => s + v.count, 0);

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <NavBar current="Part 2" step="02/04" />

      <div style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'36px 0 28px' }}>
        <div className="slide-container" style={{ paddingBottom:0 }}>
          <p className="caption" style={{ color:'rgba(45,212,191,0.6)', marginBottom:10 }}>Part 2</p>
          <h1 className="headline" style={{ color:'var(--text)', marginBottom:8 }}>당신의 행위가 숫자가 된다</h1>
          <p className="body-md" style={{ color:'var(--text2)', maxWidth:640 }}>
            여러분이 시스템에서 하는 모든 행위 — 클릭, 입력, 확정 — 은 사라지지 않습니다.
            그것이 최종적으로 회사의 손익계산서 한 줄이 됩니다.
          </p>
        </div>
      </div>

      <div className="slide-container" style={{ paddingTop:36, display:'flex', flexDirection:'column', gap:40 }}>

        {/* 1. 가치사슬 흐름도 */}
        <section>
          <div className="section-header">
            <p className="caption" style={{ color:'rgba(79,142,247,0.7)' }}>부서별 릴레이 흐름도</p>
          </div>
          <p style={{ color:'var(--text2)', fontSize:'1rem', marginBottom:20 }}>
            각 부서의 기준정보 등록이 어떻게 연결되어 손익을 만드는지 단계를 클릭해 확인하세요.
          </p>

          {/* Flow boxes */}
          <div style={{ display:'flex', gap:0, alignItems:'stretch', marginBottom:20, overflowX:'auto' }}>
            {FLOW_STEPS.map((step, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', flex:1, minWidth:0 }}>
                <button onClick={() => setActiveStep(activeStep===i ? null : i)} style={{
                  flex:1, padding:'18px 12px', cursor:'pointer', border:'none', textAlign:'center',
                  background: activeStep===i ? `${step.color}15` : 'rgba(255,255,255,0.035)',
                  outline: `1px solid ${activeStep===i ? `${step.color}50` : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: i===0 ? '12px 0 0 12px' : i===FLOW_STEPS.length-1 ? '0 12px 12px 0' : '0',
                  transition:'all 0.15s', display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background: activeStep===i ? step.color : 'rgba(255,255,255,0.2)', display:'inline-block', transition:'background 0.15s' }} />
                  <p style={{ fontWeight:800, fontSize:'0.8125rem', color: activeStep===i ? step.color : 'var(--text2)', letterSpacing:'-0.01em' }}>{step.dept}</p>
                  <p style={{ fontSize:'0.7rem', color:'var(--text3)', lineHeight:1.4 }}>{step.action}</p>
                  <span style={{ fontSize:'0.65rem', fontWeight:700, padding:'2px 8px', borderRadius:999, background:`${step.color}15`, color:step.color, border:`1px solid ${step.color}30` }}>
                    {step.type}
                  </span>
                </button>
                {i < FLOW_STEPS.length-1 && (
                  <div style={{ width:24, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:'1rem', color:'rgba(255,255,255,0.2)' }}>›</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {activeStep !== null && (
            <div className="glass-card" style={{ padding:'20px 24px', borderLeft:`3px solid ${FLOW_STEPS[activeStep].color}`, animation:'fadeUp 0.3s ease' }}>
              <div style={{ display:'flex', gap:24, alignItems:'flex-start' }}>
                <div style={{ flex:2 }}>
                  <p style={{ fontWeight:800, fontSize:'1.0625rem', color:FLOW_STEPS[activeStep].color, marginBottom:8 }}>
                    {FLOW_STEPS[activeStep].dept} — {FLOW_STEPS[activeStep].action}
                  </p>
                  <p style={{ fontSize:'0.9375rem', color:'var(--text2)', lineHeight:1.7 }}>{FLOW_STEPS[activeStep].edu}</p>
                </div>
                <div style={{ flex:1, padding:'12px 16px', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10 }}>
                  <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#F87171', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>기준 오류 시</p>
                  <p style={{ fontSize:'0.875rem', color:'rgba(248,113,113,0.8)', fontWeight:600, lineHeight:1.6 }}>{FLOW_STEPS[activeStep].risk}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 2. 전체 흐름 요약 */}
        <section className="glass-card-lg" style={{ padding:32 }}>
          <p className="caption" style={{ color:'rgba(201,168,76,0.7)', marginBottom:20 }}>데이터 흐름 핵심 원리</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
            {[
              { title:'물리적 흐름', items:['원재료 입고','생산 투입','완제품 생산','창고 보관','고객 출하'], color:'#4F8EF7' },
              { title:'시스템 흐름', items:['자재마스터 등록','BOM 투입 기록','생산실적 확정','재고 수불 집계','출하 실적 반영'], color:'#2DD4BF' },
              { title:'숫자 흐름', items:['원재료비 계상','가공비 배부','제조원가 확정','제품원가 집계','손익계산서 반영'], color:'#C9A84C' },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ fontWeight:700, fontSize:'0.875rem', color:col.color, marginBottom:10, letterSpacing:'-0.01em' }}>{col.title}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  {col.items.map((item, i) => (
                    <div key={item} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'rgba(255,255,255,0.03)', borderRadius:8 }}>
                      <span style={{ fontFamily:'monospace', fontSize:'0.75rem', fontWeight:700, color:`${col.color}70`, width:18 }}>{String(i+1).padStart(2,'0')}</span>
                      <span style={{ fontSize:'0.875rem', color:'var(--text2)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:24, padding:'14px 18px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10 }}>
            <p style={{ fontWeight:700, color:'#C9A84C', fontSize:'1.0625rem', lineHeight:1.6 }}>
              현장의 물리적 움직임과 시스템의 숫자는 거울입니다.<br />
              거울이 정확하려면 비추는 대상이 정확해야 합니다. 그 대상이 바로 여러분입니다.
            </p>
          </div>
        </section>

        {/* 3. 실시간 투표 */}
        <section>
          <div className="section-header">
            <p className="caption" style={{ color:'rgba(45,212,191,0.6)' }}>프리셋 시나리오 투표</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:20 }}>
            <div className="glass-card-lg" style={{ padding:28 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <p style={{ fontWeight:700, fontSize:'1.0625rem', color:'var(--text)' }}>어떤 결과를 보고 싶으신가요?</p>
                <span style={{ fontSize:'0.875rem', color:'var(--text2)', fontWeight:600 }}>총 {totalVotes}표</span>
              </div>
              <p style={{ color:'var(--text2)', fontSize:'0.875rem', marginBottom:20 }}>스마트폰에서 /vote 로 접속해 시나리오를 선택하면 실시간으로 반영됩니다.</p>

              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
                {VOTE_OPTIONS.map((opt) => {
                  const count = voteCounts.find(v => v.option_key===opt.key)?.count ?? 0;
                  const pct = totalVotes > 0 ? Math.round((count/totalVotes)*100) : 0;
                  return (
                    <div key={opt.key} style={{ padding:'14px 16px', background:'rgba(255,255,255,0.03)', borderRadius:12, border:`1px solid ${opt.color}30` }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                          <span style={{ fontFamily:'monospace', fontWeight:900, fontSize:'1.125rem', color:opt.color }}>{opt.key}</span>
                          <div>
                            <span style={{ fontWeight:700, fontSize:'0.9375rem', color:'var(--text)' }}>{opt.label}</span>
                            <span style={{ fontSize:'0.8125rem', color:'var(--text2)', marginLeft:8 }}>{opt.desc}</span>
                          </div>
                        </div>
                        <span style={{ fontFamily:'monospace', fontWeight:800, fontSize:'1rem', color:opt.color }}>{count}표 · {pct}%</span>
                      </div>
                      <div className="prog-track" style={{ marginTop:8 }}>
                        <div className="prog-fill" style={{ width:`${pct}%`, background:opt.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => { const w = [...voteCounts].sort((a,b)=>b.count-a.count)[0]; setSimResult(w?.option_key ?? 'A'); }} className="btn btn-gold">
                투표 결과로 시뮬레이션 실행 →
              </button>
            </div>

            {/* Sim result */}
            <div>
              {simResult ? <SimResult key={simResult} optKey={simResult} /> : (
                <div className="glass-card-lg" style={{ padding:28, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:240, textAlign:'center' }}>
                  <p style={{ fontSize:'2rem', marginBottom:12, opacity:0.3 }}>→</p>
                  <p style={{ color:'var(--text2)', fontSize:'0.9375rem' }}>투표 후 시뮬레이션을 실행하면 결과가 표시됩니다</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SimResult({ optKey }: { optKey: string }) {
  const D = {
    A: { title:'정상 가동', profit:2_400_000_000, change:0, color:'#2DD4BF', remark:'기준정보 정확 → 원가 신뢰 → 올바른 의사결정이 가능한 상태', status:'정상' },
    B: { title:'수율 저하 5%', profit:2_400_000_000-870_000_000, change:-870_000_000, color:'#F59E0B', remark:'월 8.7억원 원가 과소계상 → 실제로는 손실 중이지만 시스템은 이익으로 표시', status:'경보' },
    C: { title:'판가 단위 오류', profit:0, change:0, color:'#F87171', remark:'매출 집계 자체가 불가능한 상태 — 손익계산서 작성 중단, 결산 지연', status:'위험' },
  };
  const r = D[optKey as keyof typeof D];

  return (
    <div className="glass-card-lg" style={{ padding:28, borderColor:`${r.color}30`, animation:'fadeUp 0.4s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <div>
          <p className="caption" style={{ color:`${r.color}90`, marginBottom:4 }}>시뮬레이션 결과 — 시나리오 {optKey}</p>
          <p style={{ fontWeight:800, fontSize:'1.125rem', color:'var(--text)' }}>{r.title}</p>
        </div>
        <span className="badge" style={{ color:r.color, borderColor:`${r.color}40`, background:`${r.color}12` }}>{r.status}</span>
      </div>
      <p className="caption" style={{ marginBottom:6 }}>월간 영업이익 (추정)</p>
      <p className="impact-number" style={{ color:r.color, marginBottom:16 }}>
        {optKey==='C' ? '측정 불가' : `${(r.profit/1e8).toFixed(1)}억원`}
      </p>
      {r.change !== 0 && (
        <div style={{ padding:'8px 12px', background:`${r.color}12`, borderRadius:8, marginBottom:12 }}>
          <p style={{ fontSize:'0.875rem', fontWeight:700, color:r.color }}>정상 대비 {(r.change/1e8).toFixed(1)}억원 차이</p>
        </div>
      )}
      <p style={{ fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.7 }}>{r.remark}</p>
    </div>
  );
}
