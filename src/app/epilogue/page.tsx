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

  // DB에서 참여자 명단 가져오기
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

  // 부서별로 참여자 이름 그룹핑 (마케팅: [홍길동, 김철수], 영업: [이영희...])
  const groupedCast = participants.reduce((acc, p) => {
    if (!acc[p.department]) acc[p.department] = [];
    acc[p.department].push(p.name);
    return acc;
  }, {} as Record<string, string[]>);

  // 스크롤 지속 시간 계산 (참여자가 많을수록 천천히 올라감. 최소 25초)
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
        // 재생 중 클릭 시 스킵 기능
        if (step === 'roll') setStep('thanks');
      }}
    >
      {/* 인트로 상태일 때만 네비게이션 바 표시 */}
      {step === 'intro' && <NavBar current="Epilogue" step="04/04" />}

      {/* 1. 인트로 화면 */}
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

      {/* 2. 엔딩 크레딧 롤 화면 */}
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
            
            {/* 시작 여백 */}
            <div style={{ height: '30vh' }}></div>

            {/* 메인 타이틀 & 핵심 가치 */}
            <div>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '32px', letterSpacing: '-0.02em' }}>
                Systema
              </h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', lineHeight: 1.8 }}>
                정확한 기준정보가 투명한 손익을 완성합니다.
              </p>
            </div>

            {/* 캐치프레이즈 */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px' }}>
              <p style={{ fontSize: '1.25rem', color: '#ccc', lineHeight: 2.2, wordBreak: 'keep-all' }}>
                현장으로 돌아가서도 오늘 나눈 시스템의 의미를 되뇌이며,<br/>
                각자의 자리에서 올바른 기준을 지키며 일하는<br/>
                우리가 되기를 바랍니다.
              </p>
            </div>

            {/* CAST (참여자 목록) */}
            <div style={{ marginTop: '5vh' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: '48px', letterSpacing: '0.3em', opacity: 0.9 }}>
                THE CAST (가치 사슬의 주역들)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', maxWidth: '800px', margin: '0 auto' }}>
                {Object.entries(groupedCast).length > 0 ? (
                  Object.entries(groupedCast).map(([dept, names]) => (
                    <div key={dept} style={{ display: 'flex', gap: '40px', padding: '0 32px' }}>
                      <div style={{ flex: 1, textAlign: 'right', fontSize: '1.125rem', fontWeight: 700, color: 'var(--gold-light)', opacity: 0.8, letterSpacing: '0.05em' }}>
                        {dept}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left', fontSize: '1.125rem', color: '#fff', display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: 500 }}>
                        {names.map((name, i) => <span key={i}>{name}</span>)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#888', fontSize: '1rem' }}>참여자 데이터가 없습니다.</div>
                )}
              </div>
            </div>

            {/* CREW */}
            <div style={{ marginTop: '5vh' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'var(--gold)', marginBottom: '32px', letterSpacing: '0.3em', opacity: 0.9 }}>
                DIRECTED BY
              </h3>
              <div style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700, letterSpacing: '0.1em' }}>
                원가기획팀 TFT
              </div>
            </div>

            {/* SPECIAL THANKS */}
            <div style={{ marginTop: '2vh' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'var(--gold)', marginBottom: '32px', letterSpacing: '0.3em', opacity: 0.9 }}>
                SPECIAL THANKS TO
              </h3>
              <div style={{ fontSize: '1.125rem', color: '#ccc', fontWeight: 500, lineHeight: 2 }}>
                경영진 및 현업 부서 리더<br/>
                그리고 교육에 끝까지 함께해주신<br/>
                <span style={{ color: '#fff', fontWeight: 700 }}>여러분</span>
              </div>
            </div>

            {/* 종료 여백 (글씨가 화면 위로 완전히 빠져나가도록) */}
            <div style={{ height: '80vh' }}></div>

          </div>
        </div>
      )}

      {/* 3. 땡스 화면 (최종 마무리) */}
      {step === 'thanks' && (
        <div style={{ 
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fade-in 4s ease forwards', backgroundColor: '#000'
        }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', textAlign: 'center', lineHeight: 1.6 }}>
            경청해 주셔서 고맙습니다.
          </h1>
        </div>
      )}

      {/* 전역 애니메이션 스타일 주입 */}
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
      
      {/* 재생 중 우측 하단에 스킵 안내 문구 */}
      {step === 'roll' && (
        <div style={{ position: 'fixed', bottom: '24px', right: '32px', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', zIndex: 10 }}>
          화면을 클릭하면 건너뜁니다
        </div>
      )}
    </div>
  );
}