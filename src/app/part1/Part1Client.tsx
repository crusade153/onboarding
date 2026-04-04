// src/app/part1/Part1Client.tsx
'use client';

import { useState } from 'react';
import { simulateYield, simulatePriceUnit, CODE_RULE, BomItem } from '@/lib/bom-data';
import NavBar from '@/components/NavBar';

type Tab = 'intro' | 'bom' | 'price' | 'code';

const TABS: { key: Tab; label: string; sub: string }[] = [
  { key: 'intro', label: '기준정보란?',   sub: '개념 이해' },
  { key: 'bom',   label: '시나리오 A',    sub: '수율 오류 → 역마진' },
  { key: 'price', label: '시나리오 B',    sub: '단위 오류 → 매출 왜곡' },
  { key: 'code',  label: '시나리오 C',    sub: '코드 규칙 → 집계 불가' },
];

export default function Part1Client({ initialBomItems }: { initialBomItems: BomItem[] }) {
  const [tab, setTab] = useState<Tab>('intro');

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <NavBar current="Part 1" step="01/04" />

      <div style={{ borderBottom:'1px solid var(--glass-border)', padding:'36px 0 28px' }}>
        <div className="slide-container" style={{ paddingBottom:0 }}>
          <p className="caption" style={{ color:'var(--gold)', marginBottom:10 }}>Part 1</p>
          <h1 className="headline" style={{ color:'var(--text)', marginBottom:8 }}>기준이 무너지면 시스템이 무너진다</h1>
          <p className="body-md" style={{ color:'var(--text2)', maxWidth:640 }}>
            기준정보(Master Data)는 모든 경영 수치의 출발점입니다. 한 줄의 오류가 어떻게 회사 전체에 파급되는지 직접 확인합니다.
          </p>

          <div style={{ display:'flex', gap:4, marginTop:28, background:'var(--glass-light)', padding:4, borderRadius:12, border:'1px solid var(--glass-border)', width:'fit-content' }}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:'9px 18px', borderRadius:9, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', border:'none',
                background: tab===t.key ? 'var(--gold-dim)' : 'transparent',
                color: tab===t.key ? 'var(--gold)' : 'var(--text2)',
                outline: tab===t.key ? '1px solid var(--gold)' : 'none',
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
        {tab === 'intro' && <IntroSection />}
        {tab === 'bom'   && <BomSimulator bomItems={initialBomItems} />}
        {tab === 'price' && <PriceSimulator />}
        {tab === 'code'  && <CodeSimulator />}
      </div>
    </div>
  );
}

function IntroSection() {
  return (
    <div className="anim-up" style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="glass-card-lg" style={{ padding:32 }}>
          <p className="caption" style={{ color:'var(--gold)', marginBottom:16 }}>기준정보(Master Data)란</p>
          <p className="title" style={{ color:'var(--text)', marginBottom:16, lineHeight:1.45 }}>모든 경영 수치를 계산하기 위한<br /><span className="text-gold">유일한 기준값</span></p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { icon:'🏷️', label:'제품 코드 체계', desc:'어떤 제품인지 식별하는 고유 규칙' },
              { icon:'💰', label:'판가 및 단위', desc:'얼마에, 어떤 단위로 팔았는지' },
              { icon:'🏭', label:'BOM · 수율', desc:'무엇을 얼마나 투입해서 만드는지' },
              { icon:'⚙️', label:'공정 · 원가기준', desc:'어떻게 만들고 얼마가 드는지' },
            ].map((item) => (
              <div key={item.label} style={{ display:'flex', gap:12, padding:'12px 14px', background:'var(--glass-light)', borderRadius:10, border:'1px solid var(--glass-border)' }}>
                <span style={{ fontSize:'1.25rem', flexShrink:0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight:700, fontSize:'0.9375rem', color:'var(--text)', marginBottom:2 }}>{item.label}</p>
                  <p style={{ fontSize:'0.8125rem', color:'var(--text2)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="glass-card" style={{ padding:24, flex:1 }}>
            <p className="caption" style={{ color:'var(--blue)', marginBottom:16 }}>기준정보 생태계 — 누가 만들고, 누가 쓰는가</p>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {[
                { dept:'마케팅', info:'제품 코드 체계 (이름·규격·채널)', color:'var(--blue)' },
                { dept:'영업', info:'판매가·단위·거래처 마스터', color:'var(--teal)' },
                { dept:'생산 · 구매', info:'BOM·수율·공정 / 자재 단가', color:'var(--warning)' },
                { dept:'회계', info:'원가 데이터 검증·결산 반영', color:'var(--red)' },
                { dept:'원가기획', info:'데이터를 엮어 원가 산출 및 예측', color:'var(--gold)' },
              ].map((row, i, arr) => (
                <div key={row.dept}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:`${row.color}15`, borderRadius:10, border:`1px solid ${row.color}30` }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:row.color, flexShrink:0 }} />
                    <span style={{ fontWeight:700, fontSize:'0.9375rem', color:row.color, width:90, flexShrink:0 }}>{row.dept}</span>
                    <span style={{ fontSize:'0.875rem', color:'var(--text2)' }}>{row.info}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width:2, height:12, background:'var(--glass-border)', margin:'0 auto 0 17px' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BomSimulator({ bomItems }: { bomItems: BomItem[] }) {
  const [selectedCode, setSelectedCode] = useState(bomItems[0]?.item_code || '');
  const [yieldPct, setYieldPct] = useState(Math.round((bomItems[0]?.yield_rate || 0.92) * 100));

  const item = bomItems.find(b => b.item_code === selectedCode);
  if (!item) return <p>데이터 로딩 오류</p>;

  const normalYieldPct = Math.round(item.yield_rate * 100);
  const result = simulateYield(selectedCode, yieldPct / 100, bomItems);
  const isError = yieldPct < normalYieldPct;

  const impactScale = result ? Math.min((result.diffAnnual / 20_0000_0000) * 100, 100) : 0; 

  return (
    <div className="anim-up" style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="glass-card" style={{ padding:'20px 24px', borderLeft:'3px solid var(--red)' }}>
        <p style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--red)', marginBottom:4 }}>시나리오 A — BOM 수율 오류 → 원가 왜곡 → 역마진</p>
        <p style={{ color:'var(--text2)', fontSize:'0.9375rem', lineHeight:1.7 }}>
          원재료 수율을 고의로 낮춰보세요. 사소한 1%의 누락이 1년을 거치면 경영진의 책상에 어떻게 보고되는지 확인하십시오. (Neon DB 연동 데이터)
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:20, alignItems:'start' }}>
        <div>
          <p className="caption" style={{ marginBottom:12 }}>BOM — 라면 A (팩당 투입 기준)</p>
          <div className="glass-card-lg" style={{ overflow:'hidden', padding:0 }}>
            <table className="e-table">
              <thead>
                <tr>
                  <th>자재명</th><th>수율</th><th style={{ textAlign:'right' }}>단가</th>
                </tr>
              </thead>
              <tbody>
                {bomItems.map((b) => {
                  const sel = selectedCode === b.item_code;
                  return (
                    <tr key={b.item_code} onClick={() => { setSelectedCode(b.item_code); setYieldPct(Math.round(b.yield_rate * 100)); }}
                      style={{ cursor:'pointer', background: sel ? 'var(--gold-dim)' : undefined, transition:'background 0.12s' }}>
                      <td style={{ fontWeight: sel ? 700 : 400, color: sel ? 'var(--gold)' : undefined }}>{b.item_name}</td>
                      <td style={{ fontVariantNumeric:'tabular-nums', fontWeight: sel ? 700 : 400, color: sel ? 'var(--gold)' : undefined }}>{(b.yield_rate*100).toFixed(1)}%</td>
                      <td style={{ textAlign:'right', fontVariantNumeric:'tabular-nums', color:'var(--text3)' }}>{b.unit_price.toLocaleString()}원</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="glass-card-lg" style={{ padding:28, border: isError ? '2px solid rgba(248,113,113,0.6)' : '1px solid var(--glass-border)', boxShadow: isError ? '0 0 30px rgba(248,113,113,0.15)' : 'none', transition: 'all 0.3s ease' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div>
                <p className="caption" style={{ color: isError ? 'var(--red)' : 'var(--teal)', marginBottom:4 }}>BOM 제어 패널</p>
                <p style={{ fontWeight:700, fontSize:'1.125rem', color:'var(--text)' }}>{item.item_name}</p>
              </div>
              {isError && <span className="badge pop-in" style={{ color:'white', background:'var(--red)', border:'none', animation:'pulse 1s infinite' }}>⚠ WARRNING</span>}
            </div>

            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:16 }}>
              <span className="impact-number" style={{ color: isError ? 'var(--red)' : 'var(--teal)' }}>{yieldPct}%</span>
              <span style={{ fontSize:'1rem', color:'var(--text2)', fontWeight:600 }}>입력 수율</span>
            </div>
            <input type="range" min={70} max={100} value={yieldPct} onChange={(e) => setYieldPct(Number(e.target.value))}
              style={{ width:'100%', accentColor: isError ? 'var(--red)' : 'var(--teal)', marginBottom:8, height:8, cursor:'pointer' }} />
          </div>

          {result && (
            <div className="glass-card" style={{ padding:20, overflow:'hidden', position:'relative' }}>
              <div style={{ 
                position:'absolute', bottom:0, left:0, width:'100%', 
                height: isError ? `${impactScale}%` : '0%', 
                background:'linear-gradient(to top, rgba(248,113,113,0.1), rgba(248,113,113,0.02))', 
                transition:'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)', zIndex:0 
              }} />
              
              <div style={{ position:'relative', zIndex:1 }}>
                <p style={{ fontWeight:700, fontSize:'0.9375rem', color: isError ? 'var(--red)' : 'var(--teal)', marginBottom:14 }}>
                  {isError ? '🚨 나비효과: 경영진 보고서 왜곡 발생' : '✓ 시스템 정상 가동'}
                </p>
                {[
                  { label:'팩당 원가 오차', val:`${result.diffPer >= 0 ? '+' : ''}${result.diffPer.toLocaleString()}원` },
                  { label:'연간 손실 누적 (1억 팩 기준)', val:`${result.diffAnnual >= 0 ? '+' : ''}${(result.diffAnnual/1e8).toFixed(2)}억원`, large:true },
                ].map(({ label, val, large }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--glass-border)' }}>
                    <span style={{ fontSize: large ? '1rem' : '0.875rem', color:'var(--text)', fontWeight: large ? 700 : 400 }}>{label}</span>
                    <span className="pop-in" style={{ fontVariantNumeric:'tabular-nums', fontWeight: 900, fontSize: large ? '1.75rem' : '1.125rem', color: isError ? 'var(--red)' : 'var(--teal)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PriceSimulator() {
  const [useWrongUnit, setUseWrongUnit] = useState(false);
  const result = simulatePriceUnit(useWrongUnit);

  return (
    <div className="anim-up" style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="glass-card" style={{ padding:'20px 24px', borderLeft:'3px solid var(--warning)' }}>
        <p style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--warning)', marginBottom:4 }}>시나리오 B — 판가 단위 오류 → 매출 왜곡</p>
        <p style={{ color:'var(--text2)', fontSize:'0.9375rem', lineHeight:1.7 }}>
          영업에서 100박스를 팔았다고 입력했습니다. 이 박스는 '20팩'짜리인가요, '2팩'짜리인가요?
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="glass-card-lg" style={{ padding:32, textAlign:'center' }}>
          <p className="caption" style={{ marginBottom:20 }}>영업 입력: "월 5만 박스 판매"</p>
          <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:24 }}>
            <button onClick={() => setUseWrongUnit(false)} className={`btn ${!useWrongUnit ? 'btn-primary' : 'btn-ghost'}`} style={{ flex:1, padding:'16px' }}>
              정상 기준정보<br/><span style={{ fontSize:'0.8rem', opacity:0.8 }}>1박스 = 20팩</span>
            </button>
            <button onClick={() => setUseWrongUnit(true)} className={`btn ${useWrongUnit ? 'btn-primary' : 'btn-ghost'}`} style={{ flex:1, padding:'16px', background: useWrongUnit ? 'var(--red)' : undefined, color: useWrongUnit ? '#fff' : undefined, borderColor: useWrongUnit ? 'var(--red)' : undefined }}>
              오류 기준정보<br/><span style={{ fontSize:'0.8rem', opacity:0.8 }}>1박스 = 2팩</span>
            </button>
          </div>
        </div>

        <div className="glass-card-lg" style={{ padding:32, background: useWrongUnit ? 'rgba(248,113,113,0.05)' : 'var(--glass)' }}>
          <p className="caption" style={{ color: useWrongUnit ? 'var(--red)' : 'var(--teal)', marginBottom:20 }}>
            {useWrongUnit ? '🚨 시스템 매출 산출 오류' : '✓ 정상 매출 산출'}
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:12, borderBottom:'1px solid var(--glass-border)' }}>
              <span style={{ color:'var(--text2)' }}>월 매출액 (5만 박스)</span>
              <span style={{ fontWeight:800, fontSize:'1.25rem', color: useWrongUnit ? 'var(--red)' : 'var(--teal)' }}>
                {(result.monthlyRevenue / 100_000_000).toFixed(1)}억 원
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeSimulator() {
  return (
    <div className="anim-up" style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="glass-card" style={{ padding:'20px 24px', borderLeft:'3px solid var(--blue)' }}>
        <p style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--blue)', marginBottom:4 }}>시나리오 C — 코드 규칙 미준수 → 실적 집계 불가</p>
      </div>
      <div className="glass-card-lg" style={{ padding:0, overflow:'hidden' }}>
        <table className="e-table">
          <thead>
            <tr><th>입력된 제품 코드</th><th>설명</th><th>시스템 판정 결과</th></tr>
          </thead>
          <tbody>
            {CODE_RULE.examples.map((ex, idx) => (
              <tr key={idx} style={{ background: !ex.isCorrect ? 'rgba(248,113,113,0.05)' : undefined }}>
                <td style={{ fontWeight: 700, fontFamily:'monospace', color: ex.isCorrect ? 'var(--text)' : 'var(--red)' }}>{ex.code}</td>
                <td style={{ color:'var(--text2)' }}>{ex.description}</td>
                <td>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:6, color: ex.isCorrect ? 'var(--teal)' : 'var(--red)', fontWeight:700, fontSize:'0.875rem' }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background: ex.isCorrect ? 'var(--teal)' : 'var(--red)' }} /> 
                    {ex.isCorrect ? '정상 집계' : ex.problem}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}