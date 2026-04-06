// src/app/survey/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Participant {
  id: number;
  name: string;
  department: string;
}

export default function SurveyPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedPid, setSelectedPid] = useState<number | ''>('');
  const [hasConfusion, setHasConfusion] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/participants')
      .then((r) => r.json())
      .then((data) => setParticipants(data));

    const saved = localStorage.getItem('systema-participant');
    if (saved) {
      const p = JSON.parse(saved);
      setSelectedPid(p.id);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedPid || hasConfusion === null) return;
    setLoading(true);
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: Number(selectedPid),
          has_confusion: hasConfusion,
          comment,
        }),
      });
      setSubmitted(true);
    } catch {
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ── 제출 완료 화면 ──
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
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--glass)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: '36px 28px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🙌</div>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Part 1 · 작성 완료
          </p>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 12,
          }}>
            소중한 경험 감사합니다!
          </h1>
          <p style={{
            color: 'var(--text2)',
            fontSize: '1rem',
            lineHeight: 1.7,
            wordBreak: 'keep-all',
          }}>
            앞쪽 강연 화면에서<br />여러분의 경험이 실시간으로 공유됩니다.
          </p>
        </div>
      </div>
    );
  }

  // ── 설문 입력 화면 ──
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
          Part 1 · 공감 & 교훈
        </p>
        <h1 style={{
          fontSize: '1.375rem',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 8,
          wordBreak: 'keep-all',
          lineHeight: 1.4,
        }}>
          기준정보로 헷갈렸던<br />경험이 있으신가요?
        </h1>
        <p style={{
          color: 'var(--text2)',
          fontSize: '0.9375rem',
          marginBottom: 28,
          wordBreak: 'keep-all',
          lineHeight: 1.6,
        }}>
          여러분의 실제 경험을 공유해주시면<br />강연 화면에 실시간으로 반영됩니다.
        </p>

        {/* Q1. 본인 선택 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--text2)',
            marginBottom: 6,
          }}>
            1. 본인을 선택해주세요
          </label>
          <select
            value={selectedPid}
            onChange={(e) => setSelectedPid(Number(e.target.value))}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${selectedPid ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 12,
              padding: '12px 14px',
              color: selectedPid ? 'var(--text)' : 'var(--text3)',
              fontSize: '0.9375rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: 36,
            }}
          >
            <option value="">소속과 이름을 선택하세요</option>
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.department}] {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Q2. 경험 유무 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--text2)',
            marginBottom: 10,
          }}>
            2. 업무 기준이 모호해서 헷갈렸던 적이 있나요?
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setHasConfusion(true)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 12,
                border: `2px solid ${hasConfusion === true ? 'var(--gold)' : 'rgba(255,255,255,0.12)'}`,
                background: hasConfusion === true
                  ? 'rgba(201,168,76,0.15)'
                  : 'rgba(255,255,255,0.04)',
                color: hasConfusion === true ? 'var(--gold)' : 'var(--text2)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              네, 있어요 🙋
            </button>
            <button
              onClick={() => { setHasConfusion(false); setComment(''); }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 12,
                border: `2px solid ${hasConfusion === false ? 'rgba(79,142,247,0.6)' : 'rgba(255,255,255,0.12)'}`,
                background: hasConfusion === false
                  ? 'rgba(79,142,247,0.12)'
                  : 'rgba(255,255,255,0.04)',
                color: hasConfusion === false ? 'var(--blue)' : 'var(--text2)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              아니오 🙅
            </button>
          </div>
        </div>

        {/* Q3. 코멘트 (조건부) */}
        {hasConfusion && (
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text2)',
              marginBottom: 6,
            }}>
              3. 어떤 상황이었나요? (자유롭게 작성)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="예: 발주 단위가 박스인지 팩인지 헷갈려서 임의로 처리했어요..."
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${comment.trim() ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.12)'}`,
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
              {comment.length} 자
            </p>
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={loading || !selectedPid || hasConfusion === null}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            border: 'none',
            background: (selectedPid && hasConfusion !== null)
              ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
              : 'rgba(255,255,255,0.08)',
            color: (selectedPid && hasConfusion !== null) ? '#0B0E1A' : 'var(--text3)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: (selectedPid && hasConfusion !== null) ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {loading ? '전송 중...' : '게시판에 올리기 🚀'}
        </button>
      </div>
    </div>
  );
}