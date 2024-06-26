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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import {
  DocumentData,
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { getCookie } from 'cookies-next';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Collection name must be 3 or more characters long' })
    .max(18, {
      message: 'Collection name must be no more than 18 characters long',
    }),
  type: z.enum(['Manual', 'Smart'], {
    required_error: 'You need to select a collection type.',
  }),
});

export default function NewCollectionForm() {
  const default_store = getCookie('default_store');
  const user_id = getCookie('user_id');
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const { push } = useRouter();
  const { pending } = useFormStatus();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'Manual',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const encodedTitle = values.name
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const docRef: DocumentReference = doc(
      db,
      `stores/${default_store}/collections`,
      encodedTitle
    );
    const data: DocumentData = await getDoc(docRef);

    if (data.exists()) {
      setError('Collection Slug already used. Try another name.');
      return;
    } else {
      await setDoc(docRef, {
        name: values.name,
        type: values.type,
        products: [],
        tags: '',
        status: 'Private',
        owner_id: user_id,
        store_id: default_store,
        created_at: Timestamp.fromDate(new Date()),
      });
      toast('New Colletion Added', {
        description: `The ${values.name} collection was added to your store.`,
      });
      push(`/dashboard/products/collections/${encodedTitle}`);
      return;
    }
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
            Add Collection
          </div>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Collection</AlertDialogTitle>
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
                    <FormItem className="text-foreground">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3 text-foreground">
                      <FormLabel>Collection Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Manual" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Manual
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Smart" />
                            </FormControl>
                            <FormLabel className="font-normal">Smart</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
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
