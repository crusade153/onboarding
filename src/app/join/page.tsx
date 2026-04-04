'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const DEPARTMENTS = ['마케팅','영업','생산','구매','원가기획','경영기획','물류','품질','연구개발','기타'];

function JoinContent() {
  const params = useSearchParams();
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [step, setStep] = useState<'form'|'done'|'epilogue'>('form');
  const [participantId, setParticipantId] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [automation, setAutomation] = useState('');
  const [epDone, setEpDone] = useState(false);

  useEffect(() => {
    const pid = params.get('pid');
    if (params.get('step') === 'epilogue' && pid) { setParticipantId(Number(pid)); setStep('epilogue'); }
  }, [params]);

  async function handleJoin() {
    if (!name.trim() || !dept) { setError('이름과 부서를 선택해 주세요.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/participants', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: name.trim(), department: dept }) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setParticipantId(data.id); setStep('done');
    } catch { setError('연결 실패. 다시 시도해 주세요.'); } finally { setLoading(false); }
  }

  async function handleEpilogue() {
    if (!painPoint.trim() || !automation.trim()) { setError('두 질문 모두 답변해 주세요.'); return; }
    setLoading(true); setError('');
    try {
      await Promise.all([
        fetch('/api/responses', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ participant_id: participantId, question_type:'pain_point', response_text: painPoint.trim() }) }),
        fetch('/api/responses', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ participant_id: participantId, question_type:'automation', response_text: automation.trim() }) }),
      ]);
      setEpDone(true);
    } catch { setError('제출 실패. 다시 시도해 주세요.'); } finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--text)', fontSize: '1.0625rem', outline: 'none', fontFamily: 'inherit',
    caretColor: '#C9A84C',
  };

  if (step === 'form') return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative', zIndex:1 }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <p className="caption" style={{ color:'rgba(201,168,76,0.6)', marginBottom:12 }}>하림산업 원가기획 교육</p>
          <h1 style={{ fontSize:'2.5rem', fontWeight:800, letterSpacing:'-0.035em' }} className="text-gold">Systema</h1>
          <p style={{ color:'var(--text2)', fontSize:'1rem', marginTop:8 }}>참여 정보를 입력해 주세요</p>
        </div>

        <div className="glass-card-lg" style={{ padding:28 }}>
          <label style={{ display:'block', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text3)', marginBottom:8 }}>이름</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" onKeyDown={(e) => e.key==='Enter' && handleJoin()} style={inputStyle} />

          <label style={{ display:'block', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text3)', margin:'20px 0 10px' }}>부서</label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:24 }}>
            {DEPARTMENTS.map((d) => (
              <button key={d} onClick={() => setDept(d)} style={{
                padding:'11px 8px', borderRadius:8, fontSize:'0.9375rem', fontWeight:600, cursor:'pointer',
                background: dept===d ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)',
                color: dept===d ? '#C9A84C' : 'var(--text2)',
                border: `1px solid ${dept===d ? 'rgba(201,168,76,0.45)' : 'rgba(255,255,255,0.08)'}`,
                transition:'all 0.12s',
              }}>
                {d}
              </button>
            ))}
          </div>

          {error && <p style={{ color:'#F87171', fontSize:'0.875rem', fontWeight:600, textAlign:'center', marginBottom:12 }}>{error}</p>}
          <button onClick={handleJoin} disabled={loading} className="btn btn-gold" style={{ width:'100%', fontSize:'1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? '연결 중...' : '연결하기 →'}
          </button>
        </div>
      </div>
    </div>
  );

  if (step === 'done') return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:32, position:'relative', zIndex:1 }}>
      <div className="glass-card-lg" style={{ padding:40, textAlign:'center', maxWidth:360 }}>
        <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'1.5rem' }}>✦</div>
        <h2 style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--text)', marginBottom:6, letterSpacing:'-0.025em' }}>연결 완료</h2>
        <p style={{ fontSize:'1.25rem', fontWeight:700, color:'#C9A84C', marginBottom:4 }}>{name}</p>
        <p style={{ fontSize:'1rem', color:'var(--text2)' }}>{dept}</p>
        <hr className="divider" style={{ margin:'20px 0' }} />
        <p style={{ fontSize:'0.9375rem', color:'var(--text2)' }}>강연자의 안내를 따라주세요</p>
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:16 }}>
          {[0,1,2].map(i => <span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'rgba(201,168,76,0.5)', display:'inline-block', animation:`pulse-ring 1.4s ${i*0.35}s ease-out infinite` }} />)}
        </div>
      </div>
    </div>
  );

  if (epDone) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:'3rem', marginBottom:16 }}>✦</p>
        <h2 style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--text)', marginBottom:8 }}>제출 완료</h2>
        <p style={{ color:'var(--text2)' }}>여러분의 이야기가 Systema의 시작입니다.</p>
      </div>
    </div>
  );

  // Epilogue
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative', zIndex:1 }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <p className="caption" style={{ color:'rgba(201,168,76,0.6)', marginBottom:10 }}>Epilogue</p>
          <h2 className="headline" style={{ color:'var(--text)', marginBottom:6 }}>마지막 질문</h2>
          <p style={{ color:'var(--text2)', fontSize:'1rem' }}>솔직하게 적어주세요. 화면에 실시간으로 표시됩니다.</p>
        </div>
        {[
          { label:'Q1. 기준이 모호해서 불편했던 순간은?', key:'pain', color:'#4F8EF7', value:painPoint, set:setPainPoint, ph:'예: 제품 코드를 어디서 확인해야 할지 몰랐다' },
          { label:'Q2. 자동화하고 싶은 반복업무 한 가지는?', key:'auto', color:'#2DD4BF', value:automation, set:setAutomation, ph:'예: 매주 엑셀 취합해서 메일 보내기' },
        ].map((q) => (
          <div key={q.key} className="glass-card" style={{ padding:20, marginBottom:12 }}>
            <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:700, color:q.color, marginBottom:10, letterSpacing:'-0.01em' }}>{q.label}</label>
            <textarea value={q.value} onChange={(e) => q.set(e.target.value)} rows={3} placeholder={q.ph} style={{ ...inputStyle, resize:'none' }} />
          </div>
        ))}
        {error && <p style={{ color:'#F87171', fontWeight:600, textAlign:'center', marginBottom:12, fontSize:'0.875rem' }}>{error}</p>}
        <button onClick={handleEpilogue} disabled={loading} className="btn btn-gold" style={{ width:'100%' }}>
          {loading ? '제출 중...' : '제출하기 →'}
        </button>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>로딩 중...</div>}>
      <JoinContent />
    </Suspense>
  );
}
