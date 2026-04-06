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
          {/* 보안 접속 래퍼 */}
          <PinAuth>
            {/* 🌟 핵심 수정: 너무 좁았던 1080px을 가장 쾌적한 1360px로 변경, 좌우 패딩을 주어 유연하게 대응 */}
            <div style={{ 
              maxWidth: '1360px', 
              width: '100%', 
              margin: '0 auto', 
              padding: '0 40px', /* 브라우저 창을 줄였을 때의 최소 여백 확보 */
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