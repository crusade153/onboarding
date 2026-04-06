// src/app/automation/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Participant {
  id: number;
  name: string;
  department: string;
}

export default function AutomationPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedPid, setSelectedPid] = useState<number | ''>('');
  const [wishText, setWishText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 전체 참여자 목록 불러오기
    fetch('/api/participants')
      .then((r) => r.json())
      .then((data) => setParticipants(data));

    // join에서 등록한 이력이 있으면 자동 선택
    const saved = localStorage.getItem('systema-participant');
    if (saved) {
      const p = JSON.parse(saved);
      setSelectedPid(p.id);
    }
  }, []);

  // 선택된 참여자 정보
  const selectedParticipant = participants.find((p) => p.id === Number(selectedPid));

  const handleSubmit = async () => {
    if (!selectedPid || !wishText.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: Number(selectedPid),
          wish_text: wishText,
          department: selectedParticipant?.department ?? '',
        }),
      });
      setSubmitted(true);
    } catch {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
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
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🚀</div>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Part 3 · 작성 완료
          </p>
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
      </div>
    );
  }

  // ── 입력 화면 ──
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
          어떤 업무를<br />자동화하고 싶으신가요?
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

          {/* 선택된 참여자 부서 뱃지 */}
          {selectedParticipant && (
            <div style={{ marginTop: 8 }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--gold)',
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 999,
                padding: '3px 12px',
              }}>
                {selectedParticipant.department}
              </span>
            </div>
          )}
        </div>

        {/* Q2. 자동화 희망 업무 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--text2)',
            marginBottom: 6,
          }}>
            2. 자동화하고 싶은 업무 *
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
          disabled={loading || !selectedPid || !wishText.trim()}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            border: 'none',
            background: (selectedPid && wishText.trim())
              ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
              : 'rgba(255,255,255,0.08)',
            color: (selectedPid && wishText.trim()) ? '#0B0E1A' : 'var(--text3)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: (selectedPid && wishText.trim()) ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {loading ? '전송 중...' : '제출하기 ✦'}
        </button>
      </div>
    </div>
  );
}