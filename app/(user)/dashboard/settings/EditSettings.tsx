'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { currency_list } from '@/lib/CurrencyList';
import { db } from '@/lib/firebase';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentReference, doc, updateDoc } from 'firebase/firestore';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import EditAddresses from './EditAddresses';
import { revalidate } from './actions';
import { UserSettings } from './typedef';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Full Name must be 1 or more characters long' })
    .refine(
      (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ''),
      'Name should contain only alphabets'
    )
    .refine(
      (value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value ?? ''),
      'Please enter both firstname and lastname'
    ),
  email: z.string(),
  phone: z
    .string()
    .refine(
      isValidPhoneNumber,
      'Please specify a valid phone number (include the international prefix).'
    )
    .transform((value) => parsePhoneNumber(value).number.toString()),
  default_currency: z.string(),
});

export default function EditSettings(props: {
  userID: string;
  userSettings: UserSettings;
}) {
  const [disabled, setDisabled] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.userSettings.name,
      email: props.userSettings.email,
      phone: props.userSettings.phone,
      default_currency: props.userSettings.default_currency,
    },
  });

  async function onSubmit() {
    const docRef: DocumentReference = doc(db, 'users', props.userID);
    try {
      setDisabled(true);
      await updateDoc(docRef, {
        name: form.getValues('name'),
        phone: form.getValues('phone'),
        default_currency: form.getValues('default_currency'),
      });
      setDisabled(false);
      revalidate();
      toast.success('User Updated', {
        description: 'Your user info has been updated.',
      });
    } catch (error) {
      console.error(error);
      setDisabled(false);
      toast.error('Update Error', {
        description:
          'Something went wrong while updating your user info. Please try again',
      });
    }
  }

  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-8 gap-4">
          <h1>Settings</h1>
          <div className="flex gap-4 items-center">
            {disabled ? (
              <></>
            ) : (
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                asChild
              >
                <div>
                  <FontAwesomeIcon className="icon mr-[5px]" icon={faSave} />
                  Save
                </div>
              </Button>
            )}
          </div>
        </section>
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex flex-col px-4 py-8 w-full gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <section className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-[400px] lg:w-[600px]">
                  <p className="pb-4">
                    <b>Profile</b>
                  </p>
                  <p>
                    This is your basic information like Name, Email, Phone, and
                    more that we will use in various locations on the site.
                  </p>
                </aside>
                <aside className="w-full flex flex1 flex-col gap-8 bg-layer-one p-8 rounded drop-shadow">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="email"
                            type="email"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="phone"
                            type="phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="default_currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a default currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currency_list.map((item: any, i: number) => {
                              return (
                                <SelectItem
                                  value={item.value}
                                  key={`currency-item-${i}`}
                                >
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </aside>
              </section>
            </form>
          </Form>

          <EditAddresses
            addresses={props.userSettings.addresses}
            default_address={props.userSettings.default_address}
            userID={props.userID}
          />

          <section className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-[400px] lg:w-[600px]">
              <p className="pb-4">
                <b>Saved Credit Cards</b>
              </p>
              <p>
                These are cards we can use for quicker checkouts or for
                subscription based services.
              </p>
            </aside>
            <aside className="w-full flex flex1 flex-col gap-8 bg-layer-one p-8 rounded drop-shadow">
              <p>TODO: Fill in once connected to stripe</p>
            </aside>
          </section>
        </section>
      </section>
    </section>
  );
}
