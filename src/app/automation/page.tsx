// src/app/automation/page.tsx
'use client';

import { useState, useEffect } from 'react';

const DEPARTMENTS = [
  '마케팅', '영업', '생산', '구매', '품질',
  '물류', '원가기획', '경영기획', '연구개발', '기타',
];

export default function AutomationPage() {
  const [wishText, setWishText] = useState('');
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [department, setDepartment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('systema-participant');
    if (saved) {
      const p = JSON.parse(saved);
      setParticipantId(p.id);
      setDepartment(p.department ?? '');
    }
  }, []);

  const handleSubmit = async () => {
    if (!wishText.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: participantId,
          wish_text: wishText,
          department,
        }),
      });
      setSubmitted(true);
    } catch {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
        <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>🚀</div>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 12,
        }}>
          소중한 의견 감사합니다!
        </h1>
        <p style={{
          color: 'var(--text2)',
          fontSize: '1rem',
          lineHeight: 1.7,
          wordBreak: 'keep-all',
        }}>
          앞쪽 강연 화면에서<br />여러분의 고민이 실시간으로 공유됩니다.
        </p>
      </div>
    );
  }

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
          Part 3 · 자동화 위시리스트
        </p>
        <h1 style={{
          fontSize: '1.375rem',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 8,
          wordBreak: 'keep-all',
          lineHeight: 1.4,
        }}>
          어떤 업무를 자동화하고 싶으신가요?
        </h1>
        <p style={{
          color: 'var(--text2)',
          fontSize: '0.9375rem',
          marginBottom: 28,
          wordBreak: 'keep-all',
          lineHeight: 1.6,
        }}>
          반복적이거나 오류가 잦은 업무,<br />엑셀에 묻혀있는 고민을 남겨주세요.
        </p>

        {/* 부서 선택 — join에서 이미 등록했으면 자동 채워짐, 없으면 선택 */}
        {!participantId && (
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text2)',
              marginBottom: 6,
            }}>
              부서 (선택)
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                padding: '11px 14px',
                color: 'var(--text)',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            >
              <option value="">선택 안함</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {/* 부서 뱃지 (join 등록자는 부서 표시) */}
        {participantId && department && (
          <div style={{ marginBottom: 16 }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--gold)',
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 999,
              padding: '4px 14px',
            }}>
              {department}
            </span>
          </div>
        )}

        {/* 텍스트 입력 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--text2)',
            marginBottom: 6,
          }}>
            자동화하고 싶은 업무 *
          </label>
          <textarea
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            placeholder="예: 월말마다 수작업으로 취합하는 실적 보고서를 자동화하고 싶어요."
            rows={4}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${wishText.trim() ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 12,
              padding: '12px 14px',
              color: 'var(--text)',
              fontSize: '0.9375rem',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.6,
              transition: 'border-color 0.2s',
            }}
          />
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text3)',
            marginTop: 4,
            textAlign: 'right',
          }}>
            {wishText.length} 자
          </p>
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={loading || !wishText.trim()}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            border: 'none',
            background: wishText.trim()
              ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
              : 'rgba(255,255,255,0.08)',
            color: wishText.trim() ? '#0B0E1A' : 'var(--text3)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: wishText.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {loading ? '전송 중...' : '제출하기 ✦'}
        </button>
      </div>
    </div>
  );
}