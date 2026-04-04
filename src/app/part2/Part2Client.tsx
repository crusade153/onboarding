// src/app/part2/Part2Client.tsx
'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { simulateUtilization, FactoryConfig, Product } from '@/lib/bom-data';

type Tab = 'twin' | 'utilization' | 'causation';

const TABS: { key: Tab; label: string; sub: string }[] = [
  { key: 'twin',        label: '디지털 트윈', sub: '물류와 재무의 일치' },
  { key: 'utilization', label: '가동률의 마법', sub: '고정비와 총원가의 관계' },
  { key: 'causation',   label: '상관관계 vs 인과관계', sub: '원가를 오해하는 이유' },
];

export default function Part2Client({ factoryConfig, product }: { factoryConfig: FactoryConfig, product: Product }) {
  const [tab, setTab] = useState<Tab>('twin');

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <NavBar current="Part 2" step="02/04" />

      <div style={{ borderBottom:'1px solid var(--glass-border)', padding:'36px 0 28px' }}>
        <div className="slide-container" style={{ paddingBottom:0 }}>
          <p className="caption" style={{ color:'var(--teal)', marginBottom:10 }}>Part 2</p>
          <h1 className="headline" style={{ color:'var(--text)', marginBottom:8 }}>현장의 행위는 어떻게 숫자가 되는가</h1>
          <p className="body-md" style={{ color:'var(--text2)', maxWidth:640 }}>
            모든 부서의 행동은 ERP를 통해 돈으로 치환됩니다. 진짜 원가를 움직이는 핵심 변수들을 확인해보세요.
          </p>

          <div style={{ display:'flex', gap:4, marginTop:28, background:'var(--glass-light)', padding:4, borderRadius:12, border:'1px solid var(--glass-border)', width:'fit-content' }}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:'9px 18px', borderRadius:9, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', border:'none',
                background: tab===t.key ? 'var(--teal-dim)' : 'transparent',
                color: tab===t.key ? 'var(--teal)' : 'var(--text2)',
                outline: tab===t.key ? '1px solid var(--teal)' : 'none',
                transition:'all 0.15s',
              }}>
                {t.label}
                <span style={{ display:'block', fontSize:'0.7rem', fontWeight:500, opacity:0.65, marginTop:1 }}>{t.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="slide-container" style={{ paddingTop:36 }}>
        {tab === 'twin' && <DigitalTwinConveyor />}
        {tab === 'utilization' && <UtilizationSimulator config={factoryConfig} sellingPrice={product.selling_price} />}
        {tab === 'causation' && <CausationCards />}
      </div>
    </div>
  );
}

function DigitalTwinConveyor() {
  const [inventory, setInventory] = useState(5000);
  const [wip, setWip] = useState(0);
  const [fg, setFg] = useState(0);
  const [cogs, setCogs] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [animTrigger, setAnimTrigger] = useState(0);

  const handleInput = () => {
    if(inventory < 1000) return;
    setInventory(p => p - 1000); setWip(p => p + 1000); setAnimTrigger(Date.now());
  };
  const handleProduce = () => {
    if(wip < 1000) return;
    setWip(p => p - 1000); setFg(p => p + 1500); setAnimTrigger(Date.now());
  };
  const handleSell = () => {
    if(fg < 1500) return;
    setFg(p => p - 1500); setCogs(p => p + 1500); setRevenue(p => p + 2500); setAnimTrigger(Date.now());
  };

  return (
    <div className="anim-up glass-card-lg" style={{ padding:32 }}>
      <p className="caption" style={{ color:'var(--teal)', marginBottom:20 }}>ERP 거울상 시뮬레이터</p>
      
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

      <div style={{ position:'relative', height:180, background:'var(--glass-light)', borderRadius:16, border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'space-around', overflow:'hidden' }}>
        <div key={animTrigger} className="convey-box" style={{ position:'absolute', left:'20%', width:40, height:40, background:'var(--gold)', borderRadius:8, opacity:0 }} />
        <div style={{ textAlign:'center' }}>
          <button onClick={handleInput} className="btn btn-ghost" style={{ border:'1px solid var(--blue)', color:'var(--blue)' }}>1. 자재 투입</button>
        </div>
        <p style={{ fontSize:'1.5rem', color:'var(--glass-border)' }}>→</p>
        <div style={{ textAlign:'center' }}>
          <button onClick={handleProduce} className="btn btn-ghost" style={{ border:'1px solid var(--warning)', color:'var(--warning)' }}>2. 기계 가동</button>
        </div>
        <p style={{ fontSize:'1.5rem', color:'var(--glass-border)' }}>→</p>
        <div style={{ textAlign:'center' }}>
          <button onClick={handleSell} className="btn btn-ghost" style={{ border:'1px solid var(--teal)', color:'var(--teal)' }}>3. 제품 출하</button>
        </div>
      </div>
    </div>
  );
}

function UtilizationSimulator({ config, sellingPrice }: { config: FactoryConfig, sellingPrice: number }) {
  const [utilPct, setUtilPct] = useState(80);
  const result = simulateUtilization(utilPct, config, sellingPrice);

  const maxCost = 8000;
  const varCostHeight = (result.variableCostPerPack / maxCost) * 100;
  const fixCostHeight = (result.fixedPerPack / maxCost) * 100;
  const priceLinePos = (sellingPrice / maxCost) * 100;

  return (
    <div className="anim-up" style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="glass-card" style={{ padding:'20px 24px', borderLeft:'3px solid var(--gold)' }}>
        <p style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--gold)', marginBottom:4 }}>공장 전체 가동률과 원가의 관계 (DB 연동)</p>
        <p style={{ color:'var(--text2)', fontSize:'0.9375rem', lineHeight:1.7 }}>
          내 부서 실적이 아무리 좋아도 공장 전체 가동률이 떨어지면 배부되는 고정비가 급증합니다. DB의 "{config.factory_name}" 고정비 월 {Math.round(config.monthly_fixed_cost/100_000_000)}억원을 기준으로 시뮬레이션합니다.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:20 }}>
        <div className="glass-card-lg" style={{ padding:32, position:'relative' }}>
          <p className="caption" style={{ marginBottom:16 }}>가동률 컨트롤 패널</p>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:8 }}>
            <span style={{ fontWeight:800, fontSize:'2rem', color: result.isLoss ? 'var(--red)' : 'var(--teal)' }}>{utilPct}%</span>
            <span style={{ fontSize:'0.9rem', color:'var(--text2)' }}>월 생산: {result.production.toLocaleString()}팩</span>
          </div>
          <input type="range" min={20} max={100} value={utilPct} onChange={(e) => setUtilPct(Number(e.target.value))}
            style={{ width:'100%', accentColor: result.isLoss ? 'var(--red)' : 'var(--teal)', marginBottom:40, cursor:'pointer' }} />

          <div style={{ height:200, borderBottom:'2px solid var(--text)', borderLeft:'2px solid var(--glass-border)', position:'relative', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
            <div style={{ position:'absolute', bottom:`${priceLinePos}%`, left:0, width:'100%', borderTop:'2px dashed var(--gold)', zIndex:0 }}>
              <span style={{ position:'absolute', right:10, top:-20, fontSize:'0.75rem', color:'var(--gold)', fontWeight:700 }}>판매가 ({sellingPrice.toLocaleString()}원)</span>
            </div>
            
            <div style={{ width:100, display:'flex', flexDirection:'column', zIndex:1 }}>
              <div style={{ height:`${fixCostHeight}%`, background:'var(--warning)', display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontSize:'0.8rem', fontWeight:700, transition:'height 0.3s' }}>
                {result.fixedPerPack > 0 ? `고정비\n${result.fixedPerPack.toLocaleString()}` : ''}
              </div>
              <div style={{ height:`${varCostHeight}%`, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.8rem', fontWeight:700 }}>
                변동비 {result.variableCostPerPack.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="glass-card" style={{ padding:24, border: result.isLoss ? '2px solid var(--red)' : '1px solid var(--glass-border)' }}>
            <p className="caption" style={{ marginBottom:16 }}>팩당 손익 분석</p>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ color:'var(--text2)' }}>총 원가</span>
              <span style={{ fontWeight:700, color:'var(--text)' }}>{result.totalCostPerPack.toLocaleString()}원</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--glass-border)' }}>
              <span style={{ color:'var(--text2)' }}>마진율</span>
              <span className="pop-in" style={{ fontWeight:900, fontSize:'1.5rem', color: result.isLoss ? 'var(--red)' : 'var(--gold)' }}>{result.marginRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CausationCards() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const CARDS = [
    { id: 1, dept: '마케팅', q: '판매량이 늘었는데 왜 원가가 오르죠?', truth: '원가는 공장 전체 가동률의 영향을 받습니다.' },
    { id: 2, dept: '영업', q: '단가를 낮춰서 생산했는데 바로 적용이 안되네요?', truth: '기존 재고가 소진될 때까지 이동평균가로 반영됩니다.' },
    { id: 3, dept: '생산', q: '수율이 올랐는데 왜 재료비가 오르죠?', truth: '수율이 아닌 원단위(실제 투입량)가 원가 하락의 진짜 변수입니다.' }
  ];

  return (
    <div className="anim-up" style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="glass-card" style={{ padding:'20px 24px', background:'var(--glass-light)', textAlign:'center' }}>
        <p style={{ fontWeight:800, fontSize:'1.125rem', color:'var(--text)', marginBottom:8 }}>상관관계 vs 인과관계</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {CARDS.map(card => {
          const isActive = activeCard === card.id;
          return (
            <div key={card.id} onClick={() => setActiveCard(isActive ? null : card.id)} 
              className="glass-card" style={{ padding:24, cursor:'pointer', border: isActive ? '2px solid var(--gold)' : '1px solid var(--glass-border)', transition:'all 0.3s' }}>
              <p className="caption" style={{ color:'var(--blue)', marginBottom:12 }}>{card.dept}의 오해</p>
              <p style={{ fontWeight:700, fontSize:'1.0625rem', color:'var(--text)', marginBottom:16 }}>"{card.q}"</p>
              {isActive && (
                <div className="pop-in" style={{ padding:16, background:'rgba(52,211,153,0.1)', borderRadius:8, borderLeft:'3px solid var(--teal)' }}>
                  <p style={{ fontSize:'0.875rem', color:'var(--text)', lineHeight:1.6 }}>{card.truth}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}