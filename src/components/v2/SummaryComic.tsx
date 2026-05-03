import Image from 'next/image';

interface SummaryComicProps {
  title: string;
  imageSrc: string;
  alt: string;
  takeaway: string;
  accent?: string;
  dark?: boolean;
}

export default function SummaryComic({
  title,
  imageSrc,
  alt,
  takeaway,
  accent = 'var(--gold)',
  dark = false,
}: SummaryComicProps) {
  return (
    <section
      className="glass-card anim-up"
      style={{
        padding: 28,
        marginTop: 32,
        background: dark ? 'rgba(255,255,255,0.055)' : 'var(--glass)',
        boxShadow: dark ? '0 18px 70px rgba(0,0,0,0.45)' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 18, flexWrap: 'wrap' }}>
        <div>
          <p className="caption" style={{ color: accent, marginBottom: 8 }}>마무리 4컷</p>
          <h2 style={{ fontSize: 'clamp(1.25rem, 2.3vw, 1.75rem)', fontWeight: 900, color: dark ? '#fff' : 'var(--text)', lineHeight: 1.35, wordBreak: 'keep-all' }}>
            {title}
          </h2>
        </div>
        <p style={{ fontSize: '0.8125rem', color: dark ? '#999' : 'var(--text3)', fontWeight: 700 }}>
          가볍게 훑고 다음 파트로
        </p>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 960px"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <p style={{ marginTop: 18, color: dark ? '#d1d5db' : 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, wordBreak: 'keep-all', fontWeight: 600 }}>
        {takeaway}
      </p>
    </section>
  );
}
