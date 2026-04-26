'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import PlantCard from '@/components/v2/PlantCard';
import SurveyQR from '@/components/v2/SurveyQR';

type Section = 'plants' | 'chain' | 'data' | 'survey';

interface PerceptionData {
  counts: { perception_choice: string; count: number }[];
  customs: { custom_text: string; name: string; department: string }[];
}

const PERCEPTION_OPTIONS = [
  { key: 'big_company', emoji: '🏭', label: '생각보다 훨씬 큰 회사' },
  { key: 'real_food', emoji: '🍚', label: '진짜 식품을 만드는 회사' },
  { key: 'data_driven', emoji: '📊', label: '데이터로 일하는 회사' },
  { key: 'collaborative', emoji: '🤝', label: '부서 협업이 중요한 회사' },
];

// 가치사슬 릴레이: 한 데이터가 어떻게 흐르는가
const RELAY_STAGES = [
  { dept: '마케팅', emoji: '📣', action: '신제품 컨셉을 정의하고', hands: 'BOM 초안과 목표 단가를' },
  { dept: '영업', emoji: '🤝', action: '거래처 수주를 받아', hands: '주차별 발주 수량을' },
  { dept: '구매', emoji: '🛒', action: '자재 발주를 걸고', hands: '입고 예정일과 단가를' },
  { dept: '생산', emoji: '🏭', action: '라인을 돌리고', hands: '실제 투입량과 수율을' },
  { dept: '품질', emoji: '🧪', action: '검사를 통과시키고', hands: '합격률과 클레임 데이터를' },
  { dept: '물류', emoji: '🚚', action: '트럭에 싣고', hands: '출고 시간과 차량 번호를' },
  { dept: '재무', emoji: '💰', action: '결산하며 결승선을 통과합니다', hands: '매출과 원가를' },
];

export default function Part1Client() {
  const [section, setSection] = useState<Section>('plants');
  const [perception, setPerception] = useState<PerceptionData>({ counts: [], customs: [] });

  useEffect(() => {
    if (section !== 'survey') return;
    const load = () => fetch('/api/perception').then((r) => r.json()).then(setPerception);
    load();
    const t = setInterval(load, 2500);
    return () => clearInterval(t);
  }, [section]);

  const totalVotes = perception.counts.reduce((s, c) => s + c.count, 0);

  return (
    <div style={{ minHeight: '100vh' }}>
      <NavBar current="Part 1" step="01/04" />

      <div className="anim-up" style={{ padding: '24px 0 80px' }}>

        {/* 섹션 탭 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <SectionTab active={section === 'plants'} onClick={() => setSection('plants')} label="① 3개의 공장" />
          <SectionTab active={section === 'chain'} onClick={() => setSection('chain')} label="② 데이터의 릴레이" />
          <SectionTab active={section === 'data'} onClick={() => setSection('data')} label="③ 한 칸의 무게" />
          <SectionTab active={section === 'survey'} onClick={() => setSection('survey')} label="④ 어떤 회사로 느껴지나요" />
        </div>

        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>Part 1 · 20분</p>
          <h1 className="display text-gold" style={{ marginBottom: 12 }}>
            우리 회사는 무엇을 만드는가
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text2)', lineHeight: 1.7, maxWidth: 820 }}>
            하림산업은 매일, 한국인의 식탁에 오를 식품을 만듭니다.<br />
            <strong style={{ color: 'var(--text)' }}>세 개의 공장</strong>에서 시작해, <strong style={{ color: 'var(--text)' }}>한 끼의 음식</strong>으로 끝나는 길.<br />
            그 길 위를 함께 달리는 것이 — <strong style={{ color: 'var(--text)' }}>데이터의 릴레이</strong>입니다.
          </p>
        </div>

        {/* 섹션 1: 공장 (5분) */}
        {section === 'plants' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>5분 · 우리가 매일 만들어내는 양</p>

            <div
              className="glass-card"
              style={{
                padding: 28,
                marginBottom: 24,
                background: 'rgba(201,168,76,0.05)',
                borderLeft: '3px solid var(--gold)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                <span style={{
                  fontFamily: 'monospace', fontWeight: 900, fontSize: '2.5rem',
                  color: 'var(--gold)', lineHeight: 1, flexShrink: 0,
                }}>
                  K
                </span>
                <div style={{ flex: 1 }}>
                  <p className="caption" style={{ color: 'var(--gold)', marginBottom: 8 }}>
                    WHY K · 공장이 아닌 키친
                  </p>
                  <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.8, wordBreak: 'keep-all' }}>
                    P(Plant)가 아니라 <strong style={{ color: 'var(--gold)' }}>K(Kitchen)</strong>의 약자입니다.<br />
                    하림산업의 K1·K2·K3는 단순 제조 공장이 아니라 — <strong style={{ color: 'var(--text)' }}>소비자의 식탁을 위한 공유주방</strong>입니다.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
              <PlantCard
                code="K1"
                name="냉동 · 국탕 · HMR 공장"
                products="냉동만두, 즉석국, 냉동 가정식"
                productCount="(작성자 입력 예정)"
                lines="(작성자 입력 예정)"
                capacity="(작성자 입력 예정)"
                metaphor="(작성자 확정 예정)"
                accent="#A78BFA"
              />
              <PlantCard
                code="K2"
                name="즉석밥 공장"
                products="더미식 즉석밥 등 즉석밥 제품군"
                productCount="(작성자 입력 예정)"
                lines="(작성자 입력 예정)"
                capacity="(작성자 입력 예정)"
                metaphor="OO만 명이 한 끼 식사를 해결할 수 있는 양"
                accent="#2DD4BF"
              />
              <PlantCard
                code="K3"
                name="라면 · FD 공장"
                products="장인라면, FD(Freeze Dry), 분말 스프류"
                productCount="(작성자 입력 예정)"
                lines="(작성자 입력 예정)"
                capacity="(작성자 입력 예정)"
                metaphor="광역시 한 도시의 시민이 하루 한 끼 라면을 먹을 수 있는 양"
                accent="#F59E0B"
              />
            </div>

            {/* 거래처 카드 */}
            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>🛒</span>
                <div style={{ flex: 1 }}>
                  <p className="caption" style={{ color: 'var(--gold)', marginBottom: 6 }}>어디로 흘러가는가</p>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
                    거래처 · 납품처
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', marginBottom: 12, lineHeight: 1.7 }}>
                    대형마트 · 편의점 · 온라인 커머스 · B2B (작성자 추후 입력)
                  </p>
                  <p style={{
                    fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text)',
                    fontStyle: 'italic', lineHeight: 1.7,
                    borderLeft: '2px solid var(--gold)', paddingLeft: 14,
                  }}>
                    &ldquo;우리가 만든 식품은 OO곳을 거쳐 매일 한국인의 식탁에 오릅니다&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* 규모감 한 줄 요약 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
              <ScaleStat n="3" unit="개 공장" caption="K1 · K2 · K3 — Kitchen" accent="#F59E0B" />
              <ScaleStat n="?" unit="식 / 일" caption="(작성자 입력 예정)" accent="#2DD4BF" />
              <ScaleStat n="365" unit="일 멈춤 없이" caption="식탁은 하루도 쉬지 않습니다" accent="#A78BFA" />
              <ScaleStat n="?" unit="명의 약속" caption="오늘 등록된 참여자만큼" accent="#C9A84C" />
            </div>

            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <button onClick={() => setSection('chain')} className="btn btn-gold">
                다음 → 데이터는 이렇게 흘러갑니다
              </button>
            </div>
          </>
        )}

        {/* 섹션 2: 가치사슬 릴레이 (7분) */}
        {section === 'chain' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>7분 · 부서는 다르지만, 데이터는 하나의 흐름</p>

            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16, lineHeight: 1.4 }}>
              우리는 매일, <span style={{ color: 'var(--gold)' }}>가치 사슬의 릴레이</span>를 뛰고 있습니다.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: 28, maxWidth: 820 }}>
              내 업무의 결과는 다음 사람의 시작점입니다.
              한 명이 손에서 놓친 데이터 한 칸은 — 다음 주자에게는 거짓말이 됩니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {RELAY_STAGES.map((s, i) => (
                <div key={s.dept} className="glass-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span style={{
                    fontFamily: 'monospace', fontWeight: 900, fontSize: '1.5rem',
                    color: 'var(--gold)', minWidth: 40,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '2rem', flexShrink: 0 }}>{s.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                      <span style={{ color: 'var(--gold)' }}>{s.dept}</span>이 {s.action},
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>{s.hands}</strong> 다음 주자에게 넘깁니다.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{
              padding: 32, background: 'rgba(248,113,113,0.06)',
              borderLeft: '3px solid #F87171',
            }}>
              <p className="caption" style={{ color: '#F87171', marginBottom: 10 }}>그래서 — 멈추는 순간은</p>
              <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.85, fontWeight: 500, wordBreak: 'keep-all' }}>
                7명 중 한 명이 한 줄을 잘못 넘기면, 뒤따르는 6명은 <strong style={{ color: '#F87171' }}>모두 거짓말로 일합니다.</strong><br />
                그리고 그 거짓말이 어디서 시작됐는지 — 결산 시점에는 아무도 모릅니다.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <button onClick={() => setSection('data')} className="btn btn-gold">
                다음 → 한 칸의 무게
              </button>
            </div>
          </>
        )}

        {/* 섹션 3: 데이터 한 칸 (5분) */}
        {section === 'data' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>7분 · 실제 사례, 그리고 우리가 매일 마주칠 위험</p>

            <div className="glass-card" style={{ padding: 36, marginBottom: 24 }}>
              <p className="caption" style={{ color: 'var(--red)', marginBottom: 16 }}>실제 사례 · 단 하나의 오타가</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20, lineHeight: 1.4 }}>
                6,000만원 수출 사고
              </h2>
              <p style={{ fontSize: '1.0625rem', color: 'var(--text2)', lineHeight: 1.85, wordBreak: 'keep-all', marginBottom: 16 }}>
                BOM 한 줄에서 단가 단위가 잘못 기입됐습니다.
                결재는 정상적으로 흘러갔고, 시스템은 멈추지 않았습니다.
                선적이 끝난 뒤에야 차이를 발견했고, 그 시점엔 이미 <strong style={{ color: '#F87171' }}>6,000만원을 회수할 방법이 없었습니다.</strong>
              </p>
              <div style={{
                background: 'rgba(248,113,113,0.08)', borderRadius: 10,
                padding: '14px 18px', fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.7,
              }}>
                <strong style={{ color: '#F87171' }}>핵심:</strong> 시스템은 &ldquo;0&rdquo; 하나의 진위를 검증하지 않습니다.
                그것을 검증하는 건 <strong style={{ color: 'var(--text)' }}>입력하는 사람의 습관</strong>뿐입니다.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 }}>
              <ErrorCard
                title="단위 오류"
                desc='"개" 단위와 "박스" 단위를 혼동해 입력 → 출고 수량 12배 차이'
                color="#F87171"
              />
              <ErrorCard
                title="환산 오류"
                desc="원/kg과 원/g을 잘못 매핑 → 단가 1,000배 왜곡, 손익 보고서가 거꾸로 찍힘"
                color="#F59E0B"
              />
              <ErrorCard
                title="기준정보 누락"
                desc="신제품 BOM에 부자재 1종이 빠짐 → 6개월간 원가가 과소 계상, 흑자처럼 보였던 SKU가 사실 적자"
                color="#A78BFA"
              />
              <ErrorCard
                title="시점 불일치"
                desc="발주 입력일과 입고 실제일을 같은 날로 처리 → 재고가 실제와 1주 어긋남, 결품 발생"
                color="#2DD4BF"
              />
            </div>

            {/* v2 캐치프레이즈 */}
            <div className="glass-card" style={{ padding: 40, marginBottom: 24, background: 'rgba(201,168,76,0.06)' }}>
              <p style={{
                fontSize: '1.375rem', color: 'var(--text)', lineHeight: 1.85,
                fontWeight: 500, fontStyle: 'italic', wordBreak: 'keep-all', textAlign: 'center',
              }}>
                여러분이 어젯밤 끓여 드셨던 라면 한 봉지 —<br />
                그 뒤에는 누군가 정확하게 입력한 <span style={{ color: 'var(--gold)', fontWeight: 800 }}>데이터 한 칸</span>이 있었습니다.<br />
                <span style={{ fontWeight: 700, color: 'var(--gold)', fontStyle: 'normal' }}>
                  오늘부터, 그 한 칸을 지키는 사람이 여러분입니다.
                </span>
              </p>
            </div>

            <div
              className="glass-card"
              style={{
                padding: 32,
                marginBottom: 24,
                background: 'rgba(201,168,76,0.05)',
                borderLeft: '3px solid var(--gold)',
              }}
            >
              <p className="caption" style={{ color: 'var(--gold)', marginBottom: 14 }}>
                PHILOSOPHY 01 · 문제 정의 = 에너지의 90%
              </p>
              <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.85, wordBreak: 'keep-all', marginBottom: 16 }}>
                6,000만원의 사고는 결과의 오류처럼 보이지만,<br />
                실은 누구도 <strong style={{ color: 'var(--gold)' }}>&ldquo;왜 그 칸이 비었는가&rdquo;</strong>를 정의하지 않은 결과입니다.
              </p>
              <div
                style={{
                  background: 'rgba(201,168,76,0.08)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  fontSize: '0.9375rem',
                  color: 'var(--text)',
                  lineHeight: 1.75,
                  marginBottom: 14,
                }}
              >
                문제 해결에 들어가는 에너지의 <strong style={{ color: 'var(--gold)' }}>90%는 정확한 문제 정의</strong>에 있습니다.<br />
                나머지 10%가 — 어떤 도구로 풀 것인가의 선택입니다.
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, fontStyle: 'italic', wordBreak: 'keep-all' }}>
                → 시스템·AI·ERP는 모두 &ldquo;도구&rdquo;의 영역입니다. 그 앞에는 항상 <strong style={{ color: 'var(--text)', fontStyle: 'normal' }}>문제 정의</strong>가 먼저입니다.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <button onClick={() => setSection('survey')} className="btn btn-gold">
                다음 → 청중에게 묻습니다
              </button>
            </div>
          </>
        )}

        {/* 섹션 4: 회사 인상 + QR (3분) */}
        {section === 'survey' && (
          <>
            <p className="caption" style={{ marginBottom: 12 }}>3분 · 휴대폰을 꺼내주세요</p>

            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 32 }}>
              <div style={{ flex: '1 1 480px', minWidth: 320 }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
                  오늘 본 하림산업,<br />
                  어떤 회사처럼 느껴지나요?
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>
                  오른쪽 QR을 스캔하면 응답 화면이 열립니다. 응답이 실시간으로 집계됩니다.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {PERCEPTION_OPTIONS.map((opt) => {
                    const c = perception.counts.find((c) => c.perception_choice === opt.key)?.count ?? 0;
                    const pct = totalVotes ? Math.round((c / totalVotes) * 100) : 0;
                    return (
                      <div key={opt.key} className="glass-card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                          position: 'absolute', inset: 0, width: `${pct}%`,
                          background: 'rgba(201,168,76,0.10)', transition: 'width 0.6s ease',
                        }} />
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{ fontSize: '1.75rem' }}>{opt.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)' }}>{opt.label}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>
                              {c}명 ({pct}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <SurveyQR
                path="/perception"
                label="Part 1 응답"
                hint="1분이면 됩니다"
              />
            </div>

            {perception.customs.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <p className="caption" style={{ marginBottom: 12 }}>자유 응답</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {perception.customs.slice(0, 8).map((c, i) => (
                    <div key={i} className="glass-card" style={{ padding: '14px 18px' }}>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: 6 }}>
                        &ldquo;{c.custom_text}&rdquo;
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600 }}>
                        — {c.department} {c.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text3)' }}>
                응답: <strong style={{ color: 'var(--gold)' }}>{totalVotes}</strong>건
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 18px', borderRadius: 999,
      background: active ? 'var(--gold)' : 'var(--glass)',
      color: active ? '#0B0E1A' : 'var(--text2)',
      border: 'none', fontWeight: 700, fontSize: '0.875rem',
      cursor: 'pointer', transition: 'all 0.2s',
    }}>
      {label}
    </button>
  );
}

function ErrorCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  return (
    <div className="glass-card" style={{ padding: 24, borderLeft: `3px solid ${color}` }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 800, color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
        {title}
      </p>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
        {desc}
      </p>
    </div>
  );
}

function ScaleStat({ n, unit, caption, accent }: { n: string; unit: string; caption: string; accent: string }) {
  return (
    <div className="glass-card" style={{ padding: '16px 18px', borderTop: `2px solid ${accent}` }}>
      <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.625rem', color: accent, lineHeight: 1, marginBottom: 4 }}>
        {n}
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text2)', fontWeight: 700, marginBottom: 6 }}>
        {unit}
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.5 }}>
        {caption}
      </p>
    </div>
  );
}
