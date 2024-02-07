import Link from 'next/link';
import { SignInForm } from './sign-in-form';

export default function SignIn({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <SignInForm />
      <section className="w-[300px] pt-[30px]">
        Need an account?{' '}
        <Link href="/sign-up" className="font-bold">
          Sign Up
        </Link>
      </section>
    </>
  );
}
