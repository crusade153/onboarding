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

      {/* Canvas fills below nav - 뒤에 인원 이름이 예쁘게 보이도록 유지 */}
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
                      '마케팅에서 기획한 신제품이 영업의 수주로 이어지고,',
                      '구매가 자재를 발주하면, 생산 현장이 기계를 돌립니다.',
                      '물류가 트럭에 제품을 싣고 출발하면,',
                      '재무가 최종적으로 우리가 번 돈을 계산하며 결승선을 통과합니다.'
                    ].map((line, i) => (
                      <p key={i} style={{ fontSize:'1.0625rem', color:'var(--text2)', lineHeight:1.8 }}>{line}</p>
                    ))}
                  </div>

                  <p style={{ fontSize:'1.125rem', color:'var(--text)', fontWeight:600, lineHeight:1.7, marginTop:16 }}>
                    우리는 각자의 부서에서 서로의 데이터를 믿고 이어달리는<br/>거대한 가치사슬(Value Chain)의 릴레이 경주를 하고 있습니다.
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
                  <p style={{ fontSize:'1.25rem', fontWeight:600, color:'var(--text)', marginBottom:8 }}>데이터라는 바통을 주고받는 릴레이 경주</p>
                  <p style={{ fontSize:'1rem', color:'rgba(201,168,76,0.9)', fontWeight:700 }}>
                    현재 {participants.length}명이 하나로 연결되었습니다
                  </p>
                  
                  <hr className="divider" style={{ margin:'28px 0' }} />
                  
                  {/* 실제 사례 텍스트 (글래스 테마를 유지하면서 가독성만 개선) */}
                  <div style={{ 
                    textAlign: 'left', 
                    background: 'rgba(248,113,113,0.05)', 
                    padding: '24px 32px', 
                    borderRadius: '12px', 
                    borderLeft: '3px solid var(--red)' 
                  }}>
                    <p style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--red)', marginBottom: 12 }}>
                      🚨 끊어진 사슬 하나가 불러온 6,000만 원의 나비효과
                    </p>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: 12 }}>
                      영업의 성공적인 수출 수주, 그리고 단 하루 만에 완벽하게 생산된 <strong>라면 20만 식</strong>.<br/>
                      하지만 시스템에 <strong>'수출용 날짜 표기(일부인) 기준정보'</strong>가 누락되어 모두 내수용으로 잘못 생산되었습니다.
                    </p>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                      이 데이터 빈칸 하나로 인해 현장은 20만 개의 포장지를 일일이 뜯어야 했고,<br/>
                      <strong style={{ color: 'var(--red)' }}>결국 하루 가공비 약 6,000만 원이 허공으로 사라졌습니다.</strong>
                    </p>
                  </div>

                  <hr className="divider" style={{ margin:'28px 0' }} />

                  {/* 결론 명언 영역 */}
                  <p style={{ fontSize:'1.125rem', color:'var(--text)', fontWeight:600, lineHeight:1.7, fontStyle: 'italic' }}>
                    &ldquo;내가 오늘 입력하는 <span style={{ color: 'var(--gold)' }}>데이터 하나</span>는 단순한 타이핑이 아닙니다.<br/>
                    다음 부서가 안심하고 일할 수 있는 <span style={{ color: 'var(--gold)' }}>신뢰의 바통</span>이며,<br/>
                    막대한 손실을 막아내는 가장 강력한 <span style={{ color: 'var(--red)' }}>첫 번째 방어선</span>입니다.&rdquo;
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