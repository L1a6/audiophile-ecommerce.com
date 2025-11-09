"use client"

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

        <style jsx global>{`
          html, body {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          main, .container, .section, .wrapper {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }

          img {
            max-width: 100%;
            height: auto;
            display: block;
          }

          /* Desktop-specific adjustments */
          @media (min-width: 1024px) {
            .container, .section, .wrapper {
              max-width: 1200px;
            }
          }

          /* Mobile-specific adjustments */
          @media (max-width: 768px) {
            .container, .section, .wrapper {
              padding: 0 1rem;
            }
          }

          /* Flex wrapper defaults */
          .parent {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            width: 100%;
          }
        `}</style>
      </body>
    </html>
  );
}