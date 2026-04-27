'use client';

import { Suspense, useEffect, useState } from 'react';
import SessionGate from '@/components/v2/SessionGate';

const OPTIONS = [
  { key: 'data_habit',    emoji: '✍️', label: '데이터를 정확하게 입력하는 습관' },
  { key: 'problem_def',   emoji: '🔍', label: '문제가 생기기 전에 먼저 정의하는 것' },
  { key: 'communication', emoji: '🤝', label: '부서 간 명확한 변경 알림 체계' },
  { key: 'better_system', emoji: '🛠️', label: '더 좋은 ERP · 시스템 도입' },
];

function Inner() {
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [choice, setChoice] = useState<string>('');
  const [custom, setCustom] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sysinno_participant');
    if (saved) {
      try { setParticipantId(JSON.parse(saved).id); } catch { /* ignore */ }
    }
  }, []);

  async function submit() {
    if (!participantId || (!choice && !custom.trim())) return;
    setSubmitting(true);
    try {
      await fetch('/api/perception', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: participantId,
          perception_choice: choice || null,
          custom_text: custom.trim() || null,
        }),
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
          <button onClick={() => setSubmitted(false)} style={{
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
      <p className="caption" style={{ color: 'var(--gold)', marginBottom: 8 }}>Part 1 · 응답</p>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20, lineHeight: 1.4 }}>
        이 사고를 막으려면,<br /><span style={{ color: 'var(--gold)' }}>가장 먼저 필요한 것</span>은?
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
            <span>{o.label}</span>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text2)', marginBottom: 6, display: 'block' }}>
          또는 직접 입력 (선택)
        </label>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value.slice(0, 80))}
          placeholder="예) 따뜻한 회사"
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text)', fontSize: '1rem', outline: 'none',
          }}
        />
      </div>

      <button
        onClick={submit}
        disabled={submitting || (!choice && !custom.trim())}
        className="btn btn-gold"
        style={{ width: '100%', opacity: (!choice && !custom.trim()) ? 0.4 : 1 }}
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

export default function PerceptionPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <SessionGate>{() => <Inner />}</SessionGate>
    </Suspense>
  );
}
