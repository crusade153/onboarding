'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';

interface WordItem { text: string; size: number; color: string; x: number; y: number; rotate: number; }
interface ResponseRow { response_text: string; }

const W_COLORS = ['#4F8EF7','#2DD4BF','#C9A84C','#F87171','#F59E0B','#A78BFA','#34D399','#F472B6'];
function buildCloud(texts: string[]): WordItem[] {
  const freq: Record<string, number> = {};
  for (const t of texts) { const ws = t.replace(/[^\w\s가-힣]/g,' ').split(/\s+/).filter(w => w.length > 1); for (const w of ws) freq[w] = (freq[w]??0)+1; }
  const entries = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,24);
  const max = entries[0]?.[1] ?? 1;
  return entries.map(([text, count], i) => ({ text, size:13+(count/max)*30, color:W_COLORS[i%W_COLORS.length], x:5+Math.random()*90, y:5+Math.random()*90, rotate:Math.random()>0.75?(Math.random()>0.5?15:-15):0 }));
}

const PLEDGES = [
  { dept:'마케팅', color:'#4F8EF7', action:'제품 코드 규칙 준수', commitment:'"제품 코드 규칙 하나가 6개월 후 캠페인 효과 측정의 기반입니다. 임의 코드 생성은 없습니다."', items:['신제품 출시 전 코드 체계 검토','채널 코드(RT/OT/FS) 반드시 포함','코드 생성 전 원가기획팀 확인'] },
  { dept:'영업', color:'#2DD4BF', action:'판가 · 단위 정확 등록', commitment:'"판가와 단위의 정확성이 이번 달 매출의 신뢰성을 결정합니다. 확인 없이 등록하지 않습니다."', items:['박스당 팩 수 재확인 후 등록','변경 시 원가기획팀 사전 통보','분기별 판가 마스터 검증'] },
  { dept:'생산', color:'#F87171', action:'BOM · 실적 정확 입력', commitment:'"정확한 실적 입력이 정확한 원가의 시작입니다. 현장의 수치가 곧 회사의 수치입니다."', items:['생산실적 당일 확정 원칙','수율 이상 시 즉시 원가기획팀 알림','월말 BOM 실사 대조 참여'] },
  { dept:'원가기획', color:'#C9A84C', action:'기준정보 오너십 확보', commitment:'"정확한 기준 위에서 회사의 미래를 시뮬레이션합니다. 기준정보의 오너는 원가기획팀입니다."', items:['월 1회 기준정보 이상 감지 리포트','부서별 오류 피드백 루프 운영','표준원가 vs 실제원가 편차 분석'] },
];

export default function Part3Page() {
  const [isToB, setIsToB] = useState(false);
  const [painWords, setPainWords] = useState<WordItem[]>([]);
  const [autoWords, setAutoWords] = useState<WordItem[]>([]);
  const [wordType, setWordType] = useState<'pain'|'auto'>('pain');
  const [activePledge, setActivePledge] = useState<number|null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, a] = await Promise.all([fetch('/api/responses?type=pain_point').then(r=>r.json()), fetch('/api/responses?type=automation').then(r=>r.json())]);
        setPainWords(buildCloud((p as ResponseRow[]).map(r=>r.response_text)));
        setAutoWords(buildCloud((a as ResponseRow[]).map(r=>r.response_text)));
      } catch { /* */ }
    };
    load(); const t = setInterval(load, 5000); return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <NavBar current="Part 3" step="03/04" />

      <div style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'36px 0 28px' }}>
        <div className="slide-container" style={{ paddingBottom:0 }}>
          <p className="caption" style={{ color:'rgba(201,168,76,0.6)', marginBottom:10 }}>Part 3</p>
          <h1 className="headline" style={{ color:'var(--text)', marginBottom:8 }}>우리가 함께 세운다</h1>
          <p className="body-md" style={{ color:'var(--text2)', maxWidth:640 }}>
            원가기획팀은 숫자를 계산하는 팀이 아닙니다. 정확한 기준 위에서 회사의 미래를 시뮬레이션하는 팀입니다.
            그 기준은 여러분 모두가 함께 만들어가는 것입니다.
          </p>
        </div>
      </div>

      <div className="slide-container" style={{ paddingTop:36, display:'flex', flexDirection:'column', gap:40 }}>

        {/* As-Is / To-Be */}
        <section>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24, flexWrap:'wrap' }}>
            <div className="section-header" style={{ flex:1, marginBottom:0 }}>
              <p className="caption" style={{ color:'rgba(201,168,76,0.6)' }}>현재 상태 vs 목표 상태</p>
            </div>
            <div style={{ display:'flex', background:'rgba(255,255,255,0.04)', padding:3, borderRadius:10, border:'1px solid rgba(255,255,255,0.07)' }}>
              {[{ label:'As-Is (현재)', isB:false, color:'#F87171' }, { label:'To-Be (목표)', isB:true, color:'#2DD4BF' }].map(opt => (
                <button key={opt.label} onClick={() => setIsToB(opt.isB)} style={{
                  padding:'9px 20px', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', border:'none',
                  background: isToB===opt.isB ? `${opt.color}18` : 'transparent',
                  color: isToB===opt.isB ? opt.color : 'var(--text2)',
                  outline: isToB===opt.isB ? `1px solid ${opt.color}40` : 'none',
                  transition:'all 0.15s',
                }}>{opt.label}</button>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
            {!isToB ? [
              { icon:'📋', title:'월말 엑셀 취합 반복', desc:'각 부서에서 서로 다른 형식의 엑셀을 취합. 오류 찾기에만 수일 소요. 이 과정이 매달 반복됩니다.', color:'#F87171' },
              { icon:'⏰', title:'결산 지연', desc:'"기준이 달라서요" — 부서마다 기준이 달라 합의에 시간이 걸립니다. 경영진 보고가 늦어집니다.', color:'#F87171' },
              { icon:'📊', title:'감으로 의사결정', desc:'데이터가 맞는지 확신이 없을 때 결국 경험과 감에 의존합니다. 검증할 방법이 없습니다.', color:'#F87171' },
              { icon:'🔄', title:'동일한 문제 반복', desc:'근본 원인(기준정보)이 해결되지 않으면 다음 달에도 같은 오류가 발생합니다.', color:'#F87171' },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding:'20px 22px', borderLeft:`3px solid ${item.color}50`, animation:`fadeUp 0.4s ${i*0.07}s both` }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <span style={{ fontSize:'1.5rem', flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontWeight:700, fontSize:'1rem', color:'var(--text)', marginBottom:6 }}>{item.title}</p>
                    <p style={{ fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.65 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            )) : [
              { icon:'⚡', title:'실시간 원가 가시화', desc:'기준정보가 정확하면 생산이 완료되는 순간 원가가 자동 집계됩니다. 월말을 기다릴 필요가 없습니다.', color:'#2DD4BF' },
              { icon:'🎯', title:'What-if 시뮬레이션', desc:'"판가를 5% 올리면 이익이 얼마나 늘어날까?" — 기준이 정확하면 이 질문에 즉시 답할 수 있습니다.', color:'#C9A84C' },
              { icon:'📊', title:'데이터 기반 의사결정', desc:'경영진이 숫자를 신뢰할 수 있게 됩니다. 감이 아닌 데이터로 판가, 생산량, 예산을 결정합니다.', color:'#4F8EF7' },
              { icon:'🚀', title:'반복업무 자동화', desc:'정확한 기준이 있으면 집계·보고는 시스템이 합니다. 사람은 분석과 의사결정에 집중할 수 있습니다.', color:'#A78BFA' },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding:'20px 22px', borderLeft:`3px solid ${item.color}70`, animation:`fadeUp 0.4s ${i*0.07}s both` }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <span style={{ fontSize:'1.5rem', flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontWeight:700, fontSize:'1rem', color:item.color, marginBottom:6 }}>{item.title}</p>
                    <p style={{ fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.65 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 부서별 행동강령 */}
        <section>
          <div className="section-header">
            <p className="caption" style={{ color:'rgba(201,168,76,0.6)' }}>부서별 행동강령 — 지금부터 당장</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
            {PLEDGES.map((p, i) => (
              <button key={p.dept} onClick={() => setActivePledge(activePledge===i ? null : i)} style={{
                background: activePledge===i ? `${p.color}10` : 'rgba(255,255,255,0.035)',
                border:'none', cursor:'pointer', textAlign:'left',
                outline:`1px solid ${activePledge===i ? `${p.color}40` : 'rgba(255,255,255,0.07)'}`,
                borderRadius:16, padding:'20px 22px', transition:'all 0.15s',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <p style={{ fontWeight:800, fontSize:'1rem', color:p.color }}>{p.dept}</p>
                  <span className="badge" style={{ color:p.color, borderColor:`${p.color}35`, background:`${p.color}12`, fontSize:'0.7rem' }}>{p.action}</span>
                </div>
                <p style={{ fontSize:'0.9375rem', color:'var(--text)', fontStyle:'italic', fontWeight:500, lineHeight:1.7, marginBottom: activePledge===i ? 14 : 0 }}>{p.commitment}</p>
                {activePledge===i && (
                  <div style={{ marginTop:12, borderTop:`1px solid ${p.color}25`, paddingTop:12 }}>
                    {p.items.map((item, j) => (
                      <div key={j} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                        <span style={{ color:p.color, fontWeight:700, flexShrink:0, marginTop:1 }}>·</span>
                        <span style={{ fontSize:'0.875rem', color:'var(--text2)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 실시간 워드클라우드 */}
        <section>
          <div className="section-header">
            <p className="caption" style={{ color:'rgba(79,142,247,0.7)' }}>실시간 워드클라우드</p>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {[{ k:'pain' as const, label:'Q1. 불편했던 순간', color:'#4F8EF7' }, { k:'auto' as const, label:'Q2. 자동화하고 싶은 업무', color:'#2DD4BF' }].map(opt => (
              <button key={opt.k} onClick={() => setWordType(opt.k)} style={{
                padding:'8px 18px', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', border:'none',
                background: wordType===opt.k ? `${opt.color}15` : 'transparent',
                color: wordType===opt.k ? opt.color : 'var(--text2)',
                outline:`1px solid ${wordType===opt.k ? `${opt.color}40` : 'rgba(255,255,255,0.07)'}`,
                transition:'all 0.15s',
              }}>{opt.label}</button>
            ))}
          </div>
          <div className="glass-card-lg" style={{ height:300, padding:0, overflow:'hidden', position:'relative' }}>
            <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(rgba(79,142,247,0.06), transparent)', top:-80, left:-80 }} />
            <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'radial-gradient(rgba(201,168,76,0.05), transparent)', bottom:-40, right:-40 }} />
            {(wordType==='pain' ? painWords : autoWords).length === 0 ? (
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
                <p style={{ fontSize:'2rem', opacity:0.2 }}>💬</p>
                <p style={{ color:'var(--text2)', fontSize:'1rem' }}>참여자 응답 대기 중...</p>
                <p style={{ color:'var(--text3)', fontSize:'0.8125rem' }}>Epilogue QR에서 응답하면 실시간으로 표시됩니다</p>
              </div>
            ) : (wordType==='pain' ? painWords : autoWords).map((w, i) => (
              <span key={i} style={{ position:'absolute', left:`${w.x}%`, top:`${w.y}%`, fontSize:`${w.size}px`, fontWeight:900, color:w.color, transform:`translate(-50%,-50%) rotate(${w.rotate}deg)`, textShadow:`0 0 20px ${w.color}40`, whiteSpace:'nowrap', transition:'all 0.8s ease', letterSpacing:'-0.02em' }}>
                {w.text}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
