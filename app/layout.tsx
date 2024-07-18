import { ThemeProvider } from '@/components/sb-ui/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { draftMode, headers } from 'next/headers';
import Link from 'next/link';
import Script from 'next/script';
import AuthState from './components/sb-ui/AuthState';
import './globals.css';
import CookieConsent from './lib/consent';
config.autoAddCss = false;

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/`,
      title: `SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
    keywords: 'e-commerce, shopping, creators, social, products',
    referrer: 'origin',
    publisher: 'SubBase',
    creator: 'SubBase',
    robots: 'index, follow',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function clearDraft() {
    'use server';
    draftMode().disable();
  }
  const pathname = headers().get('x-pathname') as string;
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {draftMode().isEnabled ? (
            <section className="draftMode">
              <Link
                prefetch={false}
                href={`/api/exit-preview?redirect=${pathname}`}
              >
                Exit Draftmode
              </Link>
            </section>
          ) : (
            <></>
          )}
          {children}
          <CookieConsent />
        </ThemeProvider>
        <Toaster />
        <AuthState />
        <Script
          src="https://kit.fontawesome.com/fd72af6caf.js"
          crossOrigin="anonymous"
        ></Script>
      </body>
    </html>
  );
}
