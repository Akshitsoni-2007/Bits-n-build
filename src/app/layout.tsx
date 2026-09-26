import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ConsoleShell from '@/components/ConsoleShell';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nirikshan — Crime Analytics & Decision Support Console',
  description: 'Authorized analyst console for exploring historical incident patterns and spatial-temporal decision support indicators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark h-full bg-[#050201] text-white`}>
      <body className="min-h-full flex flex-col bg-[#050201] text-[#FFFFFF] antialiased selection:bg-[#c82a2a]/30 selection:text-white">
        <ConsoleShell>{children}</ConsoleShell>
      </body>
    </html>
  );
}
