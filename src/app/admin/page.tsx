'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Participant {
  id: number;
  name: string;
  department: string;
  entry_motivation: string | null;
  joined_at: string;
}

interface ActiveSession {
  id: number;
  session_code: string;
  started_at: string;
}

interface PerceptionData {
  counts: { perception_choice: string; count: number }[];
  customs: { custom_text: string }[];
}

interface HbhData {
  counts: { hardest_habit: string; count: number }[];
}

interface GratitudeData {
  counts: { saved_from: string; count: number }[];
}

const DEPT_COLOR = '#C9A84C';

const NAV = [
  { href: '/prologue', label: 'Prologue', color: '#4F8EF7' },
  { href: '/part1', label: 'Part 1', color: '#F59E0B' },
  { href: '/part2', label: 'Part 2', color: '#2DD4BF' },
  { href: '/part3', label: 'Part 3', color: '#A78BFA' },
  { href: '/epilogue', label: 'Epilogue', color: '#C9A84C' },
];

const AUDIENCE = [
  { href: '/join', label: '청중 Join' },
  { href: '/perception', label: 'Part 1 응답' },
  { href: '/hbh', label: 'Part 2 응답' },
  { href: '/gratitude', label: 'Part 3 응답' },
];

export default function AdminPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [perception, setPerception] = useState<PerceptionData>({ counts: [], customs: [] });
  const [hbh, setHbh] = useState<HbhData>({ counts: [] });
  const [gratitude, setGratitude] = useState<GratitudeData>({ counts: [] });
  const [dbReady, setDbReady] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, s, per, h, g] = await Promise.all([
        fetch('/api/participants').then((r) => r.json()),
        fetch('/api/sessions').then((r) => r.json()),
        fetch('/api/perception').then((r) => r.json()),
        fetch('/api/hbh').then((r) => r.json()),
        fetch('/api/gratitude').then((r) => r.json()),
      ]);
      setParticipants(Array.isArray(p) ? p : []);
      setSession(s?.active ?? null);
      setPerception(per);
      setHbh(h);
      setGratitude(g);
      setDbReady(true);
    } catch {
      setDbReady(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  async function initDb() {
    setBusy(true);
    try {
      await fetch('/api/init', { method: 'POST' });
      alert('DB 초기화 완료');
      load();
    } catch {
      alert('DB 초기화 실패. DATABASE_URL 환경변수를 확인하세요.');
    } finally {
      setBusy(false);
    }
  }

  async function startSession() {
    setBusy(true);
    try {
      await fetch('/api/sessions', { method: 'POST' });
      load();
    } finally {
      setBusy(false);
    }
  }

  async function endSession() {
    if (!session) return;
    if (!confirm(`세션 ${session.session_code}을(를) 종료할까요?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/sessions?code=${encodeURIComponent(session.session_code)}`, { method: 'DELETE' });
      load();
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    location.href = '/login';
  }

  const deptCounts = participants.reduce<Record<string, number>>((acc, p) => {
    acc[p.department] = (acc[p.department] ?? 0) + 1;
    return acc;
  }, {});

  const perceptionTotal = perception.counts.reduce((s, c) => s + c.count, 0);
  const hbhTotal = hbh.counts.reduce((s, c) => s + c.count, 0);
  const gratitudeTotal = gratitude.counts.reduce((s, c) => s + c.count, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--glass-border)', padding: '24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: DEPT_COLOR, letterSpacing: '0.3em', fontWeight: 800, marginBottom: 4 }}>
              SYSTEM INNOVATION · ADMIN
            </p>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              관리 패널
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Pill ok={dbReady} label={dbReady ? 'DB 연결됨' : 'DB 오류'} />
            <button onClick={initDb} disabled={busy} className="btn" style={btnGhost}>
              DB 초기화
            </button>
            <button onClick={logout} className="btn" style={btnGhost}>
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Session Manager */}
        <section className="glass-card" style={{ padding: 28 }}>
          <p className="caption" style={{ color: DEPT_COLOR, marginBottom: 12 }}>① 세션 매니저</p>
          {session ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text3)', marginBottom: 6 }}>현재 활성 세션</p>
                <p style={{ fontFamily: 'monospace', fontSize: '2.25rem', fontWeight: 900, color: DEPT_COLOR, letterSpacing: '0.06em' }}>
                  {session.session_code}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text3)', marginTop: 4 }}>
                  시작: {new Date(session.started_at).toLocaleString('ko-KR')}
                </p>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                  Prologue 화면의 QR이 이 코드로 발급됩니다. 종료 시 이 세션의 모든 입력이 잠깁니다.
                </p>
              </div>
              <button onClick={endSession} disabled={busy} className="btn" style={{ ...btnGhost, color: '#FF6B6B', borderColor: 'rgba(255,107,107,0.3)' }}>
                세션 종료
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', flex: 1, minWidth: 200, lineHeight: 1.6 }}>
                활성 세션이 없습니다. 강연 시작 전에 새 세션을 시작하세요.
              </p>
              <button onClick={startSession} disabled={busy} className="btn btn-gold">
                + 새 세션 시작
              </button>
            </div>
          )}
        </section>

        {/* Slide Nav */}
        <section>
          <p className="caption" style={{ marginBottom: 12 }}>② 발표자 화면</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} target="_blank" style={{
                padding: '10px 18px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem',
                background: 'var(--glass)', color: n.color, border: `1px solid ${n.color}40`,
                textDecoration: 'none',
              }}>
                {n.label} ↗
              </Link>
            ))}
          </div>
          <p className="caption" style={{ marginBottom: 12 }}>③ 청중 응답 페이지 (참고)</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {AUDIENCE.map((n) => (
              <Link key={n.href} href={n.href} target="_blank" style={{
                padding: '8px 14px', borderRadius: 10, fontWeight: 600, fontSize: '0.8125rem',
                background: 'var(--glass-light)', color: 'var(--text2)',
                border: '1px solid var(--glass-border)', textDecoration: 'none',
              }}>
                {n.label} ↗
              </Link>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <Stat label="참여자" value={participants.length} accent="#C9A84C" />
          <Stat label="Part 1 응답" value={perceptionTotal} accent="#F59E0B" />
          <Stat label="Part 2 응답" value={hbhTotal} accent="#2DD4BF" />
          <Stat label="Part 3 응답" value={gratitudeTotal} accent="#A78BFA" />
        </section>

        {/* Dept breakdown */}
        <section className="glass-card" style={{ padding: 24 }}>
          <p className="caption" style={{ marginBottom: 14 }}>부서별 참여 현황</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(deptCounts).length === 0 ? (
              <p style={{ color: 'var(--text3)' }}>참여자 없음</p>
            ) : (
              Object.entries(deptCounts).map(([dept, count]) => (
                <div key={dept} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--glass-light)', borderRadius: 999, padding: '6px 14px',
                  border: '1px solid var(--glass-border)',
                }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>{dept}</span>
                  <span style={{ fontWeight: 900, fontSize: '0.875rem', color: DEPT_COLOR }}>{count}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Participant list */}
        <section className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--glass-border)' }}>
            <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text)' }}>참여자 목록 (입사 동기 포함)</p>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {participants.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)' }}>아직 참여자가 없습니다.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--glass-light)' }}>
                    {['#', '이름', '부서', '입사 동기', '시각'].map((h) => (
                      <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...participants].reverse().map((p) => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '10px 18px', fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text3)' }}>{p.id}</td>
                      <td style={{ padding: '10px 18px', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>{p.name}</td>
                      <td style={{ padding: '10px 18px', fontSize: '0.8125rem', color: 'var(--text2)' }}>{p.department}</td>
                      <td style={{ padding: '10px 18px', fontSize: '0.8125rem', color: 'var(--text2)', fontStyle: p.entry_motivation ? 'italic' : 'normal', maxWidth: 320 }}>
                        {p.entry_motivation || <span style={{ color: 'var(--text3)' }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 18px', fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text3)' }}>
                        {new Date(p.joined_at).toLocaleTimeString('ko-KR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Perception customs */}
        {perception.customs.length > 0 && (
          <section className="glass-card" style={{ padding: 24 }}>
            <p className="caption" style={{ marginBottom: 12 }}>Part 1 자유 응답 (회사 인상)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {perception.customs.map((c, i) => (
                <span key={i} style={{
                  background: 'var(--glass-light)', borderRadius: 999, padding: '6px 14px',
                  fontSize: '0.875rem', color: 'var(--text2)',
                  border: '1px solid var(--glass-border)',
                }}>
                  {c.custom_text}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="glass-card" style={{ padding: '20px 22px', borderLeft: `3px solid ${accent}` }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 800, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '2rem', color: 'var(--text)', lineHeight: 1 }}>
        {value}
      </p>
    </div>
  );
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  const c = ok ? '#2DD4BF' : '#FF6B6B';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: `${c}18`, borderRadius: 999, padding: '6px 14px',
      border: `1px solid ${c}55`,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: c }}>{label}</span>
    </div>
  );
}

const btnGhost: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 10,
  fontWeight: 600,
  fontSize: '0.8125rem',
  background: 'var(--glass-light)',
  color: 'var(--text)',
  border: '1px solid var(--glass-border)',
  cursor: 'pointer',
};
