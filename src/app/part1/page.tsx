'use client';

import { useState } from 'react';
import { BOM_ITEMS, simulateYield, simulatePriceUnit, CODE_RULE } from '@/lib/bom-data';
import NavBar from '@/components/NavBar';

type Tab = 'intro' | 'bom' | 'price' | 'code';

const TABS: { key: Tab; label: string; sub: string }[] = [
  { key: 'intro', label: '기준정보란?',   sub: '개념 이해' },
  { key: 'bom',   label: '시나리오 A',    sub: '수율 오류 → 역마진' },
  { key: 'price', label: '시나리오 B',    sub: '단위 오류 → 매출 왜곡' },
  { key: 'code',  label: '시나리오 C',    sub: '코드 규칙 → 집계 불가' },
];

export default function Part1Page() {
  const [tab, setTab] = useState<Tab>('intro');

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <NavBar current="Part 1" step="01/04" />

      {/* Page header */}
      <div style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'36px 0 28px' }}>
        <div className="slide-container" style={{ paddingBottom:0 }}>
          <p className="caption" style={{ color:'rgba(201,168,76,0.6)', marginBottom:10 }}>Part 1</p>
          <h1 className="headline" style={{ color:'var(--text)', marginBottom:8 }}>기준이 무너지면 시스템이 무너진다</h1>
          <p className="body-md" style={{ color:'var(--text2)', maxWidth:640 }}>
            기준정보(Master Data)는 모든 경영 수치의 출발점입니다. 한 줄의 오류가 어떻게 회사 전체에 파급되는지 직접 확인합니다.
          </p>

          {/* Tab bar */}
          <div style={{ display:'flex', gap:4, marginTop:28, background:'rgba(255,255,255,0.04)', padding:4, borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', width:'fit-content' }}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:'9px 18px', borderRadius:9, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', border:'none',
                background: tab===t.key ? 'rgba(201,168,76,0.18)' : 'transparent',
                color: tab===t.key ? '#C9A84C' : 'var(--text2)',
                outline: tab===t.key ? '1px solid rgba(201,168,76,0.4)' : 'none',
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
        {tab === 'bom'   && <BomSimulator />}
        {tab === 'price' && <PriceSimulator />}
        {tab === 'code'  && <CodeSimulator />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   기준정보 개념 교육
   ───────────────────────────────────────────── */
function IntroSection() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      {/* 핵심 정의 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="glass-card-lg" style={{ padding:32 }}>
          <p className="caption" style={{ color:'rgba(201,168,76,0.6)', marginBottom:16 }}>기준정보(Master Data)란</p>
          <p className="title" style={{ color:'var(--text)', marginBottom:16, lineHeight:1.45 }}>모든 경영 수치를 계산하기 위한<br /><span className="text-gold">유일한 기준값</span></p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { icon:'🏷️', label:'제품 코드 체계', desc:'어떤 제품인지 식별하는 고유 규칙' },
              { icon:'💰', label:'판가 및 단위', desc:'얼마에, 어떤 단위로 팔았는지' },
              { icon:'🏭', label:'BOM · 수율', desc:'무엇을 얼마나 투입해서 만드는지' },
              { icon:'⚙️', label:'공정 · 원가기준', desc:'어떻게 만들고 얼마가 드는지' },
            ].map((item) => (
              <div key={item.label} style={{ display:'flex', gap:12, padding:'12px 14px', background:'rgba(255,255,255,0.04)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)' }}>
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
          {/* 가치사슬 연결 */}
          <div className="glass-card" style={{ padding:24, flex:1 }}>
            <p className="caption" style={{ color:'rgba(79,142,247,0.7)', marginBottom:16 }}>기준정보의 흐름</p>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {[
                { dept:'마케팅', info:'제품 코드 규칙', color:'#4F8EF7' },
                { dept:'영업', info:'판가 · 단위 등록', color:'#2DD4BF' },
                { dept:'생산 · 구매', info:'BOM · 수율 등록', color:'#F87171' },
                { dept:'원가기획', info:'원가기준 설정', color:'#C9A84C' },
                { dept:'경영진', info:'손익 판단 · 의사결정', color:'#A78BFA' },
              ].map((row, i, arr) => (
                <div key={row.dept}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:`${row.color}10`, borderRadius:10, border:`1px solid ${row.color}25` }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:row.color, flexShrink:0 }} />
                    <span style={{ fontWeight:700, fontSize:'0.9375rem', color:row.color, width:90, flexShrink:0 }}>{row.dept}</span>
                    <span style={{ fontSize:'0.875rem', color:'var(--text2)' }}>{row.info}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width:2, height:12, background:'rgba(255,255,255,0.1)', margin:'0 auto 0 17px' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 핵심 메시지 */}
          <div className="glass-card" style={{ padding:24 }}>
            <p style={{ fontSize:'1.0625rem', color:'var(--text)', lineHeight:1.75, fontWeight:500 }}>
              기준정보는 각 부서의 내부 문제가 아닙니다.<br />
              <span style={{ color:'#C9A84C', fontWeight:700 }}>마케팅의 코드가 영업의 매출이 되고,<br />
              영업의 판가가 원가기획의 손익이 됩니다.</span>
            </p>
          </div>
        </div>
      </div>

      {/* 오늘 배울 것 */}
      <div>
        <div className="section-header">
          <p className="caption" style={{ color:'rgba(201,168,76,0.6)' }}>오늘 살펴볼 시나리오 3가지</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
          {[
            { key:'A', title:'BOM 수율 오류', dept:'생산 · 원가기획', color:'#F87171', impact:'연간 수십억원 원가 오차', desc:'라면 A의 밀가루 수율을 잘못 입력하면 원가가 실제보다 낮게 계산됩니다. "이 제품 남는다"는 판단이 실제로는 역마진입니다.' },
            { key:'B', title:'판가 단위 오류', dept:'영업', color:'#F59E0B', impact:'매출 10배 왜곡', desc:'1박스=20팩을 1박스=2팩으로 입력하면 박스 기준 매출이 10배 부풀거나 축소됩니다. 결산이 마비됩니다.' },
            { key:'C', title:'코드 규칙 미준수', dept:'마케팅', color:'#4F8EF7', impact:'채널별 실적 집계 불가', desc:'제품 코드 체계를 무시하고 임의 코드를 생성하면 동일 제품이 시스템에서 여러 개로 쪼개집니다. 캠페인 효과를 측정할 수 없습니다.' },
          ].map((s) => (
            <div key={s.key} className="glass-card" style={{ padding:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <span style={{ fontFamily:'monospace', fontSize:'1.25rem', fontWeight:900, color:s.color }}>시나리오 {s.key}</span>
                <span className="badge" style={{ fontSize:'0.7rem', color:s.color, borderColor:`${s.color}40`, background:`${s.color}12` }}>{s.dept}</span>
              </div>
              <p style={{ fontWeight:800, fontSize:'1.0625rem', color:'var(--text)', marginBottom:8 }}>{s.title}</p>
              <div style={{ background:`${s.color}15`, border:`1px solid ${s.color}30`, borderRadius:8, padding:'8px 12px', marginBottom:10 }}>
                <p style={{ fontSize:'0.8125rem', fontWeight:700, color:s.color }}>예상 피해 규모</p>
                <p style={{ fontWeight:800, fontSize:'1rem', color:s.color }}>{s.impact}</p>
              </div>
              <p style={{ fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   시나리오 A: BOM 수율 시뮬레이터
   ───────────────────────────────────────────── */
function BomSimulator() {
  const [selectedCode, setSelectedCode] = useState('RM-FLOUR-001');
  const [yieldPct, setYieldPct] = useState(92);

  const item = BOM_ITEMS.find(b => b.code === selectedCode)!;
  const normalYieldPct = Math.round(item.yieldRate * 100);
  const result = simulateYield(selectedCode, yieldPct / 100);
  const isError = yieldPct < normalYieldPct;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Edu header */}
      <div className="glass-card" style={{ padding:'20px 24px', borderLeft:'3px solid #F87171' }}>
        <p style={{ fontWeight:800, fontSize:'1.0625rem', color:'#F87171', marginBottom:4 }}>시나리오 A — BOM 수율 오류 → 원가 왜곡 → 역마진</p>
        <p style={{ color:'var(--text2)', fontSize:'0.9375rem', lineHeight:1.7 }}>
          BOM(Bill of Materials)의 수율(Yield Rate)은 <strong style={{ color:'var(--text)' }}>투입량 대비 실제 생산량의 비율</strong>입니다.
          수율이 잘못 등록되면 원가가 실제보다 낮게 계산되고, "이익이 나는 제품"으로 판단되어 가격을 낮추는 의사결정으로 이어집니다.
          실제로는 팔수록 적자인 상황입니다.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'start' }}>
        {/* BOM Table */}
        <div>
          <p className="caption" style={{ marginBottom:12 }}>픽션 BOM — 라면 A (팩당 투입 기준)</p>
          <div className="glass-card-lg" style={{ overflow:'hidden', padding:0 }}>
            <table className="e-table">
              <thead>
                <tr>
                  <th>자재명</th><th>분류</th><th>수율</th><th style={{ textAlign:'right' }}>단가</th>
                </tr>
              </thead>
              <tbody>
                {BOM_ITEMS.map((b) => {
                  const sel = selectedCode === b.code;
                  return (
                    <tr key={b.code} onClick={() => { setSelectedCode(b.code); setYieldPct(Math.round(b.yieldRate * 100)); }}
                      style={{ cursor:'pointer', background: sel ? 'rgba(201,168,76,0.08)' : undefined, transition:'background 0.12s' }}>
                      <td style={{ fontWeight: sel ? 700 : 400, color: sel ? '#C9A84C' : undefined }}>{b.name}</td>
                      <td>
                        <span className="badge" style={{ fontSize:'0.7rem', color: b.category==='원재료'?'#F59E0B':b.category==='부재료'?'#2DD4BF':'#A78BFA', borderColor:'transparent', background: b.category==='원재료'?'rgba(245,158,11,0.12)':b.category==='부재료'?'rgba(45,212,191,0.12)':'rgba(167,139,250,0.12)', letterSpacing:'0.02em', textTransform:'none' }}>
                          {b.category}
                        </span>
                      </td>
                      <td style={{ fontVariantNumeric:'tabular-nums', fontWeight: sel ? 700 : 400, color: sel ? '#C9A84C' : undefined }}>{(b.yieldRate*100).toFixed(1)}%</td>
                      <td style={{ textAlign:'right', fontVariantNumeric:'tabular-nums', color:'var(--text3)' }}>{b.unitPrice.toLocaleString()}원/{b.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Educational note */}
          <div style={{ marginTop:12, padding:'12px 16px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:10 }}>
            <p style={{ fontSize:'0.8125rem', color:'#F59E0B', fontWeight:600, marginBottom:4 }}>💡 수율 계산 공식</p>
            <p style={{ fontSize:'0.875rem', color:'var(--text2)', fontFamily:'monospace', lineHeight:1.6 }}>
              팩당 원가 = (투입량 ÷ 수율) × 단가<br />
              예) 밀가루: (0.085kg ÷ 0.92) × 620원 = <span style={{ color:'var(--text)' }}>57.3원</span>
            </p>
          </div>
        </div>

        {/* Simulator */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="glass-card-lg" style={{ padding:28 }}>
            <p className="caption" style={{ color:'rgba(201,168,76,0.6)', marginBottom:8 }}>수율 조정 시뮬레이터</p>
            <p style={{ fontWeight:700, fontSize:'1.125rem', color:'var(--text)', marginBottom:20 }}>{item.name}</p>
            <p style={{ fontSize:'0.8125rem', color:'var(--text2)', marginBottom:12 }}>
              기준 수율: <strong style={{ color:'var(--text)' }}>{normalYieldPct}%</strong>
              {item.note && <span style={{ marginLeft:8, color:'var(--text3)' }}>({item.note})</span>}
            </p>

            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:16 }}>
              <span className="impact-number" style={{ color: isError ? '#F87171' : '#2DD4BF' }}>{yieldPct}%</span>
              <span style={{ fontSize:'1rem', color:'var(--text2)', fontWeight:600 }}>수율</span>
              {isError && <span className="badge" style={{ color:'#F87171', borderColor:'rgba(248,113,113,0.4)', background:'rgba(248,113,113,0.12)', fontSize:'0.75rem' }}>⚠ 오류</span>}
            </div>
            <input type="range" min={60} max={100} value={yieldPct} onChange={(e) => setYieldPct(Number(e.target.value))}
              style={{ width:'100%', accentColor: isError ? '#F87171' : '#2DD4BF', marginBottom:8, height:6 }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text3)', fontWeight:600 }}>
              <span>60%</span><span style={{ color:'#2DD4BF' }}>기준 {normalYieldPct}%</span><span>100%</span>
            </div>
          </div>

          {result && (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div className="stat-card">
                  <p className="stat-label">기준 원가 / 팩</p>
                  <p className="stat-value" style={{ color:'#2DD4BF', fontSize:'1.625rem' }}>{result.normalCostPer.toLocaleString()}원</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">시뮬 원가 / 팩</p>
                  <p className="stat-value" style={{ color: isError ? '#F87171' : '#2DD4BF', fontSize:'1.625rem' }}>{result.simCostPer.toLocaleString()}원</p>
                </div>
              </div>

              <div className="glass-card" style={{ padding:20, borderLeft:`3px solid ${isError ? '#F87171' : '#2DD4BF'}` }}>
                <p style={{ fontWeight:700, fontSize:'0.9375rem', color: isError ? '#F87171' : '#2DD4BF', marginBottom:14 }}>
                  {isError ? '⚠ 원가 영향 분석' : '✓ 정상 범위'}
                </p>
                {[
                  { label:'팩당 원가 증가', val:`${result.diffPer >= 0 ? '+' : ''}${result.diffPer.toLocaleString()}원` },
                  { label:'월 영향 (100만팩)', val:`${result.diffMonthly >= 0 ? '+' : ''}${(result.diffMonthly/1e6).toFixed(1)}백만원` },
                  { label:'연간 영향', val:`${result.diffAnnual >= 0 ? '+' : ''}${(result.diffAnnual/1e8).toFixed(2)}억원`, large:true },
                ].map(({ label, val, large }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: large ? '1rem' : '0.875rem', color:'var(--text2)', fontWeight: large ? 700 : 400 }}>{label}</span>
                    <span style={{ fontVariantNumeric:'tabular-nums', fontWeight: large ? 900 : 700, fontSize: large ? '1.375rem' : '1rem', color: isError ? '#F87171' : '#2DD4BF' }}>{val}</span>
                  </div>
                ))}
                {isError && (
                  <div style={{ marginTop:14, padding:'12px 14px', background:'rgba(248,113,113,0.08)', borderRadius:8 }}>
                    <p style={{ fontSize:'0.875rem', color:'#F87171', fontWeight:600, lineHeight:1.65 }}>
                      원가가 실제보다 낮게 보임 → "이 제품 남는다" 오판 → 판가 인하 결정<br />
                      → <strong>실제로는 팔수록 적자인 역마진 상태</strong>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 학습 포인트 */}
      <div className="glass-card" style={{ padding:'20px 24px' }}>
        <p className="caption" style={{ color:'rgba(201,168,76,0.6)', marginBottom:12 }}>핵심 학습 포인트</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }}>
          {[
            { num:'01', text:'BOM 수율은 생산팀 혼자의 문제가 아닙니다. 잘못된 수율은 원가, 판가, 영업이익 모두에 영향을 줍니다.', color:'#F87171' },
            { num:'02', text:'수율 오류는 즉시 드러나지 않습니다. 몇 달이 지나서야 "왜 이익이 안 나지?"라는 의문으로 나타납니다.', color:'#F59E0B' },
            { num:'03', text:'수율은 정기적으로 실사(Actual)와 비교 검증되어야 합니다. 기준정보는 살아있는 데이터입니다.', color:'#2DD4BF' },
          ].map((p) => (
            <div key={p.num} style={{ padding:'14px 16px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontFamily:'monospace', fontWeight:900, fontSize:'1rem', color:p.color, display:'block', marginBottom:6 }}>{p.num}</span>
              <p style={{ fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.65 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   시나리오 B: 판가 단위 오류
   ───────────────────────────────────────────── */
function PriceSimulator() {
  const [useWrong, setUseWrong] = useState(false);
  const correct = simulatePriceUnit(false);
  const current = simulatePriceUnit(useWrong);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="glass-card" style={{ padding:'20px 24px', borderLeft:'3px solid #F59E0B' }}>
        <p style={{ fontWeight:800, fontSize:'1.0625rem', color:'#F59E0B', marginBottom:4 }}>시나리오 B — 판가 단위 오류 → 매출 집계 왜곡 → 결산 마비</p>
        <p style={{ color:'var(--text2)', fontSize:'0.9375rem', lineHeight:1.7 }}>
          시스템에 판가를 등록할 때 <strong style={{ color:'var(--text)' }}>1박스의 수량 단위</strong>를 잘못 입력하면,
          전체 매출 집계가 실제와 완전히 다른 숫자를 보여줍니다.
          "이번 달 매출이 왜 10배야?"라는 질문이 월말에 나오는 상황을 만듭니다.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'start' }}>
        {/* 개념 설명 */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="glass-card-lg" style={{ padding:28 }}>
            <p className="caption" style={{ color:'rgba(245,158,11,0.7)', marginBottom:16 }}>단위 환산 구조</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
              {[
                { label:'팩 단가', val:'850원 / 팩', note:'소비자가 기준' },
                { label:'× 박스당 팩 수', val:'20팩 (정상)', note:'기준정보 등록값' },
                { label:'= 박스당 매출', val:'17,000원', note:'시스템 자동계산' },
                { label:'× 월 판매량', val:'50,000박스', note:'실적 데이터' },
                { label:'= 월 매출', val:'8.5억원', note:'집계 결과', highlight:true },
              ].map((row) => (
                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background: row.highlight ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)', borderRadius:8, border: row.highlight ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize:'0.875rem', color: row.highlight ? '#C9A84C' : 'var(--text2)', fontWeight: row.highlight ? 700 : 400 }}>{row.label}</span>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ fontVariantNumeric:'tabular-nums', fontWeight: row.highlight ? 900 : 700, fontSize: row.highlight ? '1.125rem' : '0.9375rem', color: row.highlight ? '#C9A84C' : 'var(--text)' }}>{row.val}</span>
                    <span style={{ fontSize:'0.75rem', color:'var(--text3)', marginLeft:8 }}>{row.note}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:10 }}>
              {[
                { label:'✓ 정상: 1박스 = 20팩', wrong:false },
                { label:'✗ 오류: 1박스 = 2팩', wrong:true },
              ].map(opt => (
                <button key={String(opt.wrong)} onClick={() => setUseWrong(opt.wrong)} style={{
                  flex:1, padding:'12px 16px', borderRadius:10, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', border:'none',
                  background: useWrong===opt.wrong ? (opt.wrong ? 'rgba(248,113,113,0.15)' : 'rgba(45,212,191,0.15)') : 'rgba(255,255,255,0.04)',
                  color: useWrong===opt.wrong ? (opt.wrong ? '#F87171' : '#2DD4BF') : 'var(--text2)',
                  outline: useWrong===opt.wrong ? `1px solid ${opt.wrong ? 'rgba(248,113,113,0.4)' : 'rgba(45,212,191,0.4)'}` : '1px solid rgba(255,255,255,0.06)',
                  transition:'all 0.15s',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {useWrong && (
            <div className="glass-card" style={{ padding:20, borderLeft:'3px solid #F87171' }}>
              <p style={{ fontWeight:700, color:'#F87171', marginBottom:10, fontSize:'0.9375rem' }}>오류 발생 시 상황 전개</p>
              <ol style={{ paddingLeft:18, display:'flex', flexDirection:'column', gap:6 }}>
                {[
                  '단위 오류로 집계된 매출이 보고서에 반영됨',
                  '경영진: "이번 달 매출이 왜 10배야?" → 원인 규명 수일 소요',
                  '회계팀 결산 지연 → 외부 보고 일정 차질',
                  '정정 보고서 재작성 → 신뢰도 하락',
                  '재발 방지 TF 구성 → 전사 업무 부하 증가',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.6 }}>{item}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* 수치 비교 */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div className="glass-card-lg" style={{ padding:28 }}>
            <p className="caption" style={{ color:'rgba(45,212,191,0.7)', marginBottom:16 }}>정상 매출</p>
            {[
              { label:'박스당 매출', val:correct.revenuePerBox.toLocaleString() + '원' },
              { label:'월 매출 (5만박스)', val:(correct.monthlyRevenue/1e8).toFixed(2) + '억원' },
              { label:'연간 매출', val:(correct.annualRevenue/1e8).toFixed(1) + '억원', large:true },
            ].map(({ label, val, large }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize:'0.875rem', color:'var(--text2)' }}>{label}</span>
                <span style={{ fontVariantNumeric:'tabular-nums', fontWeight: large ? 900 : 700, fontSize: large ? '1.5rem' : '1rem', color:'#2DD4BF' }}>{val}</span>
              </div>
            ))}
          </div>

          <div className="glass-card-lg" style={{ padding:28, borderColor: useWrong ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.1)' }}>
            <p className="caption" style={{ color: useWrong ? 'rgba(248,113,113,0.8)' : 'rgba(45,212,191,0.7)', marginBottom:16 }}>
              {useWrong ? '⚠ 오류 발생 매출 (집계 왜곡)' : '정상 매출 (동일)'}
            </p>
            {[
              { label:'박스당 매출', val:current.revenuePerBox.toLocaleString() + '원' },
              { label:'월 매출 (집계)', val:(current.monthlyRevenue/1e8).toFixed(2) + '억원' },
              { label:'연간 매출 (집계)', val:(current.annualRevenue/1e8).toFixed(1) + '억원', large:true },
            ].map(({ label, val, large }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize:'0.875rem', color:'var(--text2)' }}>{label}</span>
                <span style={{ fontVariantNumeric:'tabular-nums', fontWeight: large ? 900 : 700, fontSize: large ? '1.5rem' : '1rem', color: useWrong ? '#F87171' : '#2DD4BF' }}>{val}</span>
              </div>
            ))}
            {useWrong && (
              <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(248,113,113,0.08)', borderRadius:8 }}>
                <p style={{ fontSize:'0.8125rem', fontWeight:700, color:'#F87171' }}>
                  실제 매출 {(correct.annualRevenue/1e8).toFixed(1)}억원 대비<br />
                  집계 오류 {(Math.abs(current.annualRevenue - correct.annualRevenue)/1e8).toFixed(1)}억원 차이 발생
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   시나리오 C: 제품 코드 규칙
   ───────────────────────────────────────────── */
function CodeSimulator() {
  const [selected, setSelected] = useState(0);
  const example = CODE_RULE.examples[selected];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div className="glass-card" style={{ padding:'20px 24px', borderLeft:'3px solid #4F8EF7' }}>
        <p style={{ fontWeight:800, fontSize:'1.0625rem', color:'#4F8EF7', marginBottom:4 }}>시나리오 C — 코드 규칙 미준수 → 데이터 파편화 → 의사결정 불가</p>
        <p style={{ color:'var(--text2)', fontSize:'0.9375rem', lineHeight:1.7 }}>
          제품 코드는 <strong style={{ color:'var(--text)' }}>시스템이 제품을 인식하는 유일한 식별자</strong>입니다.
          규칙을 무시하고 임의 코드를 생성하면 동일 제품이 시스템 내에 여러 개로 존재하게 됩니다.
          그 결과, 채널별 실적을 집계할 수 없고 마케팅 캠페인 효과를 수치로 증명할 수 없습니다.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'start' }}>
        {/* 코드 규칙 */}
        <div>
          <div className="glass-card-lg" style={{ padding:28 }}>
            <p className="caption" style={{ color:'rgba(79,142,247,0.7)', marginBottom:16 }}>하림산업 제품 코드 체계</p>
            <div style={{ background:'rgba(79,142,247,0.08)', border:'1px solid rgba(79,142,247,0.2)', borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
              <p style={{ fontFamily:'monospace', fontSize:'1.125rem', fontWeight:800, color:'#4F8EF7', letterSpacing:'0.05em' }}>{CODE_RULE.pattern}</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
              {CODE_RULE.segments.map((seg) => (
                <div key={seg.label} style={{ display:'flex', gap:12, padding:'10px 12px', background:'rgba(255,255,255,0.03)', borderRadius:8 }}>
                  <span style={{ fontFamily:'monospace', fontWeight:800, color:'#4F8EF7', fontSize:'0.9375rem', minWidth:80 }}>{seg.label}</span>
                  <span style={{ fontSize:'0.875rem', color:'var(--text2)' }}>{seg.example}</span>
                </div>
              ))}
            </div>
            <div style={{ padding:'12px 14px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8 }}>
              <p style={{ fontSize:'0.8125rem', fontWeight:700, color:'#C9A84C', marginBottom:4 }}>💡 코드 체계가 중요한 이유</p>
              <p style={{ fontSize:'0.8125rem', color:'var(--text2)', lineHeight:1.65 }}>
                채널(RT/OT/FS)이 코드에 포함되어야 소매·온라인·급식 각각의 판매량을 시스템이 자동으로 분리 집계할 수 있습니다.
                코드가 없으면 사람이 수동으로 분류해야 합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 코드 예시 */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <p className="caption" style={{ color:'var(--text3)' }}>코드 예시 — 클릭해서 비교</p>
          {CODE_RULE.examples.map((ex, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%',
              padding:'14px 18px', borderRadius:12, cursor:'pointer', border:'none', textAlign:'left',
              background: selected===i ? (ex.isCorrect ? 'rgba(45,212,191,0.08)' : 'rgba(248,113,113,0.08)') : 'rgba(255,255,255,0.03)',
              outline: `1px solid ${selected===i ? (ex.isCorrect ? 'rgba(45,212,191,0.35)' : 'rgba(248,113,113,0.35)') : 'rgba(255,255,255,0.06)'}`,
              transition:'all 0.12s',
            }}>
              <div>
                <span style={{ fontFamily:'monospace', fontWeight:900, fontSize:'1.125rem', color: ex.isCorrect ? '#2DD4BF' : '#F87171' }}>{ex.code}</span>
                <p style={{ fontSize:'0.8125rem', color:'var(--text2)', marginTop:3 }}>{ex.description}</p>
              </div>
              <span className="badge" style={{ fontSize:'0.7rem', flexShrink:0, color: ex.isCorrect ? '#2DD4BF' : '#F87171', borderColor: ex.isCorrect ? 'rgba(45,212,191,0.35)' : 'rgba(248,113,113,0.35)', background: ex.isCorrect ? 'rgba(45,212,191,0.1)' : 'rgba(248,113,113,0.1)' }}>
                {ex.isCorrect ? '✓ 정상' : '✗ 오류'}
              </span>
            </button>
          ))}

          {/* Detail */}
          {!example.isCorrect && example.problem ? (
            <div className="glass-card" style={{ padding:20, borderLeft:'3px solid #F87171' }}>
              <p style={{ fontWeight:700, color:'#F87171', marginBottom:8, fontSize:'0.9375rem' }}>발생하는 문제</p>
              <p style={{ fontSize:'0.9375rem', color:'var(--text2)', marginBottom:8, lineHeight:1.65 }}>{example.problem}</p>
              <p style={{ fontSize:'0.875rem', color:'rgba(248,113,113,0.7)', fontWeight:600 }}>
                → 캠페인 효과 측정 불가 → 다음 예산 배분 근거 없음 → 감으로 의사결정
              </p>
            </div>
          ) : example.isCorrect ? (
            <div className="glass-card" style={{ padding:20, borderLeft:'3px solid #2DD4BF' }}>
              <p style={{ fontWeight:700, color:'#2DD4BF', fontSize:'0.9375rem' }}>
                ✓ 올바른 코드 — 채널별 실적 자동 분리 집계 가능, 캠페인 효과 수치 측정 가능
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
