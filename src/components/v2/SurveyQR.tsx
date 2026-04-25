'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

interface Props {
  /** 청중이 이동할 경로 (예: /perception, /hbh, /gratitude) */
  path: string;
  /** 캡션 위에 보여줄 라벨 (예: "Part 1 응답") */
  label: string;
  /** 안내 문구 (예: "1분이면 됩니다") */
  hint?: string;
  /** QR 사이즈 (기본 160) */
  size?: number;
  /** 강조 색상 (기본 gold) */
  accent?: string;
}

interface Session { session_code: string }

/**
 * 활성 세션 코드를 자동으로 가져와서 path에 ?session=CODE를 붙인 QR 코드를 렌더링합니다.
 * 강연자 화면(Part 1/2/3 발표 슬라이드)에 임베드됩니다.
 */
export default function SurveyQR({
  path,
  label,
  hint,
  size = 160,
  accent = 'var(--gold)',
}: Props) {
  const [code, setCode] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((data: { active: Session | null }) => {
        if (data.active) setCode(data.active.session_code);
      })
      .catch(() => { /* silent */ });
  }, []);

  const url = code && origin ? `${origin}${path}?session=${code}` : '';

  return (
    <div className="glass-card" style={{ padding: 24, textAlign: 'center', minWidth: 220 }}>
      <p className="caption" style={{ color: accent, marginBottom: 6 }}>{label}</p>
      <p style={{
        fontFamily: 'monospace', fontWeight: 900, fontSize: '0.9375rem',
        color: accent, letterSpacing: '0.08em', marginBottom: 12,
      }}>
        {code || '— · ————'}
      </p>

      <div style={{
        background: 'white', padding: 12, borderRadius: 10,
        display: 'inline-block', marginBottom: 12,
        opacity: url ? 1 : 0.3,
      }}>
        {url ? (
          <QRCode value={url} size={size} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
        ) : (
          <div style={{
            width: size, height: size, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#999', fontSize: '0.75rem',
          }}>
            세션 대기 중
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.5 }}>
        스마트폰 카메라로 스캔
      </p>
      {hint && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 6, fontStyle: 'italic' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
