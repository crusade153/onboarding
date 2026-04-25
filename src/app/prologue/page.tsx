'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';
import QRCode from 'react-qr-code';

const DotCanvas = dynamic(() => import('@/components/DotCanvas'), { ssr: false });

interface Participant {
  id: number;
  name: string;
  department: string;
  joined_at: string;
  entry_motivation?: string | null;
}
interface ActiveSession { session_code: string; started_at: string; }

const DEPT_COLORS: Record<string, string> = {
  마케팅: '#4F8EF7', 영업: '#2DD4BF', 생산: '#F87171', 구매: '#F59E0B',
  원가: '#C9A84C', 경영기획: '#A78BFA', 물류: '#34D399', 품질: '#FB923C',
  연구개발: '#818CF8', 기타: '#475569',
};

export default function ProloguePage() {
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [creating, setCreating] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [connected, setConnected] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [lastFetched, setLastFetched] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  // 활성 세션 조회
  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((data) => setSession(data.active));
  }, []);

  // QR URL = origin + /join?session=CODE
  useEffect(() => {
    if (session) {
      setQrUrl(`${window.location.origin}/join?session=${session.session_code}`);
    } else {
      setQrUrl('');
    }
  }, [session]);

  const fetchParticipants = useCallback(async () => {
    if (!session) return;
    try {
      const url = lastFetched
        ? `/api/participants?since=${encodeURIComponent(lastFetched)}`
        : '/api/participants';
      const data: Participant[] = await fetch(url).then((r) => r.json());
      if (data.length > 0) {
        setParticipants((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          return [...prev, ...data.filter((p) => !ids.has(p.id))];
        });
        setLastFetched(data[data.length - 1].joined_at);
      }
    } catch { /* silent */ }
  }, [lastFetched, session]);

  useEffect(() => {
    if (!session) return;
    fetchParticipants();
    const t = setInterval(fetchParticipants, 2000);
    return () => clearInterval(t);
  }, [fetchParticipants, session]);

  async function startSession() {
    setCreating(true);
    try {
      const res = await fetch('/api/sessions', { method: 'POST' });
      const data = await res.json();
      setSession({ session_code: data.session_code, started_at: data.started_at });
    } finally {
      setCreating(false);
    }
  }

  const deptCounts = participants.reduce<Record<string, number>>((a, p) => {
    a[p.department] = (a[p.department] ?? 0) + 1;
    return a;
  }, {});

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <NavBar current="Prologue" step="00/04" />

      <div style={{ position: 'absolute', inset: 0, top: 56 }}>
        <DotCanvas participants={participants} connected={connected} />
      </div>

      <div style={{
        position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column',
        minHeight: 'calc(100vh - 56px)', pointerEvents: 'none',
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px' }}>

          {/* 세션 미시작 */}
          {!session && (
            <div className="glass-card" style={{ padding: 40, maxWidth: 520, width: '100%', textAlign: 'center', pointerEvents: 'auto' }}>
              <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>강연자 작업</p>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 12, color: 'var(--text)' }}>
                세션을 시작하세요
              </h1>
              <p style={{ color: 'var(--text2)', marginBottom: 28, lineHeight: 1.7 }}>
                세션을 시작하면 청중용 QR 코드가 자동 생성됩니다.<br />
                강연이 끝나면 Admin 패널에서 세션을 종료할 수 있습니다.
              </p>
              <button onClick={startSession} disabled={creating} className="btn btn-gold" style={{ width: '100%' }}>
                {creating ? '시작 중…' : '세션 시작 ✦'}
              </button>
            </div>
          )}

          {/* 세션 시작됨 - 미연결 상태 */}
          {session && !connected && (
            <div style={{ display: 'flex', gap: 32, width: '100%', maxWidth: 1100, alignItems: 'flex-start', pointerEvents: 'auto' }}>

              {/* 좌측: 오프닝 내레이션 */}
              <div style={{ flex: 1 }}>
                <p className="caption" style={{ color: 'rgba(79,142,247,0.7)', marginBottom: 20 }}>Opening · 8분</p>
                <div className="glass-card" style={{ padding: '32px 36px' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20, letterSpacing: '-0.01em' }}>
                    오늘 우리가 왜 모였나
                  </h2>

                  <p style={{ fontSize: '1.125rem', color: 'var(--text2)', lineHeight: 1.8, marginBottom: 20 }}>
                    오늘 우리는 하림산업이 어떻게 돌아가는지를 한 시간 만에 압축해서 보겠습니다.
                  </p>

                  <div style={{ borderLeft: '2px solid rgba(201,168,76,0.4)', paddingLeft: 20, margin: '20px 0' }}>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text)', lineHeight: 1.7, fontWeight: 600 }}>
                      그런데 그 끝에 남는 질문은 하나입니다.
                    </p>
                    <p style={{ fontSize: '1.25rem', color: 'var(--gold)', lineHeight: 1.7, fontWeight: 700, marginTop: 8, fontStyle: 'italic' }}>
                      &ldquo;그래서 나는 이 회사에서 어떤 사람이 되어야 하는가?&rdquo;
                    </p>
                  </div>

                  <p style={{ fontSize: '0.9375rem', color: 'var(--text3)', lineHeight: 1.7, marginTop: 16, fontStyle: 'italic', wordBreak: 'keep-all' }}>
                    오늘 강연은 그 답을 찾기 위한 70분의 짧은 여정입니다.
                  </p>
                </div>

                {/* 참여 통계 */}
                <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                  <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#C9A84C', fontVariantNumeric: 'tabular-nums' }}>
                      {participants.length}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text2)', fontWeight: 600 }}>명 참여 중</span>
                  </div>
                  {Object.entries(deptCounts).slice(0, 5).map(([dept, count]) => (
                    <div key={dept} className="glass-card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: DEPT_COLORS[dept] ?? '#475569', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)' }}>{dept}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 900, color: DEPT_COLORS[dept] ?? '#475569' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 우측: QR 코드 */}
              <div style={{ width: 300, flexShrink: 0 }}>
                <div className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
                  <p className="caption" style={{ color: 'rgba(201,168,76,0.6)', marginBottom: 8 }}>지금 바로 참여</p>

                  <div style={{
                    fontFamily: 'monospace', fontWeight: 900, fontSize: '1.125rem',
                    color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 16,
                  }}>
                    {session.session_code}
                  </div>

                  <div style={{ background: 'white', padding: 16, borderRadius: 12, display: 'inline-block', marginBottom: 16 }}>
                    {qrUrl && <QRCode value={qrUrl} size={160} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>
                    스마트폰 카메라로 스캔 후<br />이름·부서·입사 동기를 등록하세요
                  </p>

                  {participants.length >= 1 && (
                    <button
                      onClick={() => {
                        setConnected(true);
                        setTimeout(() => setShowTitle(true), 1200);
                      }}
                      className="btn btn-gold"
                      style={{ width: '100%' }}
                    >
                      가치사슬 연결 ✦
                    </button>
                  )}
                  {participants.length === 0 && (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text3)', fontStyle: 'italic' }}>
                      참여자를 기다리는 중…
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 연결 후 타이틀 */}
          {session && connected && (
            <div style={{ textAlign: 'center', animation: 'fadeUp 0.8s ease', pointerEvents: 'auto' }}>
              {showTitle && (
                <div className="glass-card" style={{ padding: '56px 64px', maxWidth: 820, margin: '0 auto' }}>
                  <p className="caption" style={{ color: 'var(--gold)', marginBottom: 12 }}>SYSTEM INNOVATION · 시스템 혁신</p>
                  <h1 className="display text-gold" style={{ marginBottom: 12 }}>지금, 연결되었습니다</h1>
                  <p style={{ fontSize: '1.125rem', color: 'rgba(201,168,76,0.9)', fontWeight: 700, marginBottom: 20 }}>
                    현재 {participants.length}명이 하나의 흐름 위에 서 있습니다
                  </p>

                  <div style={{ textAlign: 'left', padding: '24px 32px', borderRadius: 12 }}>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: 16 }}>
                      앞으로 70분 동안 우리는 세 가지 질문에 답합니다 —
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <li style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Part 1.</strong> 우리 회사는 무엇을 만드는가
                      </li>
                      <li style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Part 2.</strong> 우리 회사는 어떻게 일하는가 (HBH)
                      </li>
                      <li style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Part 3.</strong> 그 결과 무엇이 만들어졌는가
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
