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

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 32px', 
      borderBottom: '1px solid var(--glass-border)',
      background: 'var(--bg)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'background-color 0.4s ease, border-color 0.4s ease'
    }}>
      {/* 왼쪽: 로고 및 현재 파트 뱃지 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          SYSTEMA
        </Link>
        <span className="badge" style={{ color: 'var(--gold)', borderColor: 'var(--gold-dim)', background: 'var(--gold-dim)' }}>
          {current}
        </span>
      </div>
      
      {/* 오른쪽: 네비게이션 컨트롤러 및 테마 토글 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* 시퀀스 네비게이터 (현재 경로가 SEQUENCE 안에 있을 때만 표시) */}
        {currentIndex !== -1 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--glass-light)', 
            padding: '4px', 
            borderRadius: '999px', 
            border: '1px solid var(--glass-border)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            {/* 이전 버튼 */}
            {prev ? (
              <Link href={prev.path} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer', color: 'var(--text2)', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--glass-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{ opacity: 0.6 }}>←</span> 이전
                </div>
              </Link>
            ) : (
              <div style={{ padding: '6px 14px', width: '65px' }} /> // 영역 유지를 위한 빈 박스
            )}

            {/* 현재 스텝 */}
            {step && (
              <div style={{ padding: '0 12px', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                  {step}
                </span>
              </div>
            )}

            {/* 다음 버튼 */}
            {next ? (
              <Link href={next.path} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer', color: 'var(--text2)', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--glass-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent'; }}>
                  다음 <span style={{ opacity: 0.6 }}>→</span>
                </div>
              </Link>
            ) : (
              <div style={{ padding: '6px 14px', width: '65px' }} />
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
            fontSize: '1.125rem',
            border: '1px solid var(--glass-border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginLeft: '8px'
          }}
          aria-label="테마 전환"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}