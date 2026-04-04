'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';

export default function Part2Page() {
  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <NavBar current="Part 2" step="02/04" />

      <div style={{ borderBottom:'1px solid var(--glass-border)', padding:'36px 0 28px' }}>
        <div className="slide-container" style={{ paddingBottom:0 }}>
          <p className="caption" style={{ color:'var(--teal)', marginBottom:10 }}>Part 2</p>
          <h1 className="headline" style={{ color:'var(--text)', marginBottom:8 }}>디지털 트윈: 당신의 행위가 돈이 된다</h1>
          <p className="body-md" style={{ color:'var(--text2)', maxWidth:640 }}>
            물리적 현장에서의 움직임은 ERP 시스템 내에서 차변과 대변(돈)으로 복제됩니다. 버튼을 눌러 공장을 가동해 보세요.
          </p>
        </div>
      </div>

      <div className="slide-container anim-up" style={{ paddingTop:36, display:'flex', flexDirection:'column', gap:40 }}>
        <DigitalTwinConveyor />
      </div>
    </div>
  );
}

function DigitalTwinConveyor() {
  // 재무 T계정 상태 (단위: 만원)
  const [inventory, setInventory] = useState(5000); // 자재창고 (초기 5천만원)
  const [wip, setWip] = useState(0);              // 재공품 (제조원가)
  const [fg, setFg] = useState(0);                // 완제품 (제품창고)
  const [cogs, setCogs] = useState(0);            // 매출원가
  const [revenue, setRevenue] = useState(0);      // 매출액
  const [animTrigger, setAnimTrigger] = useState(0);

  const handleInput = () => {
    if(inventory < 1000) return;
    setInventory(p => p - 1000);
    setWip(p => p + 1000); // 재료비 투입
    setAnimTrigger(Date.now());
  };

  const handleProduce = () => {
    if(wip < 1000) return;
    // 가공비(노무/경비) 500원 붙여서 완제품 1500원으로 입고
    setWip(p => p - 1000);
    setFg(p => p + 1500);
    setAnimTrigger(Date.now());
  };

  const handleSell = () => {
    if(fg < 1500) return;
    setFg(p => p - 1500);
    setCogs(p => p + 1500);
    setRevenue(p => p + 2500); // 2500원에 판매
    setAnimTrigger(Date.now());
  };

  return (
    <section className="glass-card-lg" style={{ padding:32 }}>
      <p className="caption" style={{ color:'var(--teal)', marginBottom:20 }}>ERP 거울상 시뮬레이터</p>
      
      {/* ERP 재무제표 (우측 화면 논리) */}
      <div style={{ display:'flex', gap:16, marginBottom:40 }}>
        {[
          { label:'자재 창고 (자산)', val:inventory, color:'var(--blue)' },
          { label:'제조원가 (비용화)', val:wip, color:'var(--warning)' },
          { label:'제품 창고 (자산)', val:fg, color:'var(--teal)' },
          { label:'매출원가 (COGS)', val:cogs, color:'var(--red)' },
          { label:'이익 (Profit)', val:revenue - cogs, color:'var(--gold)', highlight:true }
        ].map(acc => (
          <div key={acc.label} className="glass-card" style={{ flex:1, padding:16, textAlign:'center', border: acc.highlight ? '1px solid var(--gold)' : undefined }}>
            <p style={{ fontSize:'0.75rem', color:'var(--text2)', marginBottom:8 }}>{acc.label}</p>
            <p key={animTrigger} className="value-bounce" style={{ fontSize:'1.5rem', fontWeight:800, color:acc.color }}>{acc.val.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* 공장 현장 컨트롤 (좌측 화면 논리) */}
      <div style={{ position:'relative', height:180, background:'var(--glass-light)', borderRadius:16, border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'space-around', overflow:'hidden' }}>
        
        {/* 애니메이션 박스 */}
        <div key={animTrigger} className="convey-box" style={{ position:'absolute', left:'20%', width:40, height:40, background:'var(--gold)', borderRadius:8, opacity:0 }} />

        <div style={{ textAlign:'center' }}>
          <button onClick={handleInput} className="btn btn-ghost" style={{ border:'1px solid var(--blue)', color:'var(--blue)' }}>1. 자재 투입 (클릭)</button>
          <p style={{ fontSize:'0.75rem', marginTop:8, color:'var(--text2)' }}>창고 출고 확정</p>
        </div>
        <p style={{ fontSize:'1.5rem', color:'var(--glass-border)' }}>→</p>
        
        <div style={{ textAlign:'center' }}>
          <button onClick={handleProduce} className="btn btn-ghost" style={{ border:'1px solid var(--warning)', color:'var(--warning)' }}>2. 기계 가동 (클릭)</button>
          <p style={{ fontSize:'0.75rem', marginTop:8, color:'var(--text2)' }}>실적 및 시간 입력</p>
        </div>
        <p style={{ fontSize:'1.5rem', color:'var(--glass-border)' }}>→</p>

        <div style={{ textAlign:'center' }}>
          <button onClick={handleSell} className="btn btn-ghost" style={{ border:'1px solid var(--teal)', color:'var(--teal)' }}>3. 제품 출하 (클릭)</button>
          <p style={{ fontSize:'0.75rem', marginTop:8, color:'var(--text2)' }}>매출 확정</p>
        </div>
      </div>
      
      <div style={{ marginTop:24, textAlign:'center' }}>
        <p style={{ color:'var(--text2)', fontSize:'0.9375rem' }}>버튼을 누를 때마다 물리적 현장 데이터가 재무제표의 돈으로 즉각 치환됩니다.</p>
      </div>
    </section>
  );
}