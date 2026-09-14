import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '벗밭 · 소감 DB',
  description: '벗밭 프로그램 참가자들의 소감을 모으고 쌓아두는 DB 페이지.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans">{children}</body>
    </html>
  );
}
