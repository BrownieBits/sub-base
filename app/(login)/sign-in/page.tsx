import Link from 'next/link';
import { SignInForm } from './sign-in-form';
import { Logo } from '@/components/sb-ui/Logo';

export default function SignIn({
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
            Need an account?{' '}
            <Link href="/sign-up" className="font-bold">
              Sign Up
            </Link>
          </section>
        </section>
      </section>
      <section className="w-full flex flex-col justify-center items-center">
        <h1 className="mb-[30px]">Sign In</h1>
        <SignInForm />
      </section>
      <section className="w-full h-[53px] md:h-[61px]"></section>
    </section>
  );
}
