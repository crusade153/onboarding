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

  // 2. 부서별로 참여자 이름을 그룹핑합니다. (마케팅: [홍길동, 김철수]...)
  const groupedCast = participants.reduce((acc, p) => {
    if (!acc[p.department]) acc[p.department] = [];
    acc[p.department].push(p.name);
    return acc;
  }, {} as Record<string, string[]>);

  // 3. 참여자 수에 따라 스크롤 속도를 자동으로 조절합니다. (최소 25초)
  const rollDuration = Math.max(25, participants.length * 0.6 + 20);

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
          <h1 className="display text-gold" style={{ marginBottom: '24px' }}>시스템은 함께 세운 약속</h1>
          <p className="body-lg" style={{ color: 'var(--text2)', maxWidth: '640px', marginBottom: '48px', lineHeight: 1.8 }}>
            우리가 배운 것은 단순한 시스템 사용법이 아닙니다.<br/>
            서로의 업무가 어떻게 숫자로 연결되는지, 그 가치 사슬을 이해하는 과정이었습니다.
          </p>
          
          <button 
            onClick={() => setStep('roll')}
            className="btn btn-gold"
            style={{ padding: '16px 40px', fontSize: '1.125rem', boxShadow: '0 0 30px rgba(201,168,76,0.3)' }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15vh' }}>
            <div style={{ height: '30vh' }}></div>

            <div>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '32px', letterSpacing: '-0.02em' }}>
                Systema
              </h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', lineHeight: 1.8 }}>
                정확한 기준정보가 투명한 손익을 완성합니다.
              </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px' }}>
              <p style={{ fontSize: '1.25rem', color: '#ccc', lineHeight: 2.2, wordBreak: 'keep-all' }}>
                현장으로 돌아가서도 오늘 나눈 시스템의 의미를 되뇌이며,<br/>
                각자의 자리에서 올바른 기준을 지키며 일하는 우리가 되기를 바랍니다.
              </p>
            </div>

            {/* 참여자 명단 (Cast) */}
            <div style={{ marginTop: '5vh' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: '48px', letterSpacing: '0.3em', opacity: 0.9 }}>
                THE CAST (가치 사슬의 주역들)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', maxWidth: '800px', margin: '0 auto' }}>
                {Object.entries(groupedCast).length > 0 ? (
                  Object.entries(groupedCast).map(([dept, names]) => (
                    <div key={dept} style={{ display: 'flex', gap: '40px', padding: '0 32px' }}>
                      <div style={{ flex: 1, textAlign: 'right', fontSize: '1.125rem', fontWeight: 700, color: 'var(--gold-light)', opacity: 0.8 }}>
                        {dept}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left', fontSize: '1.125rem', color: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {names.map((name, i) => <span key={i}>{name}</span>)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#888', fontSize: '1rem' }}>참여자 데이터가 없습니다.</div>
                )}
              </div>
            </div>

            {/* 제작 정보 */}
            <div style={{ marginTop: '5vh' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'var(--gold)', marginBottom: '32px', letterSpacing: '0.3em' }}>DIRECTED BY</h3>
              <div style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>원가기획팀 TFT</div>
            </div>

            <div style={{ marginTop: '2vh' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'var(--gold)', marginBottom: '32px', letterSpacing: '0.3em' }}>SPECIAL THANKS TO</h3>
              <div style={{ fontSize: '1.125rem', color: '#ccc', lineHeight: 2 }}>
                경영진 및 현업 부서 리더<br/>
                그리고 교육에 끝까지 함께해주신 <span style={{ color: '#fff', fontWeight: 700 }}>여러분</span>
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
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', textAlign: 'center' }}>
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