import type {Metadata} from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Readhive - Collect & Read',
  description: 'Collect articles. Read freely. Save them as PDFs for ad-free offline reading.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="font-mono bg-[#E4E3E0] text-black antialiased selection:bg-[#00FF00] selection:text-black" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
