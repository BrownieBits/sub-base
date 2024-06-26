'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import React from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCalendar } from '@fortawesome/free-solid-svg-icons';
import {
  CollectionReference,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useFormStatus } from 'react-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { revalidate } from './actions';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Code must be 3 or more characters long' })
    .max(18, {
      message: 'Code must be no more than 18 characters long',
    })
    .refine((s) => !s.includes(' '), 'Code must contain no spaces'),
  type: z.enum(['Flat Amount', 'Percentage'], {
    required_error: 'You need to select a Promotion type.',
  }),
  amount: z
    .number()
    .int({ message: 'Amount must be a number' })
    .positive({ message: 'Amount must be a positive number' }),
  min_order_value: z
    .number()
    .int({ message: 'Min Order Value must be a number' })
    .nonnegative({ message: 'Min Order Value must be a positive number' }),
  expiration_date: z.date().optional().or(z.literal('')),
});

export default function NewPromotionForm({
  displayName,
}: {
  displayName: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const { pending } = useFormStatus();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'Flat Amount',
      amount: 1,
      min_order_value: 0,
      expiration_date: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const currentUser = await auth.currentUser;
    const collectionReference: CollectionReference = collection(
      db,
      'promotions'
    );
    const q = query(
      collectionReference,
      where('store_id', '==', displayName),
      where('title', '==', values.name)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setError('You have already used this code before');
      return;
    }
    await addDoc(collectionReference, {
      title: values.name,
      number_of_uses: 0,
      minimum_order_value: values.min_order_value,
      amount: values.amount,
      type: values.type,
      status: 'Inactive',
      store_id: displayName,
      times_used: 0,
      user_id: currentUser?.email,
      show_in_banner: false,
    });
    form.reset();
    revalidate();
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" asChild>
          <div>
            <FontAwesomeIcon
              className="icon mr-2 h-4 w-4"
              icon={faCirclePlus}
            />
            New Promotion
          </div>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>New Promotion</AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full space-x-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a promotion type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Flat Amount">$</SelectItem>
                            <SelectItem value="Percentage">%</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="min_order_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Order Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiration_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiration Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full text-left font-normal justify-start',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'LLL dd, yyyy')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <FontAwesomeIcon
                                className="icon ml-[10px]"
                                icon={faCalendar}
                              />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error ? <p className="text-destructive">{error}</p> : <></>}
                <section className="flex gap-[15px] w-full justify-end">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button disabled={pending} type="submit">
                    Submit
                  </Button>
                </section>
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
