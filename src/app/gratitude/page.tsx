'use client';

import { Suspense, useEffect, useState } from 'react';
import SessionGate from '@/components/v2/SessionGate';

const OPTIONS = [
  { key: 'excel_calc', emoji: '📋', label: '내 데이터를 오늘 정확하게 입력하는 것',      desc: '데이터 정확성 — 시스템은 입력된 것만 보여줍니다' },
  { key: 'phone_sync', emoji: '🔍', label: '숫자가 현장 실제와 맞는지 직접 확인하는 것', desc: '현장경영 — HBH 01' },
  { key: 'manual_log', emoji: '⚡', label: '알람 오기 전에 이상을 먼저 알아채는 것',      desc: '일일관리 — HBH 02' },
  { key: 'overtime',   emoji: '🤝', label: '같은 숫자로 다음 부서와 먼저 소통하는 것',    desc: '부서 협업 — 신뢰자본' },
];

function Inner() {
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sysinno_participant');
    if (saved) {
      try { setParticipantId(JSON.parse(saved).id); } catch { /* ignore */ }
    }
  }, []);

  function toggle(key: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  async function submit() {
    if (!participantId || picked.size === 0) return;
    setSubmitting(true);
    try {
      await Promise.all(
        Array.from(picked).map((key) =>
          fetch('/api/gratitude', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participant_id: participantId, saved_from: key }),
          })
        )
      );
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
          <button onClick={() => { setSubmitted(false); setPicked(new Set()); }} style={{
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
      <p className="caption" style={{ color: 'var(--teal)', marginBottom: 8 }}>Part 3 · 응답</p>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8, lineHeight: 1.4 }}>
        이 시스템들의 AFTER를<br />
        <span style={{ color: 'var(--teal)' }}>유지하는 사람</span>이 되려면?
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text3)', marginBottom: 20, lineHeight: 1.6 }}>
        <em>늦게 발견이 미리 발견으로 바뀐 세계, 그것을 유지하는 건 결국 사람입니다.</em> · 중복 선택 가능
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {OPTIONS.map((o) => {
          const on = picked.has(o.key);
          return (
            <button
              key={o.key}
              onClick={() => toggle(o.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', borderRadius: 14,
                background: on ? 'rgba(45,212,191,0.15)' : 'var(--glass)',
                border: on ? '1px solid var(--teal)' : '1px solid transparent',
                color: 'var(--text)', fontWeight: 600, fontSize: '0.9375rem',
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{o.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>{o.label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 500 }}>{o.desc}</p>
              </div>
              {on && <span style={{ color: 'var(--teal)', fontWeight: 900 }}>✓</span>}
            </button>
          );
        })}
      </div>

      <button
        onClick={submit}
        disabled={submitting || picked.size === 0}
        className="btn"
        style={{
          width: '100%',
          background: picked.size > 0 ? 'var(--teal)' : 'var(--glass)',
          color: picked.size > 0 ? '#0B0E1A' : 'var(--text3)',
          opacity: picked.size === 0 ? 0.6 : 1,
        }}
      >
        {submitting ? '전송 중…' : `응답 보내기 (${picked.size})`}
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
      <div className="glass-card" style={{ width: '100%', maxWidth: 460, padding: '32px 28px' }}>
        {children}
      </div>
    </div>
  );
}

export default function GratitudePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <SessionGate>{() => <Inner />}</SessionGate>
    </Suspense>
  );
}
