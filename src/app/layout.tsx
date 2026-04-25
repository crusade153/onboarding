import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'System Innovation — 하림산업 신규입사자 온보딩',
  description: '데이터와 가치 사슬로 읽는 하림산업',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>
          <div style={{
            maxWidth: '1360px',
            width: '100%',
            margin: '0 auto',
            padding: '0 40px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
