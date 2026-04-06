import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import PinAuth from '@/components/PinAuth';

export const metadata: Metadata = {
  title: 'Systema - 하림산업 기준정보 온보딩',
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
          {/* 🌟 보안 접속 래퍼 추가: 인증되지 않으면 이 안의 내용은 랜더링되지 않음 */}
          <PinAuth>
            <div style={{ 
              maxWidth: '1080px', 
              width: '100%', 
              margin: '0 auto', 
              padding: '0 24px', 
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {children}
            </div>
          </PinAuth>
        </ThemeProvider>
      </body>
    </html>
  );
}