// src/app/epilogue/page.tsx
'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';

interface Participant {
  id: number;
  name: string;
  department: string;
  joined_at: string;
}

type Step = 'intro' | 'roll' | 'thanks';

export default function EpiloguePage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [step, setStep] = useState<Step>('intro');

  // 1. DB에서 현재까지 참여한 모든 사람의 명단을 실시간으로 가져옵니다.
  useEffect(() => {
    async function fetchParticipants() {
      try {
        const res = await fetch('/api/participants');
        const data = await res.json();
        if (Array.isArray(data)) {
          setParticipants(data);
        }
      } catch (e) {
        console.error('참여자 데이터를 불러오는 중 오류 발생:', e);
      }
    }
    fetchParticipants();
  }, []);

  // 2. 부서별로 참여자 이름을 그룹핑합니다.
  const groupedCast = participants.reduce((acc, p) => {
    if (!acc[p.department]) acc[p.department] = [];
    acc[p.department].push(p.name);
    return acc;
  }, {} as Record<string, string[]>);

  // 3. 참여자 수에 따라 스크롤 속도를 자동으로 조절합니다. (이름이 커졌으므로 계수를 늘렸습니다)
  const rollDuration = Math.max(35, participants.length * 1.5 + 20);

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: step === 'intro' ? 'var(--bg)' : '#000', 
        color: '#fff', 
        position: 'relative', 
        overflow: 'hidden',
        transition: 'background-color 2s ease'
      }}
      onClick={() => {
        // 재생 중 클릭하면 바로 마지막 인사 화면으로 넘어갑니다.
        if (step === 'roll') setStep('thanks');
      }}
    >
      {/* 인트로 상태일 때만 상단 네비게이션 표시 */}
      {step === 'intro' && <NavBar current="Epilogue" step="04/04" />}

      {/* [화면 1] 에필로그 시작 버튼 */}
      {step === 'intro' && (
        <div className="slide-container anim-up" style={{ paddingTop: '100px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 56px)' }}>
          <p className="caption" style={{ color: 'var(--red)', marginBottom: '16px' }}>Epilogue</p>
          <h1 className="display text-gold" style={{ marginBottom: '24px', wordBreak: 'keep-all' }}>시스템은 우리가 함께 세운 '약속'입니다</h1>
          <p className="body-lg" style={{ color: 'var(--text2)', maxWidth: '720px', marginBottom: '48px', lineHeight: 1.8, wordBreak: 'keep-all' }}>
            우리가 확인한 것은 단순한 업무 방식의 변화가 아닙니다.<br/>
            정확한 <strong style={{ color: '#fff' }}>'기준정보'</strong>와 미루지 않는 <strong style={{ color: '#fff' }}>'일일관리'</strong>가 만났을 때,<br/>
            비로소 모두가 같은 숫자를 보는 투명한 업무 환경이 완성된다는 사실을 배웠습니다.<br/><br/>
            이제 이 거대한 가치 사슬을 현장에서 직접 연결하고 작동시켜주실<br/>
            하림산업의 진정한 주역들을 소개합니다.
          </p>
          
          <button 
            onClick={() => setStep('roll')}
            className="btn btn-gold"
            style={{ padding: '16px 40px', fontSize: '1.125rem', boxShadow: '0 0 30px rgba(201,168,76,0.3)', cursor: 'pointer' }}
          >
            가치 사슬의 주역들 보기 (엔딩 크레딧) ▶
          </button>
        </div>
      )}

      {/* [화면 2] 엔딩 크레딧 롤 (실제 영화 효과) */}
      {step === 'roll' && (
        <div 
          onAnimationEnd={() => setStep('thanks')}
          style={{ 
            position: 'absolute', 
            width: '100%', 
            textAlign: 'center',
            animation: `scroll-up ${rollDuration}s linear forwards` 
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10vh' }}>
            <div style={{ height: '50vh' }}></div>

            <div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '32px', letterSpacing: '0.1em' }}>
                신규입사자 온보딩 교육
              </h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', lineHeight: 1.8, wordBreak: 'keep-all' }}>
                개인의 역량으로 버텨온 시대가 있었습니다. 이제는 구조로 일하는 시대입니다.
              </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px' }}>
              <p style={{ fontSize: '1.25rem', color: '#ccc', lineHeight: 2.2, wordBreak: 'keep-all' }}>
                여러분이 입력하는 숫자 하나가, 누군가의 의사결정이 됩니다.<br/>
                그 무게를 기억해주십시오.
              </p>
            </div>

            {/* 참여자 명단 (Cast) */}
            <div style={{ marginTop: '10vh' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '80px', letterSpacing: '0.4em', opacity: 0.9 }}>
                THE CAST (가치 사슬의 주역들)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', maxWidth: '900px', margin: '0 auto' }}>
                {Object.entries(groupedCast).length > 0 ? (
                  Object.entries(groupedCast).map(([dept, names]) => (
                    <div key={dept} style={{ display: 'flex', gap: '60px', padding: '0 32px' }}>
                      {/* 부서명 */}
                      <div style={{ flex: 1, textAlign: 'right', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold-light)', opacity: 0.8, paddingTop: '12px' }}>
                        {dept}
                      </div>
                      {/* 이름 (영화 배우 이름처럼 폰트 대폭 확대) */}
                      <div style={{ flex: 1.5, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '32px' }}>
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

            {/* 제작 정보 (기획자 폰트 대폭 확대) */}
            <div style={{ marginTop: '15vh' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: '40px', letterSpacing: '0.4em' }}>GENERAL DIRECTOR</h3>
              <div style={{ fontSize: '5rem', color: '#fff', fontWeight: 900, letterSpacing: '0.2em', textShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}>유 경 덕</div>
            </div>

            <div style={{ marginTop: '15vh' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: '40px', letterSpacing: '0.4em' }}>SYSTEM ARCHITECT</h3>
              <div style={{ fontSize: '4rem', color: '#fff', fontWeight: 900, letterSpacing: '0.15em' }}>원가 TFT</div>
            </div>

            <div style={{ marginTop: '15vh' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: '32px', letterSpacing: '0.4em' }}>SPECIAL THANKS TO</h3>
              <div style={{ fontSize: '1.5rem', color: '#ccc', lineHeight: 2 }}>
                경영진 및 현업 부서 리더<br/>
                그리고 교육에 끝까지 함께해주신 <span style={{ color: '#fff', fontWeight: 900 }}>하림산업 임직원 여러분</span>
              </div>
            </div>

            <div style={{ height: '80vh' }}></div>
          </div>
        </div>
      )}

      {/* [화면 3] 최종 피날레 화면 */}
      {step === 'thanks' && (
        <div style={{ 
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fade-in 4s ease forwards', backgroundColor: '#000'
        }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', textAlign: 'center', letterSpacing: '0.1em' }}>
            경청해 주셔서 감사합니다.
          </h1>
        </div>
      )}

      {/* 애니메이션 CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-up {
          0% { transform: translateY(100vh); }
          100% { transform: translateY(-100%); }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}