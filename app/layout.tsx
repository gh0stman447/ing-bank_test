import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Контур — клиенты и сделки',
  description: 'Рабочее пространство для управления клиентами и сделками',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='ru' className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className='flex min-h-full flex-col bg-slate-50 font-sans text-base text-slate-800 antialiased'>
        {children}
      </body>
    </html>
  );
}
