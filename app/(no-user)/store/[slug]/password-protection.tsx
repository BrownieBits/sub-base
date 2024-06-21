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
import { setCookie } from 'cookies-next';

const formSchema = z.object({
  passwords: z
    .object({
      password: z
        .string()
        .min(1, { message: 'Password must be 1 or more characters long' })
        .max(32, {
          message: 'Password must be no more than 32 characters long',
        }),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Passwords don't match",
      path: ['password'], // path of error
    }),
});

export function StorePasswordForm(props: {
  revalidate: () => void;
  pw: string;
  cookieSlug: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passwords: {
        password: '',
        confirm: props.pw,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setCookie(props.cookieSlug, props.pw);
    props.revalidate();
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-[300px]"
        >
          <FormField
            control={form.control}
            name="passwords.password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
