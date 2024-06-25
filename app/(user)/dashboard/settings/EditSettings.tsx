'use client';

import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { currency_list } from '@/lib/CurrencyList';
import { UserSettings } from './typedef';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import EditAddresses from './EditAddresses';
import { revalidate } from './actions';

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
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [selectedName, setSelectedName] = React.useState<string>(
    props.userSettings.name
  );
  const [selectedPhone, setSelectedPhone] = React.useState<string>(
    props.userSettings.phone
  );
  const [selectedDefaultCurrency, setSelectedDefaultCurrency] =
    React.useState<string>(props.userSettings.default_currency);

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

    setDisabled(true);
    await updateDoc(docRef, {
      name: selectedName,
      phone: selectedPhone,
      default_currency: selectedDefaultCurrency,
    });
    revalidate();
    toast('User Updated', {
      description: 'Your user info has been updated.',
    });
  }
  async function updateForm(event: any) {
    if (
      event !== null &&
      event.target !== undefined &&
      event.target.name! === 'name'
    ) {
      setSelectedName(event.target.value);
    } else if (
      event !== null &&
      event.target != undefined &&
      event.target.name! === 'phone'
    ) {
      setSelectedPhone(event.target.value);
    } else if (event !== null && typeof event === 'string') {
      setSelectedDefaultCurrency(event);
    }
  }
  async function updateSave() {
    if (
      selectedName !== props.userSettings.name ||
      selectedPhone !== props.userSettings.phone ||
      selectedDefaultCurrency !== props.userSettings.default_currency
    ) {
      setDisabled(false);
    } else if (
      selectedName === props.userSettings.name &&
      selectedPhone === props.userSettings.phone &&
      selectedDefaultCurrency === props.userSettings.default_currency
    ) {
      setDisabled(true);
    }
  }

  React.useEffect(() => {
    form.setValue('name', props.userSettings.name);
    form.setValue('email', props.userSettings.email);
    form.setValue('phone', props.userSettings.phone);
    form.setValue('default_currency', props.userSettings.default_currency);
  }, [props.userSettings]);

  React.useEffect(() => {
    updateSave();
  }, [selectedName, selectedPhone, selectedDefaultCurrency]);

  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Settings</h1>
          <div className="flex gap-[15px] items-center">
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
        <section className="flex flex-col px-[15px] pt-[15px] pb-[30px] w-full gap-[30px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <section className="flex flex-col md:flex-row gap-[30px]">
                <aside className="w-full md:w-[400px] lg:w-[600px]">
                  <p className="pb-[15px]">
                    <b>Profile</b>
                  </p>
                  <p>
                    This is your basic information like Name, Email, Phone, and
                    more that we will use in various locations on the site.
                  </p>
                </aside>
                <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={updateForm}
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
                            onChangeCapture={updateForm}
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
                            onChangeCapture={updateForm}
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
                          onValueChange={updateForm}
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

          <section className="flex flex-col md:flex-row gap-[30px]">
            <aside className="w-full md:w-[400px] lg:w-[600px]">
              <p className="pb-[15px]">
                <b>Saved Credit Cards</b>
              </p>
              <p>
                These are cards we can use for quicker checkouts or for
                subscription based services.
              </p>
            </aside>
            <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
              <p>TODO: Fill in once connected to stripe</p>
            </aside>
          </section>
        </section>
      </section>
    </section>
  );
}
