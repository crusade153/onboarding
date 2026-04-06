// src/app/vote/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const OPTIONS = [
  {
    key: 'A',
    label: '품질팀: 잊혀진 클릭',
    desc: '품질대기 해제 누락 → 추가 생산 및 시한부 악성재고 발생',
    accent: '#4F8EF7',
  },
  {
    key: 'B',
    label: 'BM팀: 환산단위 착각',
    desc: '판매계획 오인 → 48만 식 초과생산 및 장기 적치',
    accent: '#FF3B6B',
  },
  {
    key: 'C',
    label: '생산팀: 가짜 버퍼 조작',
    desc: '수율 임의 하향(85%) → 원부자재 초과 발주 및 재고 폭증',
    accent: '#D4A800',
  },
  {
    key: 'D',
    label: '자재팀: 발주 단위 오류',
    desc: '롤/천장 착각 → 라인 올스톱 및 지옥의 연장근무',
    accent: '#F97316',
  },
];

function VoteContent() {
  const params = useSearchParams();
  const pid = params.get('pid');
  const [voted, setVoted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('systema_vote_part2');
    if (saved) setVoted(saved);
  }, []);

  async function vote(key: string) {
    if (!pid) {
      setError('/join 에서 먼저 참여 등록을 해주세요.');
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: Number(pid),
          part: 'part2',
          option_key: key,
        }),
      });
      setVoted(key);
      localStorage.setItem('systema_vote_part2', key);
    } catch {
      setError('투표 실패. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  const selectedOpt = OPTIONS.find((o) => o.key === voted);

  // ── 투표 완료 화면 ──
  if (voted && selectedOpt) {
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
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>✅</div>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Part 2 · 투표 완료
          </p>

          {/* 선택한 항목 */}
          <div style={{
            margin: '20px 0',
            padding: '16px 20px',
            borderRadius: 14,
            border: `2px solid ${selectedOpt.accent}`,
            background: `${selectedOpt.accent}12`,
          }}>
            <p style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: selectedOpt.accent,
              marginBottom: 4,
              fontFamily: 'monospace',
            }}>
              {selectedOpt.key}
            </p>
            <p style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 6,
              wordBreak: 'keep-all',
            }}>
              {selectedOpt.label}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text2)',
              lineHeight: 1.5,
              wordBreak: 'keep-all',
            }}>
              {selectedOpt.desc}
            </p>
          </div>

          <p style={{
            color: 'var(--text2)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            marginBottom: 20,
          }}>
            강연 화면을 주시해 주세요.
          </p>

          <button
            onClick={() => {
              setVoted(null);
              localStorage.removeItem('systema_vote_part2');
            }}
            style={{
              padding: '10px 24px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text3)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            다시 투표하기
          </button>
        </div>
      </div>
    );
  }

  // ── 투표 선택 화면 ──
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
          Part 2 · 투표
        </p>
        <h1 style={{
          fontSize: '1.375rem',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 8,
          wordBreak: 'keep-all',
          lineHeight: 1.4,
        }}>
          가장 뼈아픈<br />나비효과를 골라보세요
        </h1>
        <p style={{
          color: 'var(--text2)',
          fontSize: '0.9375rem',
          marginBottom: 24,
          wordBreak: 'keep-all',
          lineHeight: 1.6,
        }}>
          우리 조직을 그림자 노동에 빠뜨릴<br />시나리오는 무엇일까요?
        </p>

        {/* 선택지 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => vote(opt.key)}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                width: '100%',
                padding: '16px 18px',
                borderRadius: 14,
                border: `2px solid ${opt.accent}30`,
                background: `${opt.accent}08`,
                cursor: loading ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLElement).style.border = `2px solid ${opt.accent}80`;
                  (e.currentTarget as HTMLElement).style.background = `${opt.accent}15`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = `2px solid ${opt.accent}30`;
                (e.currentTarget as HTMLElement).style.background = `${opt.accent}08`;
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
            >
              <span style={{
                fontFamily: 'monospace',
                fontSize: '1.75rem',
                fontWeight: 900,
                color: opt.accent,
                flexShrink: 0,
                width: 32,
                textAlign: 'center',
              }}>
                {opt.key}
              </span>
              <div>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--text)',
                  marginBottom: 3,
                  wordBreak: 'keep-all',
                }}>
                  {opt.label}
                </p>
                <p style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text2)',
                  lineHeight: 1.4,
                  wordBreak: 'keep-all',
                }}>
                  {opt.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p style={{
            color: 'var(--red)',
            fontWeight: 600,
            fontSize: '0.875rem',
            textAlign: 'center',
            marginTop: 16,
            padding: '10px 14px',
            background: 'rgba(248,113,113,0.08)',
            borderRadius: 10,
            border: '1px solid rgba(248,113,113,0.2)',
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function VotePage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text2)',
        fontSize: '1rem',
      }}>
        로딩 중...
      </div>
    }>
      <VoteContent />
    </Suspense>
  );
}