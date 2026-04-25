'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) {
        setError(true);
        setPin('');
      } else {
        router.replace(next);
        router.refresh();
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg)',
    }}>
      <div className="glass-card anim-up" style={{ padding: 40, maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: 'var(--glass-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '1.5rem',
        }}>
          🔒
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
          <span className="text-gold">SYSTEM INNOVATION</span>
        </h1>
        <p style={{ color: 'var(--text2)', marginBottom: 12, fontSize: '0.9375rem' }}>
          강연자 전용 보안 접속
        </p>
        <p style={{ color: 'var(--text3)', marginBottom: 28, fontSize: '0.8125rem' }}>
          청중은 강연 화면에 표시된 QR 코드로 입장하세요
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="••••••••"
            autoFocus
            style={{
              width: '100%', padding: 16, borderRadius: 12,
              border: error ? '1px solid var(--danger)' : '1px solid transparent',
              background: 'var(--glass)', color: 'var(--text)',
              fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5em',
              outline: 'none', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)',
            }}
          />
          <div style={{ minHeight: 20 }}>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600 }}>
              PIN이 일치하지 않습니다.
            </p>}
          </div>
          <button type="submit" className="btn btn-gold" disabled={loading} style={{ width: '100%' }}>
            {loading ? '확인 중…' : '입장하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <LoginForm />
    </Suspense>
  );
}
