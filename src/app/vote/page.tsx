'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const OPTIONS = [
  { key: 'A', label: '정상 가동', desc: '모든 기준정보 정상 → 손익 정확', bg: '#D0FFF5', accent: '#00C9A7', text: '#005A4D' },
  { key: 'B', label: '수율 저하 5%', desc: '면 수율 92% → 87% 오입력', bg: '#FFFACC', accent: '#D4A800', text: '#6B5000' },
  { key: 'C', label: '판가 단위 오류', desc: '1박스=20팩 → 2팩으로 잘못 입력', bg: '#FFE0E8', accent: '#FF3B6B', text: '#8B0030' },
];

function VoteContent() {
  const params = useSearchParams();
  const pid = params.get('pid');
  const [voted, setVoted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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
    } catch { setError('투표 실패. 다시 시도해 주세요.'); }
    finally { setLoading(false); }
  }

  const selectedOpt = OPTIONS.find((o) => o.key === voted);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="chip" style={{ color: 'var(--primary)', borderColor: 'var(--primary)', background: 'var(--primary-light)', marginBottom: 16 }}>
            Part 2 투표
          </div>
          <h2 className="headline" style={{ color: 'var(--text)' }}>어떤 시나리오?</h2>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', marginTop: 8 }}>손익 시뮬레이션 결과를 직접 골라보세요</p>
        </div>

        {voted && selectedOpt ? (
          <div style={{ background: selectedOpt.bg, border: `3px solid ${selectedOpt.accent}`, borderRadius: 24, padding: 28, textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', fontWeight: 900, color: selectedOpt.accent, marginBottom: 4 }}>{selectedOpt.key}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: selectedOpt.text, marginBottom: 4 }}>{selectedOpt.label}</p>
            <p style={{ fontSize: '1rem', color: selectedOpt.text, opacity: 0.75, marginBottom: 20 }}>{selectedOpt.desc}</p>
            <p style={{ fontSize: '1.0625rem', fontWeight: 700, color: selectedOpt.text }}>투표 완료! 강연자 화면을 주시해 주세요.</p>
            <button onClick={() => { setVoted(null); localStorage.removeItem('systema_vote_part2'); }}
              style={{ marginTop: 16, fontSize: '0.875rem', color: selectedOpt.accent, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>
              다시 투표
            </button>
          </div>
        ) : (
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
                  <p style={{ fontSize: '1.125rem', fontWeight: 800, color: opt.text, marginBottom: 2 }}>{opt.label}</p>
                  <p style={{ fontSize: '0.9375rem', color: opt.text, opacity: 0.75 }}>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

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
