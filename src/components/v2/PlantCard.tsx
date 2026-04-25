'use client';

interface Props {
  code: string;
  name: string;
  products: string;
  lines: string;
  capacity: string;
  metaphor: string;
  accent: string;
}

export default function PlantCard({ code, name, products, lines, capacity, metaphor, accent }: Props) {
  return (
    <div className="glass-card" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{
          fontFamily: 'monospace', fontWeight: 900, fontSize: '2.25rem',
          color: accent, letterSpacing: '-0.02em', lineHeight: 1,
        }}>
          {code}
        </span>
        <div>
          <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {name}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text3)', fontWeight: 600 }}>{products}</p>
        </div>
      </div>

      {/* 메트릭 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', background: 'var(--glass-light)', borderRadius: 12 }}>
        <Row label="라인" value={lines} />
        <Row label="일 생산 능력" value={capacity} accent={accent} bold />
      </div>

      {/* 비유 */}
      <p style={{
        fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7,
        fontStyle: 'italic', wordBreak: 'keep-all',
        borderLeft: `2px solid ${accent}66`, paddingLeft: 12,
      }}>
        &ldquo;{metaphor}&rdquo;
      </p>
    </div>
  );
}

function Row({ label, value, accent, bold }: { label: string; value: string; accent?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.8125rem', color: 'var(--text3)', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{
        fontSize: bold ? '1.0625rem' : '0.9375rem',
        fontWeight: bold ? 800 : 600,
        color: accent ?? 'var(--text)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  );
}
