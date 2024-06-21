'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be 8 or more characters long' })
    .max(18, { message: 'Password must be no more than 18 characters long' })
    .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
    .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
    .regex(new RegExp('.*\\d.*'), 'One number')
    .regex(
      new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
      'One special character'
    ),
});

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loggedInUser, userLoading, userError] = useAuthState(auth);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signInWithEmailAndPassword(values.email, values.password);
    const redirectParam = searchParams.get('redirect');
    if (redirectParam !== null) {
      router.push(redirectParam);
      return;
    }
    router.push('/dashboard');
  }

  useEffect(() => {
    if (loggedInUser) {
      redirect(`/dashboard`);
    }
  }, [userLoading]);

  return (
    <>
      {userLoading ? (
        <></>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-[300px]"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? <p className="text-destructive">{error.code}</p> : <></>}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}
    </>
  );
}
