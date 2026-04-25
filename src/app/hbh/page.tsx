'use client';

import { Suspense, useEffect, useState } from 'react';
import SessionGate from '@/components/v2/SessionGate';

const OPTIONS = [
  { key: 'site_first', emoji: '🔍', label: '현장경영', desc: '현장의 사실로 말한다' },
  { key: 'daily_mgmt', emoji: '📅', label: '일일관리', desc: '매일 정산하고 매일 결정한다' },
  { key: 'tools_means', emoji: '🎯', label: '수단과 목적의 분리', desc: '도구가 아니라 목적을 본다' },
  { key: 'system_org', emoji: '🤝', label: '시스템으로 일하는 조직', desc: '시스템의 약속을 따른다' },
];

function Inner() {
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [choice, setChoice] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sysinno_participant');
    if (saved) {
      try { setParticipantId(JSON.parse(saved).id); } catch { /* ignore */ }
    }
  }, []);

  async function submit() {
    if (!participantId || !choice) return;
    setSubmitting(true);
    try {
      await fetch('/api/hbh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_id: participantId, hardest_habit: choice }),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!participantId) {
    return (
      <Wrap>
        <p style={{ color: 'var(--text2)', textAlign: 'center', lineHeight: 1.7 }}>
          먼저 <strong style={{ color: 'var(--gold)' }}>참여 등록</strong>을 해주세요. (Prologue QR)
        </p>
      </Wrap>
    );
  }

  if (submitted) {
    return (
      <Wrap>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✨</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
            응답 완료
          </h2>
          <p style={{ color: 'var(--text2)', lineHeight: 1.6 }}>
            강연 화면에서 결과를 확인해 보세요.
          </p>
          <button onClick={() => { setSubmitted(false); setChoice(''); }} style={{
            marginTop: 16, padding: '10px 18px', borderRadius: 10,
            background: 'var(--glass)', color: 'var(--text2)',
            border: 'none', fontWeight: 600, cursor: 'pointer',
          }}>
            다시 응답하기
          </button>
        </div>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <p className="caption" style={{ color: 'var(--gold)', marginBottom: 8 }}>Part 2 · 응답</p>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20, lineHeight: 1.4 }}>
        4가지 습관 중,<br />가장 어려워 보이는 것은?
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => setChoice(o.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', borderRadius: 14,
              background: choice === o.key ? 'rgba(201,168,76,0.15)' : 'var(--glass)',
              border: choice === o.key ? '1px solid var(--gold)' : '1px solid transparent',
              color: 'var(--text)', fontWeight: 600, fontSize: '0.9375rem',
              textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{o.emoji}</span>
            <div>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>{o.label}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 500 }}>{o.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={submitting || !choice}
        className="btn btn-gold"
        style={{ width: '100%', opacity: !choice ? 0.4 : 1 }}
      >
        {submitting ? '전송 중…' : '응답 보내기'}
      </button>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 420, padding: '32px 28px' }}>
        {children}
      </div>
    </div>
  );
}

export default function HbhPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <SessionGate>{() => <Inner />}</SessionGate>
    </Suspense>
  );
}
