import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '벗밭 · 식사 체크리스트',
  description: '벗밭의 식사 체크리스트 설문에 답하고 나에게 맞는 교육 프로그램을 추천받아보세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans">{children}</body>
    </html>
  );
}
