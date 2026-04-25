'use client';

import { useEffect, useMemo, useState } from 'react';
import NavBar from '@/components/NavBar';

interface Participant {
  id: number;
  name: string;
  department: string;
  entry_motivation: string | null;
  joined_at: string;
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

type Step = 'intro' | 'roll' | 'stats' | 'thanks';

const PERCEPTION_LABELS: Record<string, string> = {
  big_company: '생각보다 큰 회사',
  real_food: '진짜 식품을 만드는 회사',
  data_driven: '데이터로 일하는 회사',
  collaborative: '부서 협업이 중요한 회사',
};

const HABIT_LABELS: Record<string, string> = {
  site_first: '현장경영',
  daily_mgmt: '일일관리',
  tools_means: '수단과 목적의 분리',
  system_org: '시스템으로 일하는 조직',
};

const GRATITUDE_LABELS: Record<string, string> = {
  excel_calc: '엑셀로 수율 계산',
  phone_sync: '부서 간 숫자 맞추는 전화',
  manual_log: '수기 일보 작성',
  overtime: '월말 야근',
};

function topKey(rows: { count: number }[], keyName: string): string | null {
  if (!rows.length) return null;
  const sorted = [...rows].sort((a, b) => b.count - a.count);
  const top = sorted[0] as Record<string, unknown>;
  const v = top[keyName];
  return typeof v === 'string' ? v : null;
}

export default function EpiloguePage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [perception, setPerception] = useState<PerceptionData>({ counts: [], customs: [] });
  const [hbh, setHbh] = useState<HbhData>({ counts: [] });
  const [gratitude, setGratitude] = useState<GratitudeData>({ counts: [] });
  const [step, setStep] = useState<Step>('intro');
  const [motivationIdx, setMotivationIdx] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch('/api/participants').then((r) => r.json()).catch(() => []),
      fetch('/api/perception').then((r) => r.json()).catch(() => ({ counts: [], customs: [] })),
      fetch('/api/hbh').then((r) => r.json()).catch(() => ({ counts: [] })),
      fetch('/api/gratitude').then((r) => r.json()).catch(() => ({ counts: [] })),
    ]).then(([p, per, h, g]) => {
      if (Array.isArray(p)) setParticipants(p);
      setPerception(per);
      setHbh(h);
      setGratitude(g);
    });
  }, []);

  const motivations = useMemo(
    () => participants.filter((p) => p.entry_motivation && p.entry_motivation.trim()),
    [participants]
  );

  // 크레딧 진행 중 입사 동기를 4초마다 회전 노출
  useEffect(() => {
    if (step !== 'roll' || motivations.length === 0) return;
    const t = setInterval(() => {
      setMotivationIdx((i) => (i + 1) % motivations.length);
    }, 4000);
    return () => clearInterval(t);
  }, [step, motivations.length]);

  const groupedCast = participants.reduce((acc, p) => {
    if (!acc[p.department]) acc[p.department] = [];
    acc[p.department].push(p.name);
    return acc;
  }, {} as Record<string, string[]>);

  const rollDuration = Math.max(40, participants.length * 1.5 + 24);

  const totalParticipants = participants.length;
  const perceptionTop = topKey(perception.counts, 'perception_choice');
  const habitTop = topKey(hbh.counts, 'hardest_habit');
  const gratitudeTop = topKey(gratitude.counts, 'saved_from');
  const totalResponses =
    perception.counts.reduce((s, c) => s + c.count, 0) +
    hbh.counts.reduce((s, c) => s + c.count, 0) +
    gratitude.counts.reduce((s, c) => s + c.count, 0);

  const currentMotivation = motivations[motivationIdx];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: step === 'intro' ? 'var(--bg)' : '#000',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 2s ease',
      }}
      onClick={() => {
        if (step === 'roll') setStep('stats');
        else if (step === 'stats') setStep('thanks');
      }}
    >
      {step === 'intro' && <NavBar current="Epilogue" step="04/04" />}

      {step === 'intro' && (
        <div className="slide-container anim-up" style={{ paddingTop: 60, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 56px)' }}>
          <p className="caption" style={{ color: 'var(--gold)', marginBottom: 16 }}>Epilogue · 10분</p>
          <h1 className="display text-gold" style={{ marginBottom: 24, wordBreak: 'keep-all' }}>
            우리 모두의 약속이 지켜질 때
          </h1>
          <p className="body-lg" style={{ color: 'var(--text2)', maxWidth: 760, marginBottom: 40, lineHeight: 1.85, wordBreak: 'keep-all' }}>
            오늘 70분 동안 우리는 — 우리 회사가 어떤 회사인지(<strong style={{ color: '#fff' }}>Part 1</strong>),<br />
            어떻게 일하기로 약속했는지(<strong style={{ color: '#fff' }}>Part 2</strong>),<br />
            그 결과 무엇이 만들어졌는지(<strong style={{ color: '#fff' }}>Part 3</strong>) 함께 보았습니다.<br /><br />
            이제, 오늘 이 자리를 함께 만들어주신 분들을 소개합니다.
          </p>

          <button
            onClick={() => setStep('roll')}
            className="btn btn-gold"
            style={{ padding: '16px 40px', fontSize: '1.125rem', boxShadow: '0 0 30px rgba(201,168,76,0.3)', cursor: 'pointer' }}
          >
            엔딩 크레딧 시작 ▶
          </button>

          <p style={{ marginTop: 24, fontSize: '0.875rem', color: 'var(--text3)' }}>
            크레딧 중 클릭 → 오늘의 SYSTEM INNOVATION 통계로 넘어갑니다.
          </p>
        </div>
      )}

      {step === 'roll' && (
        <>
          {/* 입사 동기 오버레이 — 화면 상단 고정 */}
          {currentMotivation && (
            <div
              key={currentMotivation.id}
              style={{
                position: 'fixed',
                top: '8vh',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
                maxWidth: 720,
                padding: '20px 32px',
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(8px)',
                borderRadius: 16,
                border: '1px solid rgba(201,168,76,0.25)',
                animation: 'fade-in 0.8s ease',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <p style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.2em', marginBottom: 8, fontWeight: 700 }}>
                ENTRY MOTIVATION · {currentMotivation.department}
              </p>
              <p style={{ fontSize: '1.125rem', color: '#fff', lineHeight: 1.6, fontStyle: 'italic', wordBreak: 'keep-all' }}>
                &ldquo;{currentMotivation.entry_motivation}&rdquo;
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#ccc', marginTop: 8, fontWeight: 700, letterSpacing: '0.1em' }}>
                — {currentMotivation.name}
              </p>
            </div>
          )}

          <div
            onAnimationEnd={() => setStep('stats')}
            style={{
              position: 'absolute',
              width: '100%',
              textAlign: 'center',
              animation: `scroll-up ${rollDuration}s linear forwards`,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10vh' }}>
              <div style={{ height: '50vh' }} />

              <div>
                <h2 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--gold)', marginBottom: 32, letterSpacing: '0.1em' }}>
                  SYSTEM INNOVATION
                </h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', lineHeight: 1.8, wordBreak: 'keep-all' }}>
                  하림산업 신규입사자 온보딩
                </p>
              </div>

              <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
                <p style={{ fontSize: '1.25rem', color: '#ccc', lineHeight: 2.2, wordBreak: 'keep-all' }}>
                  여러분이 입력하는 한 글자, 한 숫자가 — <br />
                  내일의 의사결정이 됩니다.
                </p>
              </div>

              <div style={{ marginTop: '10vh' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: 80, letterSpacing: '0.4em', opacity: 0.9 }}>
                  THE CAST
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 80, maxWidth: 900, margin: '0 auto' }}>
                  {Object.entries(groupedCast).length > 0 ? (
                    Object.entries(groupedCast).map(([dept, names]) => (
                      <div key={dept} style={{ display: 'flex', gap: 60, padding: '0 32px' }}>
                        <div style={{ flex: 1, textAlign: 'right', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold-light)', opacity: 0.8, paddingTop: 12 }}>
                          {dept}
                        </div>
                        <div style={{ flex: 1.5, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 32 }}>
                          {names.map((name, i) => (
                            <span key={i} style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', letterSpacing: '0.2em' }}>
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#888', fontSize: '1.5rem' }}>참여자 데이터가 없습니다.</div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '15vh' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: 40, letterSpacing: '0.4em' }}>GENERAL DIRECTOR</h3>
                <div style={{ fontSize: '5rem', color: '#fff', fontWeight: 900, letterSpacing: '0.2em', textShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}>
                  유 경 덕
                </div>
              </div>

              <div style={{ marginTop: '15vh' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: 40, letterSpacing: '0.4em' }}>SYSTEM ARCHITECT</h3>
                <div style={{ fontSize: '4rem', color: '#fff', fontWeight: 900, letterSpacing: '0.15em' }}>원가기획팀</div>
              </div>

              <div style={{ marginTop: '15vh' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: 32, letterSpacing: '0.4em' }}>SPECIAL THANKS TO</h3>
                <div style={{ fontSize: '1.5rem', color: '#ccc', lineHeight: 2 }}>
                  경영진 및 현업 부서 리더<br />
                  그리고 오늘 함께해주신 <span style={{ color: '#fff', fontWeight: 900 }}>하림산업 임직원 여러분</span>
                </div>
              </div>

              <div style={{ height: '80vh' }} />
            </div>
          </div>
        </>
      )}

      {step === 'stats' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, animation: 'fade-in 1.2s ease forwards' }}>
          <div style={{ maxWidth: 960, width: '100%' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gold)', letterSpacing: '0.4em', textAlign: 'center', marginBottom: 16, fontWeight: 800 }}>
              TODAY&rsquo;S SYSTEM INNOVATION
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 48, letterSpacing: '-0.02em' }}>
              오늘의 기록
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 32 }}>
              <StatCard label="참여 인원" value={`${totalParticipants}명`} accent="#C9A84C" />
              <StatCard label="응답 합계" value={`${totalResponses}건`} accent="#2DD4BF" />
              <StatCard
                label="가장 많이 본 회사 인상"
                value={perceptionTop ? PERCEPTION_LABELS[perceptionTop] ?? '—' : '—'}
                accent="#F59E0B"
              />
              <StatCard
                label="가장 어려운 습관"
                value={habitTop ? HABIT_LABELS[habitTop] ?? '—' : '—'}
                accent="#A78BFA"
              />
            </div>

            <div
              style={{
                padding: '28px 32px',
                borderRadius: 20,
                background: 'rgba(45,212,191,0.08)',
                border: '1px solid rgba(45,212,191,0.25)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '0.75rem', color: 'var(--teal)', letterSpacing: '0.3em', fontWeight: 800, marginBottom: 12 }}>
                MOST GRATEFUL FOR
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                {gratitudeTop ? `안 해도 되는 일 — "${GRATITUDE_LABELS[gratitudeTop] ?? gratitudeTop}"` : '—'}
              </p>
            </div>

            <p style={{ marginTop: 40, textAlign: 'center', fontSize: '0.875rem', color: '#888' }}>
              화면을 클릭하면 마지막 인사로 넘어갑니다.
            </p>
          </div>
        </div>
      )}

      {step === 'thanks' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fade-in 4s ease forwards',
            backgroundColor: '#000',
            padding: 32,
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: 700, color: 'var(--gold)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 32, wordBreak: 'keep-all' }}>
            하림산업의 시스템은 —<br />
            우리 모두의 약속이 지켜질 때<br />
            <strong style={{ color: '#fff', fontStyle: 'normal' }}>비로소 빛을 발합니다.</strong>
          </h1>
          <p style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '0.3em' }}>
            SEE YOU AT YOUR DESK.
          </p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-up {
          0% { transform: translateY(100vh); }
          100% { transform: translateY(-100%); }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      ` }} />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      style={{
        padding: '24px 24px',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent}40`,
      }}
    >
      <p style={{ fontSize: '0.75rem', color: accent, letterSpacing: '0.2em', fontWeight: 800, marginBottom: 10 }}>
        {label}
      </p>
      <p style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', color: '#fff', fontWeight: 900, lineHeight: 1.3, wordBreak: 'keep-all' }}>
        {value}
      </p>
    </div>
  );
}
