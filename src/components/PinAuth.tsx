'use client';

import { useState, useEffect, ReactNode } from 'react';

export default function PinAuth({ children }: { children: ReactNode }) {
  // null = 로딩 중 (새로고침 시 깜빡임 방지), true = 인가됨, false = 미인가
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // 설정하신 핀 번호
  const CORRECT_PIN = '391511';

  useEffect(() => {
    // 브라우저 스토리지에서 인증 여부 확인
    const authStatus = localStorage.getItem('systema_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      localStorage.setItem('systema_auth', 'true'); // 인증 성공 시 저장
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPin(''); // 틀리면 입력창 비우기
    }
  };

  // 아직 스토리지 확인 전이면 빈 화면을 보여주어 깜빡임(Flash) 방지
  if (isAuthenticated === null) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg)' }} />;
  }

  // 인증 성공 시 하위 컴포넌트(앱 전체) 렌더링
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 인증 실패/미인증 시 핀 번호 입력 화면 (글라스모피즘 UI)
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg)',
      position: 'fixed',
      inset: 0,
      zIndex: 9999
    }}>
      <div className="glass-card anim-up" style={{ padding: '40px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
        <div style={{ 
          width: '56px', height: '56px', borderRadius: '50%', background: 'var(--glass-light)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          border: '1px solid var(--glass-border)', fontSize: '1.5rem'
        }}>
          🔒
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text)' }}>
          SYSTEMA <span className="text-gold">보안 접속</span>
        </h1>
        <p style={{ color: 'var(--text2)', marginBottom: '32px', fontSize: '0.9375rem' }}>
          개인용 공간입니다. PIN 번호를 입력해주세요.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="password" 
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="••••••"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: error ? '1px solid var(--danger)' : '1px solid var(--glass-border)',
              background: 'var(--glass)',
              color: 'var(--text)',
              fontSize: '1.5rem',
              textAlign: 'center',
              letterSpacing: '0.5em',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
            }}
            autoFocus
          />
          {/* 에러 메시지 고정 영역 (레이아웃 흔들림 방지) */}
          <div style={{ minHeight: '20px' }}>
            {error && <p className="anim-up" style={{ color: 'var(--danger)', fontSize: '0.875rem', margin: 0, fontWeight: 600 }}>PIN 번호가 일치하지 않습니다.</p>}
          </div>
          
          <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '8px' }}>
            입장하기
          </button>
        </form>
      </div>
    </div>
  );
}