import { ThemeProvider } from '@/components/sb-ui/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata } from 'next';
// import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { draftMode, headers } from 'next/headers';
import Link from 'next/link';
import Script from 'next/script';
import AuthState from './components/sb-ui/AuthState';
import './globals.css';
import CookieConsent from './lib/consent';
import { analytics } from './lib/firebase';
config.autoAddCss = false;

// const fontSans = FontSans({
//   subsets: ['latin'],
//   variable: '--font-sans',
// });
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: '%s - SubPort Creator Platform',
      default: `SubPort Creator Platform`, // a default is required when creating a template
    },
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/`,
      title: {
        template: '%s - SubPort Creator Platform',
        default: `SubPort Creator Platform`, // a default is required when creating a template
      },
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      title: {
        template: '%s - SubPort Creator Platform',
        default: `SubPort Creator Platform`, // a default is required when creating a template
      },
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      site: 'SubPort Creator Platform',
    },
    keywords: 'e-commerce, shopping, creators, social, products',
    referrer: 'origin',
    publisher: 'SubPort',
    creator: 'SubPort',
    robots: 'index, follow',
    icons: ['/favicon.svg'],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  analytics;

  const pathname = headers().get('x-pathname') as string;

  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-background ${geistSans.variable} ${geistMono.variable} antialiased`}
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
