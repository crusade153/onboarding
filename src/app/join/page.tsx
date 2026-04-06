// src/app/join/page.tsx
'use client';

import { useState, useEffect } from 'react';

const DEPARTMENTS = [
  'R&D',
  '구매',
  '생산본부',
  '원가',
  '컴플라이언스',
  '인사문화',
  '물류',
  '브랜드영업',
  '브랜드마케팅',
  '영업2본부',
  'B2B사업부',
  '글로벌사업부',
  '경영지원',
];

export default function JoinPage() {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState<{
    id: number;
    name: string;
    department: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('systema-participant');
    if (saved) setParticipant(JSON.parse(saved));
  }, []);

  const handleExit = () => {
    if (confirm('정말 나가시겠습니까? 등록 정보가 삭제됩니다.')) {
      localStorage.removeItem('systema-participant');
      setParticipant(null);
      setName('');
      setDepartment('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department) return;
    setLoading(true);
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, department }),
      });
      const data = await res.json();
      localStorage.setItem('systema-participant', JSON.stringify(data));
      setParticipant(data);
    } catch {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ── 등록 완료 화면 ──
  if (participant) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--glass)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: '36px 28px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Prologue · 참여 완료
          </p>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 8,
          }}>
            연결되었습니다!
          </h1>
          <p style={{
            color: 'var(--text2)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: 24,
            wordBreak: 'keep-all',
          }}>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>{participant.name}</span>님,<br />
            준비가 완료되었습니다.<br />강연 화면을 주시해 주세요.
          </p>

          {/* 부서 뱃지 */}
          <div style={{
            padding: '14px 20px',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: 14,
            marginBottom: 20,
          }}>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--gold)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              소속 부서
            </p>
            <p style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              color: 'var(--text)',
            }}>
              {participant.department}
            </p>
          </div>

          <button
            onClick={handleExit}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 12,
              border: '1px solid rgba(248,113,113,0.3)',
              background: 'rgba(248,113,113,0.06)',
              color: 'var(--red)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            세션 나가기
          </button>
        </div>
      </div>
    );
  }

  // ── 등록 화면 ──
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--glass)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        padding: '36px 28px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
      }}>
        {/* 헤더 */}
        <p style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          Prologue · 참여하기
        </p>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 8,
          lineHeight: 1.3,
        }}>
          가치 사슬에<br />연결되세요
        </h1>
        <p style={{
          color: 'var(--text2)',
          fontSize: '0.9375rem',
          marginBottom: 28,
          wordBreak: 'keep-all',
          lineHeight: 1.6,
        }}>
          성함과 부서를 입력하시면<br />강연 화면에 실시간으로 반영됩니다.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 이름 입력 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text2)',
              marginBottom: 6,
            }}>
              이름 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${name ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 12,
                padding: '12px 14px',
                color: 'var(--text)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* 부서 선택 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text2)',
              marginBottom: 6,
            }}>
              부서 *
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${department ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 12,
                padding: '12px 14px',
                color: department ? 'var(--text)' : 'var(--text3)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                paddingRight: 36,
              }}
            >
              <option value="">부서를 선택해주세요</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading || !name || !department}
            style={{
              marginTop: 4,
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: (name && department)
                ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
                : 'rgba(255,255,255,0.08)',
              color: (name && department) ? '#0B0E1A' : 'var(--text3)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: (name && department) ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '연결 중...' : '시스템 연결 ✦'}
          </button>
        </form>
      </div>
    </div>
  );
}