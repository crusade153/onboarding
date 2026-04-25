'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

interface Props {
  children: (sessionCode: string) => ReactNode;
}

const STORAGE_KEY = 'sysinno_session';

export default function SessionGate({ children }: Props) {
  const params = useSearchParams();
  const [state, setState] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const urlCode = params.get('session');
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const candidate = urlCode || stored || '';

    if (!candidate) {
      setState('invalid');
      return;
    }

    fetch(`/api/sessions?code=${encodeURIComponent(candidate)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          localStorage.setItem(STORAGE_KEY, candidate);
          setCode(candidate);
          setState('valid');
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setState('invalid');
        }
      })
      .catch(() => setState('invalid'));
  }, [params]);

  if (state === 'loading') {
    return <div style={{ minHeight: '100vh', background: 'var(--bg)' }} />;
  }

  if (state === 'invalid') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, background: 'var(--bg)',
      }}>
        <div className="glass-card" style={{ padding: 36, maxWidth: 380, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🎤</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
            세션이 활성화되지 않았습니다
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9375rem', lineHeight: 1.7, wordBreak: 'keep-all' }}>
            강연 화면에 표시된 <strong style={{ color: 'var(--gold)' }}>QR 코드</strong>를 스캔해 주세요.
            <br />
            세션은 강연자가 시작하면 자동으로 발급됩니다.
          </p>
        </div>
      </div>
    );
  }

  return <>{children(code)}</>;
}
