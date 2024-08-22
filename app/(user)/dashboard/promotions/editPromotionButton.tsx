'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import {
  faCalendar,
  faClose,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from 'cookies-next';
import { format } from 'date-fns';
import {
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
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

export const EditPromotionButton = (props: {
  id: string;
  name: string;
  minimum_order_value: number;
  amount: number;
  type: 'Flat Amount' | 'Percentage' | undefined;
  expiration_date: Timestamp | undefined;
}) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const store_id = getCookie('default_store');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name,
      type: props.type,
      amount: props.amount,
      min_order_value: props.minimum_order_value,
      expiration_date: props.expiration_date
        ? new Date(props.expiration_date.seconds * 1000)
        : undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let expiration_date = null;
    if (values.expiration_date !== undefined && values.expiration_date !== '') {
      expiration_date = Timestamp.fromDate(values.expiration_date);
    }
    const promotionDoc: DocumentReference = doc(
      db,
      'stores',
      store_id!,
      'promotions',
      props.id
    );
    const querySnapshot = await getDoc(promotionDoc);
    if (!querySnapshot.exists()) {
      toast.error("Promotion ID doesn't exist", {
        description: 'Try selecting another promotion to edit',
      });
    } else {
      await updateDoc(promotionDoc, {
        name: values.name.toUpperCase(),
        number_of_uses: 0,
        minimum_order_value: values.min_order_value,
        amount: values.amount,
        type: values.type,
        expiration_date: expiration_date,
      });
      toast.success('Promotion Updated', {
        description: 'Your promotion has been updated.',
      });
    }

    revalidate();
    setOpen(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" title="Edit" className="p-0 text-foreground">
            <FontAwesomeIcon className="icon" icon={faPenToSquare} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <h3>Edit Promotion</h3>
            </DialogTitle>
            <DialogDescription className="flex flex-col">
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
                        <FormLabel className="text-foreground">Code</FormLabel>
                        <FormControl>
                          <Input className="text-foreground" {...field} />
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
                          <FormLabel className="text-foreground">
                            Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-foreground">
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
                          <FormLabel className="text-foreground">
                            Amount
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="text-foreground"
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
                        <FormLabel className="text-foreground">
                          Min Order Value
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="text-foreground"
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
                        <FormLabel className="text-foreground">
                          Expiration Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className="w-full text-left font-normal justify-start text-foreground"
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
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <section className="flex gap-4 w-full justify-end">
                    <DialogClose>Cancel</DialogClose>
                    <Button type="submit">Submit</Button>
                  </section>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Button variant="link" title="Edit" className="p-0 text-foreground">
          <FontAwesomeIcon className="icon" icon={faPenToSquare} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="w-full max-w-[2428px] mx-auto">
          <DrawerTitle className="flex justify-between">
            <h3>Edit Promotion</h3>
            <DrawerClose>
              <Button variant="outline">
                <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
              </Button>
            </DrawerClose>
          </DrawerTitle>
          <DrawerDescription className="w-full flex flex-col items-start text-left">
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
                      <FormLabel className="text-foreground">Code</FormLabel>
                      <FormControl>
                        <Input className="text-foreground" {...field} />
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
                            <SelectTrigger className="text-foreground">
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
                        <FormLabel className="text-foreground">
                          Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="text-foreground"
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
                      <FormLabel className="text-foreground">
                        Min Order Value
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="text-foreground"
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
                      <FormLabel className="text-foreground">
                        Expiration Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className="w-full text-left font-normal justify-start text-foreground"
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
                <section className="flex gap-4 w-full justify-end">
                  <DrawerClose>Cancel</DrawerClose>
                  <Button type="submit">Submit</Button>
                </section>
              </form>
            </Form>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};