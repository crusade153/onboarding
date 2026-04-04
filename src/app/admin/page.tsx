'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Participant { id: number; name: string; department: string; joined_at: string; }
interface VoteCount { option_key: string; count: number; }
interface ResponseRow { question_type: string; response_text: string; }

const DEPT_COLORS: Record<string, string> = {
  마케팅: '#6C3BF5', 영업: '#00C9A7', 생산: '#FF3B6B', 구매: '#FF7A35',
  원가기획: '#00C9A7', 경영기획: '#6C3BF5', 물류: '#D4A800', 품질: '#FF3B6B',
  연구개발: '#6C3BF5', 기타: '#8A8AAF',
};

const NAV = [
  { href: '/prologue', label: 'Prologue', color: '#6C3BF5', bg: '#EDE8FF' },
  { href: '/part1',   label: 'Part 1',   color: '#00C9A7', bg: '#D0FFF5' },
  { href: '/part2',   label: 'Part 2',   color: '#FF3B6B', bg: '#FFE0E8' },
  { href: '/part3',   label: 'Part 3',   color: '#D4A800', bg: '#FFFACC' },
  { href: '/epilogue',label: 'Epilogue', color: '#FF7A35', bg: '#FFE9D9' },
  { href: '/join',    label: '청중 Join', color: '#6C3BF5', bg: '#EDE8FF' },
  { href: '/vote',    label: 'Part2 투표', color: '#FF3B6B', bg: '#FFE0E8' },
];

export default function AdminPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votes, setVotes] = useState<VoteCount[]>([]);
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  async function initDb() {
    setInitLoading(true);
    try {
      await fetch('/api/init', { method: 'POST' });
      setDbReady(true);
      alert('DB 초기화 완료!');
    } catch { alert('DB 초기화 실패. DATABASE_URL 환경변수를 확인하세요.'); }
    finally { setInitLoading(false); }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [p, v, r] = await Promise.all([
          fetch('/api/participants').then(r => r.json()),
          fetch('/api/votes?part=part2').then(r => r.json()),
          fetch('/api/responses').then(r => r.json()),
        ]);
        setParticipants(p); setVotes(v); setResponses(r); setDbReady(true);
      } catch { setDbReady(false); }
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const deptCounts = participants.reduce<Record<string, number>>((acc, p) => {
    acc[p.department] = (acc[p.department] ?? 0) + 1; return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--primary)', padding: '32px 40px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="headline" style={{ color: '#fff', marginBottom: 4 }}>Systema Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>강연자 전용 관리 패널</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: dbReady ? 'rgba(0,201,167,0.25)' : 'rgba(255,59,107,0.25)', borderRadius: 12, padding: '8px 16px', border: `1.5px solid ${dbReady ? '#00C9A7' : '#FF3B6B'}` }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: dbReady ? '#00C9A7' : '#FF3B6B', display: 'inline-block' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: dbReady ? '#00C9A7' : '#FF3B6B' }}>
                {dbReady ? 'DB 연결됨' : 'DB 오류'}
              </span>
            </div>
            <button onClick={initDb} disabled={initLoading} style={{
              padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff',
              opacity: initLoading ? 0.7 : 1,
            }}>
              {initLoading ? '초기화 중...' : 'DB 초기화 (최초 1회)'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Nav */}
        <section>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>슬라이드 바로가기</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} target="_blank" style={{
                padding: '10px 20px', borderRadius: 14, fontWeight: 700, fontSize: '0.9375rem',
                background: n.bg, color: n.color, border: `2px solid ${n.color}`, textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}>
                {n.label} ↗
              </Link>
            ))}
          </div>
        </section>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { label: '총 참여자', value: participants.length, color: '#6C3BF5', bg: '#EDE8FF' },
            { label: '투표 수 (Part2)', value: votes.reduce((s, v) => s + v.count, 0), color: '#FF3B6B', bg: '#FFE0E8' },
            { label: 'Epilogue 응답', value: responses.length, color: '#00C9A7', bg: '#D0FFF5' },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, border: `2px solid ${s.color}`, borderRadius: 20, padding: '20px 24px' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: s.color, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              <p style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '2.5rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Dept breakdown */}
        <section style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 20, padding: '20px 24px' }}>
          <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: 14 }}>부서별 참여 현황</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(deptCounts).length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>참여자 없음</p>
            ) : Object.entries(deptCounts).map(([dept, count]) => (
              <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${DEPT_COLORS[dept] ?? '#8A8AAF'}15`, border: `2px solid ${DEPT_COLORS[dept] ?? '#8A8AAF'}`, borderRadius: 999, padding: '6px 14px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>{dept}</span>
                <span style={{ fontWeight: 900, fontSize: '1rem', color: DEPT_COLORS[dept] ?? '#8A8AAF' }}>{count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Participant list */}
        <section style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '2px solid var(--border)', background: 'var(--surface2)' }}>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>참여자 목록</p>
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {participants.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '1rem' }}>아직 참여자가 없습니다.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)' }}>
                    {['#', '이름', '부서', '참여 시각'].map((h) => (
                      <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--muted)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...participants].reverse().map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 18px', fontSize: '0.875rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{p.id}</td>
                      <td style={{ padding: '12px 18px', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{p.name}</td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{ background: `${DEPT_COLORS[p.department] ?? '#8A8AAF'}20`, color: DEPT_COLORS[p.department] ?? '#8A8AAF', border: `1.5px solid ${DEPT_COLORS[p.department] ?? '#8A8AAF'}`, borderRadius: 999, padding: '3px 12px', fontSize: '0.8125rem', fontWeight: 700 }}>
                          {p.department}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px', fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--muted)' }}>
                        {new Date(p.joined_at).toLocaleTimeString('ko-KR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Responses */}
        <section style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '2px solid var(--border)', background: 'var(--surface2)' }}>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Epilogue 응답</p>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {responses.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '1rem' }}>응답 없음</div>
            ) : responses.map((r, i) => (
              <div key={i} style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, flexShrink: 0,
                  background: r.question_type === 'pain_point' ? '#EDE8FF' : '#D0FFF5',
                  color: r.question_type === 'pain_point' ? '#6C3BF5' : '#00C9A7',
                  border: `1.5px solid ${r.question_type === 'pain_point' ? '#6C3BF5' : '#00C9A7'}`,
                }}>
                  {r.question_type === 'pain_point' ? 'Q1 불편함' : 'Q2 자동화'}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: 500, lineHeight: 1.6 }}>{r.response_text}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
