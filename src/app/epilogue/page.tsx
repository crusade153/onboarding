'use client';

import { useState, useEffect, useRef } from 'react';

interface Participant { id: number; name: string; department: string; }

const DEPT_COLORS: Record<string, string> = {
  마케팅: '#6C3BF5', 영업: '#00C9A7', 생산: '#FF3B6B', 구매: '#FF7A35',
  원가기획: '#00C9A7', 경영기획: '#6C3BF5', 물류: '#D4A800', 품질: '#FF3B6B',
  연구개발: '#6C3BF5', 기타: '#8A8AAF',
};

const LINES = [
  { text: '여러분이 오늘 입력한 이름,', color: 'var(--text)' },
  { text: '여러분이 지금 적은 불편함,', color: 'var(--text)' },
  { text: '여러분이 꿈꾸는 자동화.', color: 'var(--text)' },
  { text: '', color: '' },
  { text: '그것이 이미 Systema의 시작입니다.', color: '#6C3BF5' },
  { text: '', color: '' },
  { text: '시스템은 주어지는 것이 아닙니다.', color: 'var(--text2)' },
  { text: '우리가 — 함께 — 세우는 것입니다.', color: '#6C3BF5' },
];

export default function EpiloguePage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showNames, setShowNames] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try { const r = await fetch('/api/participants'); setParticipants(await r.json()); }
      catch { /* silent */ }
    };
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, []);

  // Typewriter
  useEffect(() => {
    if (visibleLines >= LINES.length) { setTimeout(() => setShowNames(true), 800); return; }
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 1100);
    return () => clearTimeout(t);
  }, [visibleLines]);

  // Ticker scroll
  useEffect(() => {
    if (!showNames || !tickerRef.current) return;
    let pos = 0;
    const el = tickerRef.current;
    const id = setInterval(() => {
      pos += 0.6;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
    }, 16);
    return () => clearInterval(id);
  }, [showNames, participants]);

  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/join?step=epilogue` : '/join?step=epilogue';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>

      {/* Badge */}
      <div className="chip" style={{ color: '#FF7A35', borderColor: '#FF7A35', background: '#FFE9D9', marginBottom: 48 }}>
        Epilogue
      </div>

      {/* Typewriter */}
      <div style={{ maxWidth: 640, textAlign: 'center', marginBottom: 48, minHeight: 280 }}>
        {LINES.slice(0, visibleLines).map((line, i) => (
          <p key={i} style={{
            fontSize: line.color === '#6C3BF5' ? '1.375rem' : '1.125rem',
            fontWeight: line.color === '#6C3BF5' ? 800 : 500,
            color: line.color || 'transparent',
            lineHeight: 1.8,
            animation: 'fadeUp 0.5s ease both',
          }}>
            {line.text || '\u00A0'}
          </p>
        ))}
      </div>

      {/* Wordmark */}
      {showNames && (
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.8s ease both' }}>
          <h1 className="display gradient-purple" style={{ marginBottom: 8 }}>Systema</h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text2)' }}>함께 세운 것</p>
        </div>
      )}

      {/* Name ticker */}
      {showNames && participants.length > 0 && (
        <div style={{ width: '100%', maxWidth: 760, marginBottom: 40, animation: 'fadeUp 1s ease both' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textAlign: 'center', marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            오늘의 참여자 — {participants.length}명
          </p>
          <div ref={tickerRef} style={{ display: 'flex', gap: 10, overflowX: 'hidden', scrollBehavior: 'auto' }}>
            {[...participants, ...participants].map((p, i) => (
              <div key={i} style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--surface)', border: `2px solid ${DEPT_COLORS[p.department] ?? '#8A8AAF'}`,
                borderRadius: 999, padding: '10px 18px',
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: DEPT_COLORS[p.department] ?? '#8A8AAF', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', whiteSpace: 'nowrap' }}>{p.name}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{p.department}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Epilogue QR CTA */}
      {showNames && (
        <div style={{ textAlign: 'center', animation: 'fadeUp 1.2s ease both' }}>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: 600, marginBottom: 12 }}>마지막 질문에 답해주세요 → QR 스캔 또는 아래 주소</p>
          <div style={{ display: 'inline-block', background: '#EDE8FF', border: '2px solid #6C3BF5', borderRadius: 16, padding: '12px 28px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 800, color: '#6C3BF5' }}>{joinUrl}</span>
          </div>
        </div>
      )}
    </div>
  );
}
