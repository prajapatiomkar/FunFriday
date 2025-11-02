import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fun Friday - Team Games',
  description: 'Play games and enjoy with your team',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
