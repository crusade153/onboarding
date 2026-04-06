'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 🚀 새롭게 믹싱된 4대 그림자 노동 시나리오 
const OPTIONS = [
  { key: 'A', label: '품질팀: 잊혀진 클릭', desc: '품질대기 해제 누락 → 추가 생산 및 시한부 악성재고 발생', bg: '#E0E7FF', accent: '#4F8EF7', text: '#1E3A8A' },
  { key: 'B', label: 'BM팀: 환산단위 착각', desc: '판매계획 오인 → 48만 식 초과생산 및 장기 적치', bg: '#FFE0E8', accent: '#FF3B6B', text: '#8B0030' },
  { key: 'C', label: '생산팀: 가짜 버퍼 조작', desc: '수율 임의 하향(85%) → 원부자재 초과 발주 및 재고 폭증', bg: '#FFFACC', accent: '#D4A800', text: '#6B5000' },
  { key: 'D', label: '자재팀: 발주 단위 오류', desc: '롤/천장 착각 → 라인 올스톱 및 지옥의 연장근무', bg: '#FFEDD5', accent: '#F97316', text: '#9A3412' },
];

function VoteContent() {
  const params = useSearchParams();
  const pid = params.get('pid');
  const [voted, setVoted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 이전에 투표한 내역이 있으면 불러오기
    const saved = localStorage.getItem('systema_vote_part2');
    if (saved) setVoted(saved);
  }, []);

  async function vote(key: string) {
    if (!pid) { setError('/join 에서 먼저 참여하세요.'); return; }
    setLoading(true);
    try {
      await fetch('/api/votes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_id: Number(pid), part: 'part2', option_key: key }),
      });
      setVoted(key);
      localStorage.setItem('systema_vote_part2', key);
    } catch { 
      setError('투표 실패. 다시 시도해 주세요.'); 
    } finally { 
      setLoading(false); 
    }
  }

  const selectedOpt = OPTIONS.find((o) => o.key === voted);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Header 영역 업데이트 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="chip" style={{ color: 'var(--primary)', borderColor: 'var(--primary)', background: 'var(--primary-light)', marginBottom: 16 }}>
            Part 2 투표
          </div>
          <h2 className="headline" style={{ color: 'var(--text)', wordBreak: 'keep-all' }}>어떤 나비효과?</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', marginTop: 8, wordBreak: 'keep-all', lineHeight: 1.4 }}>
            우리 조직을 그림자 노동에 빠뜨릴<br/>가장 뼈아픈 시나리오를 골라보세요
          </p>
        </div>

        {/* 투표 완료 상태 화면 */}
        {voted && selectedOpt ? (
          <div style={{ background: selectedOpt.bg, border: `3px solid ${selectedOpt.accent}`, borderRadius: 24, padding: 28, textAlign: 'center' }} className="pop-in">
            <p style={{ fontSize: '3rem', fontWeight: 900, color: selectedOpt.accent, marginBottom: 4 }}>{selectedOpt.key}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: selectedOpt.text, marginBottom: 4, wordBreak: 'keep-all' }}>{selectedOpt.label}</p>
            <p style={{ fontSize: '1rem', color: selectedOpt.text, opacity: 0.8, marginBottom: 20, wordBreak: 'keep-all', lineHeight: 1.4 }}>{selectedOpt.desc}</p>
            <p style={{ fontSize: '1.0625rem', fontWeight: 700, color: selectedOpt.text }}>투표 완료! 강연자 화면을 주시해 주세요.</p>
            <button onClick={() => { setVoted(null); localStorage.removeItem('systema_vote_part2'); }}
              style={{ marginTop: 16, fontSize: '0.875rem', color: selectedOpt.accent, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>
              다시 투표
            </button>
          </div>
        ) : (
          /* 투표 선택 화면 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {OPTIONS.map((opt) => (
              <button key={opt.key} onClick={() => vote(opt.key)} disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, width: '100%',
                  background: opt.bg, border: `2.5px solid ${opt.accent}`,
                  borderRadius: 20, padding: '20px 24px', cursor: 'pointer', textAlign: 'left',
                  opacity: loading ? 0.6 : 1, transition: 'transform 0.12s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: '2.25rem', fontWeight: 900, color: opt.accent, flexShrink: 0 }}>{opt.key}</span>
                <div>
                  <p style={{ fontSize: '1.125rem', fontWeight: 800, color: opt.text, marginBottom: 2, wordBreak: 'keep-all' }}>{opt.label}</p>
                  <p style={{ fontSize: '0.875rem', color: opt.text, opacity: 0.8, wordBreak: 'keep-all', lineHeight: 1.3 }}>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 에러 메시지 */}
        {error && <p style={{ color: 'var(--pink)', fontWeight: 600, textAlign: 'center', marginTop: 16 }}>{error}</p>}
      </div>
    </div>
  );
}

export default function VotePage() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', fontSize:'1.125rem' }}>로딩 중...</div>}>
      <VoteContent />
    </Suspense>
  );
}