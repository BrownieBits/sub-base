'use client';

import { db } from '@/lib/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentReference, doc } from 'firebase/firestore';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

//Email
//Email me News and Offers
//Country
//First Name
//Last Name
//Company
//Address
//Apartment, suite, etc(Optional)
//City
//State
//Postal
//Phone (optional)
const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  offers: z.boolean(),

  first_name: z.string().min(1, { message: 'First Name is required' }),
  last_name: z.string().min(1, { message: 'Last Name is required' }),

  addressLine1: z
    .string()
    .min(1, { message: 'Address Line 1 must be 1 or more characters long' }),
  addressLine2: z.string().optional(),
  city: z.string().min(1, { message: 'City is a required field' }),
  province: z
    .string()
    .min(1, { message: 'State/Province is a required field' }),
  country: z.string().min(1, { message: 'Country is a required field' }),
  postal: z.string().min(1, { message: 'Postal Code is a required field' }),

  phone: z
    .string()
    .refine(
      isValidPhoneNumber,
      'Please specify a valid phone number (include the international prefix).'
    )
    .transform((value) => parsePhoneNumber(value).number.toString()),
});

export default function AddressForm(props: { userID: string }) {
  const [disabled, setDisabled] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit() {
    const docRef: DocumentReference = doc(db, 'users', props.userID);
    try {
      //   setDisabled(true);
      //   await updateDoc(docRef, {
      //     name: form.getValues('name'),
      //     phone: form.getValues('phone'),
      //     default_currency: form.getValues('default_currency'),
      //   });
      //   setDisabled(false);
      //   revalidate();
      //   toast.success('User Updated', {
      //     description: 'Your user info has been updated.',
      //   });
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
    <section className="w-full h-[200px] border rounded bg-layer-one">
      {/* <section className="w-full max-w-[1754px] mx-auto">
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
      </section> */}
    </section>
  );
}
