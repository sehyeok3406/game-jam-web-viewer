import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-sans-kr';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Game Jam! 웹 뷰어', template: '%s · Game Jam!' },
  description: '어디서든 게임 아이디어를 살펴보는 Game Jam! 읽기 전용 웹 뷰어.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f8f7f3',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main">
          본문으로 이동
        </a>
        {children}
      </body>
    </html>
  );
}
