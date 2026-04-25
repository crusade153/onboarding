'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

// 전체 진행 시퀀스 정의
const SEQUENCE = [
  { path: '/prologue', label: 'Prologue' },
  { path: '/part1', label: 'Part 1' },
  { path: '/part2', label: 'Part 2' },
  { path: '/part3', label: 'Part 3' },
  { path: '/epilogue', label: 'Epilogue' },
];

export default function NavBar({ current, step }: { current: string; step?: string }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // 현재 경로를 기반으로 이전/다음 페이지 계산
  const currentIndex = SEQUENCE.findIndex(item => item.path === pathname);
  const prev = currentIndex > 0 ? SEQUENCE[currentIndex - 1] : null;
  const next = currentIndex !== -1 && currentIndex < SEQUENCE.length - 1 ? SEQUENCE[currentIndex + 1] : null;

  // 🌟 모니터 양옆에 붙지 않는 '플로팅 아일랜드(Floating Island)' 네비게이션
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 28px', 
      marginTop: '24px', /* 화면 최상단에서 살짝 띄움 */
      marginBottom: '32px', /* 콘텐츠와의 간격 확보 */
      borderRadius: '24px', /* 네비게이션 바 전체를 알약처럼 둥글게 */
      border: '1px solid var(--glass-border)',
      background: 'var(--glass)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      position: 'sticky',
      top: '24px', /* 스크롤을 내려도 상단에서 24px 띄워진 채로 예쁘게 고정됨 */
      zIndex: 50,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.4s ease'
    }}>
      {/* 왼쪽: 로고 및 현재 파트 뱃지 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: '1.125rem', color: 'var(--text)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          SYSTEM <span style={{ color: 'var(--gold)' }}>INNOVATION</span>
        </Link>
        <span className="badge" style={{ color: 'var(--gold)', borderColor: 'var(--gold-dim)', background: 'var(--gold-dim)' }}>
          {current}
        </span>
      </div>
      
      {/* 오른쪽: 네비게이션 컨트롤러 및 테마 토글 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* 시퀀스 네비게이터 */}
        {currentIndex !== -1 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--glass-light)', 
            padding: '4px', 
            borderRadius: '999px', 
            border: '1px solid var(--glass-border)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {/* 이전 버튼 */}
            {prev ? (
              <Link href={prev.path} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer', color: 'var(--text2)', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--glass-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{ opacity: 0.6 }}>←</span> 이전
                </div>
              </Link>
            ) : (
              <div style={{ padding: '6px 14px', width: '64px' }} />
            )}

            {/* 현재 스텝 */}
            {step && (
              <div style={{ padding: '0 12px', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                  {step}
                </span>
              </div>
            )}

            {/* 다음 버튼 */}
            {next ? (
              <Link href={next.path} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer', color: 'var(--text2)', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--glass-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent'; }}>
                  다음 <span style={{ opacity: 0.6 }}>→</span>
                </div>
              </Link>
            ) : (
              <div style={{ padding: '6px 14px', width: '64px' }} />
            )}
          </div>
        )}

        {/* 테마 전환 토글 버튼 */}
        <button 
          onClick={toggleTheme} 
          className="btn-ghost" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            fontSize: '1.25rem',
            border: '1px solid var(--glass-border)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginLeft: '4px'
          }}
          aria-label="테마 전환"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}