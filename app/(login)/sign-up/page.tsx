import Link from 'next/link';
import { SignUpForm } from './sign-up-form';

export default function SignUp({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <SignUpForm />
      <section className="w-[300px] pt-[30px]">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-bold">
          Sign In
        </Link>
      </section>
    </>
  );
}
