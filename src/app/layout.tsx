import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from './providers';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-manrope',
  display: 'swap', 
});

export const metadata: Metadata = {
  title: 'Audiophile | Premium Audio Equipment',
  description:
    'Experience natural, lifelike audio with our premium headphones, speakers, and earphones. Located in the heart of New York City.',
  keywords: [
    'headphones',
    'speakers',
    'earphones',
    'audio',
    'audiophile',
    'premium audio',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}