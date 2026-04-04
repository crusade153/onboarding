'use client';

import Link from 'next/link';

interface NavBarProps {
  current: string; // e.g. 'Part 1'
  step?: string;   // e.g. '01/04'
}

const STEPS = [
  { label: 'Prologue', href: '/prologue', short: '00' },
  { label: 'Part 1',   href: '/part1',   short: '01' },
  { label: 'Part 2',   href: '/part2',   short: '02' },
  { label: 'Part 3',   href: '/part3',   short: '03' },
  { label: 'Epilogue', href: '/epilogue', short: '04' },
];

export default function NavBar({ current, step }: NavBarProps) {
  const currentIdx = STEPS.findIndex((s) => s.label === current);
  const prevStep = currentIdx > 0 ? STEPS[currentIdx - 1] : null;
  const nextStep = currentIdx < STEPS.length - 1 ? STEPS[currentIdx + 1] : null;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(7,11,24,0.85)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 0, height: 56 }}>

        {/* Left: Logo + Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: '#C9A84C' }}>Systema</span>
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1rem' }}>/</span>
          {prevStep ? (
            <Link href={prevStep.href} style={{
              display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
              color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', fontWeight: 600,
              padding: '5px 12px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              transition: 'all 0.15s',
            }}>
              ← {prevStep.label}
            </Link>
          ) : (
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
              color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', fontWeight: 600,
              padding: '5px 12px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
            }}>
              ← 목차
            </Link>
          )}
        </div>

        {/* Center: Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {STEPS.map((s, i) => {
            const isActive = s.label === current;
            const isPast = i < currentIdx;
            return (
              <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 8,
                  background: isActive ? 'rgba(201,168,76,0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(201,168,76,0.4)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
                    background: isActive ? '#C9A84C' : isPast ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.18)',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700,
                    color: isActive ? '#C9A84C' : isPast ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.02em',
                  }}>
                    {s.short}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right: Next + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.01em' }}>
            {current}
          </span>
          {step && (
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{step}</span>
          )}
          {nextStep && (
            <Link href={nextStep.href} style={{
              display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
              color: '#C9A84C', fontSize: '0.875rem', fontWeight: 700,
              padding: '5px 14px', borderRadius: 8,
              border: '1px solid rgba(201,168,76,0.35)',
              background: 'rgba(201,168,76,0.08)',
              transition: 'all 0.15s',
            }}>
              {nextStep.label} →
            </Link>
          )}
          <Link href="/admin" style={{
            color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
            padding: '5px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)',
          }}>
            ⚙
          </Link>
        </div>
      </div>
    </nav>
  );
}
