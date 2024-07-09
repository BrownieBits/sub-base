import { Logo } from '@/components/sb-ui/Logo';
import { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from './sign-up-form';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Sign Up - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://sub-base.vercel.app/sign-up/`,
      title: `Sign Up - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Sign Up - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default function SignUp({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <section className="w-full flex flex-col justify-between">
      <section className="w-full flex justify-between items-center">
        <section className="w-[32px] md:w-[150px]">
          <Logo url="/" />
        </section>
        <section className="">
          <section className="">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-bold">
              Sign In
            </Link>
          </section>
        </section>
      </section>
      <section className="w-full flex flex-col justify-center items-center">
        <h1 className="mb-[30px]">Sign Up</h1>
        <SignUpForm />
      </section>
      <section className="w-full h-[53px] md:h-[61px]"></section>
    </section>
  );
}
