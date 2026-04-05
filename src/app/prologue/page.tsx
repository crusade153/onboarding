'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';
import QRCode from 'react-qr-code';

const DotCanvas = dynamic(() => import('@/components/DotCanvas'), { ssr: false });

interface Participant { id: number; name: string; department: string; joined_at: string; }

const DEPT_COLORS: Record<string, string> = {
  마케팅:'#4F8EF7', 영업:'#2DD4BF', 생산:'#F87171', 구매:'#F59E0B',
  원가기획:'#C9A84C', 경영기획:'#A78BFA', 물류:'#34D399', 품질:'#FB923C',
  연구개발:'#818CF8', 기타:'#475569',
};

export default function ProloguePage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [connected, setConnected] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [lastFetched, setLastFetched] = useState('');
  
  // Hydration 에러 방지용 상태
  const [qrUrl, setQrUrl] = useState('/join');

  const fetchParticipants = useCallback(async () => {
    try {
      const url = lastFetched ? `/api/participants?since=${encodeURIComponent(lastFetched)}` : '/api/participants';
      const data: Participant[] = await fetch(url).then(r => r.json());
      if (data.length > 0) {
        setParticipants(prev => { const ids = new Set(prev.map(p => p.id)); return [...prev, ...data.filter(p => !ids.has(p.id))]; });
        setLastFetched(data[data.length - 1].joined_at);
      }
    } catch { /* silent */ }
  }, [lastFetched]);

  useEffect(() => { 
    setQrUrl(`${window.location.origin}/join`);
    fetchParticipants(); 
    const t = setInterval(fetchParticipants, 2000); 
    return () => clearInterval(t); 
  }, [fetchParticipants]);

  const deptCounts = participants.reduce<Record<string, number>>((a, p) => { a[p.department] = (a[p.department] ?? 0) + 1; return a; }, {});

  return (
    <div style={{ minHeight:'100vh', position:'relative' }}>
      <NavBar current="Prologue" step="00/04" />

      {/* Canvas fills below nav */}
      <div style={{ position:'absolute', inset:0, top:56 }}>
        <DotCanvas participants={participants} connected={connected} />
      </div>

      {/* Overlay UI */}
      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', minHeight:'calc(100vh - 56px)', pointerEvents:'none' }}>

        {/* Main content area */}
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 48px' }}>
          {!connected ? (
            <div style={{ display:'flex', gap:32, width:'100%', maxWidth:1100, alignItems:'flex-start', pointerEvents:'auto' }}>
              {/* Left: Narration */}
              <div style={{ flex:1 }}>
                <p className="caption" style={{ color:'rgba(79,142,247,0.7)', marginBottom:20 }}>Opening Narration</p>
                <div className="glass-card-lg" style={{ padding:'32px 36px' }}>
                  <p style={{ fontSize:'1.375rem', color:'var(--text)', lineHeight:1.75, fontWeight:500, letterSpacing:'-0.01em' }}>
                    내 업무의 결과는 다음 사람의 시작점입니다.
                  </p>
                  
                  <div style={{ margin:'20px 0', borderLeft:'2px solid rgba(201,168,76,0.4)', paddingLeft:20 }}>
                    {[
                      '마케팅이 기획한 신제품이 영업의 수주로 이어지고,',
                      '구매가 자재를 확보하면, 생산 현장이 라인을 가동합니다.',
                      '물류가 제품을 싣고 출발하면,',
                      '재무가 수익을 정산하고 — 그 데이터가 다시 마케팅의 다음 기획으로 돌아옵니다.'
                    ].map((line, i) => (
                      <p key={i} style={{ fontSize:'1.0625rem', color:'var(--text2)', lineHeight:1.8 }}>{line}</p>
                    ))}
                  </div>

                  <p style={{ fontSize:'1.125rem', color:'var(--text)', fontWeight:600, lineHeight:1.7, marginTop:16 }}>
                    우리는 각자의 자리에서 데이터라는 바통을 넘기며<br/>
                    하나의 거대한 가치사슬(Value Chain)을 함께 돌리고 있습니다.
                  </p>
                </div>

                {/* Participant stats */}
                <div style={{ display:'flex', gap:12, marginTop:16, flexWrap:'wrap' }}>
                  <div className="glass-card" style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ fontSize:'2rem', fontWeight:900, color:'#C9A84C', fontVariantNumeric:'tabular-nums' }}>{participants.length}</span>
                    <span style={{ fontSize:'0.875rem', color:'var(--text2)', fontWeight:600 }}>명 참여 중</span>
                  </div>
                  {Object.entries(deptCounts).slice(0, 5).map(([dept, count]) => (
                    <div key={dept} className="glass-card" style={{ padding:'8px 14px', display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:DEPT_COLORS[dept]??'#475569', display:'inline-block', flexShrink:0 }} />
                      <span style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--text)' }}>{dept}</span>
                      <span style={{ fontSize:'0.875rem', fontWeight:900, color:DEPT_COLORS[dept]??'#475569' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: QR Join panel */}
              <div style={{ width:300, flexShrink:0 }}>
                <div className="glass-card-lg" style={{ padding:28, textAlign:'center' }}>
                  <p className="caption" style={{ color:'rgba(201,168,76,0.6)', marginBottom:16 }}>지금 바로 참여</p>
                  
                  <div style={{ background:'white', padding:'16px', borderRadius:'12px', display:'inline-block', marginBottom:'16px' }}>
                    <QRCode value={qrUrl} size={160} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                  </div>
                  
                  <p style={{ fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.6, marginBottom:20 }}>스마트폰 카메라로 스캔 후<br />이름과 부서를 등록하세요</p>
                  
                  {participants.length >= 1 && (
                    <button onClick={() => { setConnected(true); setTimeout(() => setShowTitle(true), 1200); }}
                      className="btn btn-gold" style={{ width:'100%' }}>
                      가치사슬 연결 ✦
                    </button>
                  )}
                  {participants.length === 0 && (
                    <p style={{ fontSize:'0.8125rem', color:'var(--text3)', fontStyle:'italic' }}>참여자를 기다리는 중...</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:'center', animation:'fadeUp 0.8s ease', pointerEvents:'auto' }}>
              {showTitle && (
                <div className="glass-card-lg" style={{ padding:'56px 64px', maxWidth: 820, margin: '0 auto' }}>
                  {/* 헤더 타이틀 영역 */}
                  <h1 className="display text-gold" style={{ marginBottom:12 }}>SYSTEM</h1>
                  <p style={{ fontSize:'1.25rem', fontWeight:600, color:'var(--text)', marginBottom:8 }}>지금, 우리의 가치사슬이 연결되었습니다</p>
                  <p style={{ fontSize:'1rem', color:'rgba(201,168,76,0.9)', fontWeight:700 }}>
                    현재 {participants.length}명이 하나의 흐름 위에 서 있습니다
                  </p>
                  
                  <hr className="divider" style={{ margin:'28px 0' }} />
                  
                  {/* 기준정보 중요성 암시 */}
                  <div style={{ 
                    textAlign: 'left', 
                    padding: '24px 32px', 
                    borderRadius: '12px', 
                  }}>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: 16 }}>
                      이 연결 안에서 여러분 한 사람 한 사람이 입력하는 기준정보 —<br/>
                      품목코드, 단가, 납기일, BOM 한 줄 —<br/>
                      그것이 다음 사람의 업무를 움직이는 <strong style={{ color: 'var(--gold)' }}>시작 버튼</strong>입니다.
                    </p>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--text2)', lineHeight: 1.8 }}>
                      만약 그 데이터가 비어 있다면?<br/>
                      다음 사람의 업무는 멈춥니다.<br/>
                      그리고 그 멈춤은 생각보다 <strong style={{ color: 'var(--red)' }}>훨씬 큰 파장</strong>을 만들어냅니다.
                    </p>
                  </div>

                  <hr className="divider" style={{ margin:'28px 0' }} />

                  {/* 다음 단계 유도 */}
                  <p style={{ fontSize:'1.125rem', color:'var(--text2)', fontWeight:500, lineHeight:1.7, fontStyle: 'italic' }}>
                    다음 단계에서, 데이터 한 칸이 비었을 때<br/>
                    실제로 무슨 일이 벌어졌는지 함께 보겠습니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}