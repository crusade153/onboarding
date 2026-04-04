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
    // 클라이언트 마운트 시점에 실제 호스트 도메인(/join)으로 업데이트
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
                    하나의 제품이 고객에게 닿기까지.
                  </p>
                  
                  {/* 변경된 카피라이트 적용 영역 */}
                  <div style={{ margin:'20px 0', borderLeft:'2px solid rgba(201,168,76,0.4)', paddingLeft:20 }}>
                    {[
                      '마케팅이 브랜딩하고, R&D가 제품을 설계하며,',
                      'SCM이 S&OP로 수요와 공급의 길을 엽니다.',
                      '구매가 원료를 조달하고, 생산이 완제품을 만들면,',
                      '물류가 출고하고, 영업이 최전선에서 판매를 이끕니다.',
                      '그리고 원가와 회계는 이 모든 가치 사슬을 숫자로 완성합니다.'
                    ].map((line, i) => (
                      <p key={i} style={{ fontSize:'1.0625rem', color:'var(--text2)', lineHeight:1.8 }}>{line}</p>
                    ))}
                  </div>

                  <p style={{ fontSize:'1.125rem', color:'var(--text)', fontWeight:600, lineHeight:1.7, marginTop:16 }}>
                    역할은 다르지만, 우리는 거대한 하나의 가치 사슬로 연결되어 있습니다.<br/>
                    그런데 우리는 서로의 기준을 제대로 알고 있을까요?
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
                  
                  {/* 실제 QR 코드 렌더링 영역 */}
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
                <div className="glass-card-lg" style={{ padding:'56px 72px', maxWidth:600 }}>
                  <h1 className="display text-gold" style={{ marginBottom:12 }}>Systema</h1>
                  <p style={{ fontSize:'1.375rem', fontWeight:600, color:'var(--text)', marginBottom:8 }}>함께 세운 것</p>
                  <hr className="divider" style={{ margin:'20px 0' }} />
                  <p style={{ fontSize:'1.0625rem', color:'var(--text2)', fontStyle:'italic', lineHeight:1.7 }}>
                    &ldquo;A system is not given. It is built together.&rdquo;
                  </p>
                  <p style={{ fontSize:'1rem', color:'var(--text2)', marginTop:6 }}>
                    시스템은 주어지는 것이 아니라, 함께 세우는 것입니다.
                  </p>
                  <p style={{ fontSize:'0.9rem', color:'rgba(201,168,76,0.6)', marginTop:16, fontWeight:600 }}>
                    {participants.length}명이 연결됨
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