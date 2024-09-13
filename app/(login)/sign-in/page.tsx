import { Logo } from '@/components/sb-ui/Logo';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { SignInForm } from './sign-in-form';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Sign In`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/sign-in/`,
      title: `Sign In`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Sign In`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default function SignIn({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const country = headers().get('x-geo-country') as string;
  const city = headers().get('x-geo-city') as string;
  const region = headers().get('x-geo-region') as string;
  const ip = headers().get('x-ip') as string;

  return (
    <section className="w-full flex flex-col justify-between">
      <section className="w-full flex justify-between items-center">
        <section className="w- md:w-[150px]">
          <Logo url="/" />
        </section>
        <section className="">
          <section className="">
            Need an account?{' '}
            <Link href="/sign-up" className="font-bold">
              Sign Up
            </Link>
          </section>
        </section>
      </section>
      <section className="w-full flex flex-col justify-center items-center">
        <h1 className="mb-8">Sign In</h1>
        <SignInForm country={country} city={city} region={region} ip={ip} />
      </section>
      <section className="w-full h-[53px] md:h-[61px]"></section>
    </section>
  );
}
