import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cardnews Maker',
  description: '카드뉴스 제작을 위한 시작 템플릿',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
