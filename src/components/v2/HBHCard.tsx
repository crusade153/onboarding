'use client';

interface Props {
  num: string;
  title: string;
  oneliner: string;
  action: string;
  accent: string;
  emoji: string;
}

export default function HBHCard({ num, title, oneliner, action, accent, emoji }: Props) {
  return (
    <div className="glass-card" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{
          fontFamily: 'monospace', fontWeight: 900, fontSize: '1.875rem',
          color: accent, lineHeight: 1, minWidth: 32,
        }}>
          {num}
        </span>
        <span style={{ fontSize: '1.875rem' }}>{emoji}</span>
      </div>

      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, fontStyle: 'italic' }}>
          &ldquo;{oneliner}&rdquo;
        </p>
      </div>

      <div style={{
        marginTop: 'auto',
        padding: '12px 14px',
        background: `${accent}12`,
        borderRadius: 10,
      }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: accent, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          내일 할 수 있는 1가지
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6, fontWeight: 600 }}>
          {action}
        </p>
      </div>
    </div>
  );
}
