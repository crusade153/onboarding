'use client';

import { Suspense, useEffect, useState } from 'react';
import SessionGate from '@/components/v2/SessionGate';

const DEPARTMENTS = [
  'R&D', '구매', '생산본부', '원가', '컴플라이언스', '인사문화',
  '물류', '브랜드영업', '브랜드마케팅', '영업2본부', 'B2B사업부',
  '글로벌사업부', '경영지원',
];

interface Participant {
  id: number;
  name: string;
  department: string;
  entry_motivation?: string | null;
}

function JoinForm({ sessionCode }: { sessionCode: string }) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [motivation, setMotivation] = useState('');
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sysinno_participant');
    if (saved) {
      try { setParticipant(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const handleExit = () => {
    if (confirm('정말 나가시겠습니까? 등록 정보가 삭제됩니다.')) {
      localStorage.removeItem('sysinno_participant');
      setParticipant(null);
      setName(''); setDepartment(''); setMotivation('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, department,
          session_code: sessionCode,
          entry_motivation: motivation,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || '등록 실패');
        return;
      }
      const data = await res.json();
      localStorage.setItem('sysinno_participant', JSON.stringify(data));
      setParticipant(data);
    } catch {
      setError('네트워크 오류');
    } finally {
      setLoading(false);
    }
  };

  // 등록 완료 화면
  if (participant) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, textAlign: 'center',
      }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: 420, padding: '36px 28px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 8 }}>참여 완료</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
            연결되었습니다
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 24, wordBreak: 'keep-all' }}>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>{participant.name}</span>님,<br />
            준비가 완료되었습니다. 강연 화면을 주시해 주세요.
          </p>

          <div style={{
            padding: '14px 20px', background: 'rgba(201,168,76,0.08)',
            borderRadius: 14, marginBottom: 16,
          }}>
            <p className="caption" style={{ color: 'var(--gold)', marginBottom: 4 }}>소속 부서</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)' }}>{participant.department}</p>
          </div>

          {participant.entry_motivation && (
            <div style={{
              padding: '14px 20px', background: 'var(--glass-light)',
              borderRadius: 14, marginBottom: 20, textAlign: 'left',
            }}>
              <p className="caption" style={{ marginBottom: 4 }}>입사 동기</p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;{participant.entry_motivation}&rdquo;
              </p>
            </div>
          )}

          <button
            onClick={handleExit}
            style={{
              width: '100%', padding: 12, borderRadius: 12,
              border: '1px solid rgba(248,113,113,0.3)',
              background: 'rgba(248,113,113,0.06)',
              color: 'var(--red)', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
            }}
          >
            세션 나가기
          </button>
        </div>
      </div>
    );
  }

  // 등록 화면
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 420, padding: '36px 28px' }}>
        <p className="caption" style={{ color: 'var(--gold)', marginBottom: 10 }}>SYSTEM INNOVATION · 참여하기</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>
          가치 사슬에<br />연결되세요
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9375rem', marginBottom: 24, wordBreak: 'keep-all', lineHeight: 1.6 }}>
          이름·부서를 입력하시면 강연 화면에 실시간으로 반영됩니다.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="이름 *">
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="홍길동" required
              style={inputStyle(!!name)}
            />
          </Field>

          <Field label="부서 *">
            <select
              value={department} onChange={(e) => setDepartment(e.target.value)}
              required
              style={{
                ...inputStyle(!!department),
                color: department ? 'var(--text)' : 'var(--text3)',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                paddingRight: 36,
              }}
            >
              <option value="">부서를 선택해주세요</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>

          <Field label="입사 동기 (선택)">
            <textarea
              value={motivation} onChange={(e) => setMotivation(e.target.value.slice(0, 100))}
              placeholder="예) 진짜 식품을 만드는 회사에 오고 싶었습니다"
              rows={2}
              style={{
                ...inputStyle(false),
                resize: 'none', fontFamily: 'inherit', minHeight: 60,
              }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 4, textAlign: 'right' }}>
              {motivation.length}/100 — Epilogue 크레딧에서 소개될 수 있습니다
            </p>
          </Field>

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !name || !department}
            style={{
              marginTop: 4, width: '100%', padding: 14, borderRadius: 12, border: 'none',
              background: (name && department) ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : 'rgba(255,255,255,0.08)',
              color: (name && department) ? '#0B0E1A' : 'var(--text3)',
              fontWeight: 700, fontSize: '1rem',
              cursor: (name && department) ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? '연결 중…' : '시스템 연결 ✦'}
          </button>
        </form>
      </div>
    </div>
  );
}

function inputStyle(filled: boolean): React.CSSProperties {
  return {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${filled ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: 12, padding: '12px 14px',
    color: 'var(--text)', fontSize: '1rem', outline: 'none',
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '0.8125rem', fontWeight: 700,
        color: 'var(--text2)', marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <SessionGate>
        {(code) => <JoinForm sessionCode={code} />}
      </SessionGate>
    </Suspense>
  );
}
