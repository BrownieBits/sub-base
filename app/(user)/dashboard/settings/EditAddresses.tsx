'use client';

import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle,
  faCircleDot,
  faSquarePlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
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
import React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useFormStatus } from 'react-dom';
import { revalidate } from './actions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Full Name is a required field' })
    .refine(
      (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? ''),
      'Name should contain only alphabets'
    )
    .refine(
      (value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value ?? ''),
      'Please enter both firstname and lastname'
    ),
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
});

export default function EditAddresses(props: {
  userID: string;
  addresses: string[];
  default_address: string;
}) {
  const [addressData, setAddressData] = React.useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const { pending } = useFormStatus();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      country: '',
      postal: '',
    },
  });

  async function onAddNew(values: z.infer<typeof formSchema>) {
    const docRef: DocumentReference = doc(db, 'users', props.userID);
    const addressesRef: CollectionReference = collection(db, 'addresses');

    const newDoc: DocumentReference<DocumentData, DocumentData> = await addDoc(
      addressesRef,
      {
        name: values.name,
        address_line_1: values.addressLine1,
        address_line_2: values.addressLine2 || '',
        city: values.city,
        province: values.province,
        country: values.country,
        postal_code: values.postal,
        owner_id: props.userID,
        created_at: Timestamp.fromDate(new Date()),
      }
    );
    let default_address = props.default_address;
    const addresses = props.addresses;
    if (props.default_address === '') {
      default_address = newDoc.id;
    }
    addresses.push(newDoc.id);
    await updateDoc(docRef, {
      addresses: addresses,
      default_address: default_address,
    });
    revalidate();
    setOpen(false);
    form.reset();
    toast('User Updated', {
      description: 'Your user info has been updated.',
    });
  }

  async function makeDefault(newID: string) {
    const docRef: DocumentReference = doc(db, 'users', props.userID);
    await updateDoc(docRef, {
      default_address: newID,
    });
    revalidate();
  }

  async function deleteAddress(oldID: string) {
    const addressRef: DocumentReference = doc(db, 'addresses', oldID);
    const docRef: DocumentReference = doc(db, 'users', props.userID);
    const newAddresses = props.addresses.filter((address) => address !== oldID);
    await deleteDoc(addressRef);
    await updateDoc(docRef, {
      addresses: newAddresses,
    });
    revalidate();
  }

  React.useEffect(() => {
    const getData = async () => {
      if (props.addresses.length > 0) {
        const addressesRef: CollectionReference = collection(db, 'addresses');
        const q = query(addressesRef, where('__name__', 'in', props.addresses));
        const addressesData: QuerySnapshot<DocumentData, DocumentData> =
          await getDocs(q);
        setAddressData(addressesData.docs);
      }
    };
    getData();
  }, [props.addresses]);

  return (
    <section className="flex flex-col md:flex-row gap-[30px]">
      <aside className="w-full md:w-[400px] lg:w-[600px]">
        <p className="pb-[15px]">
          <b>Addresses</b>
        </p>
        <p className="pb-[15px]">
          These are addresses we can use for quicker checkouts or for
          subscription based services.
        </p>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger>
            <Button variant="outline" asChild>
              <div>
                <FontAwesomeIcon
                  className="icon mr-2 h-4 w-4"
                  icon={faSquarePlus}
                />
                Add Address
              </div>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>New Address</AlertDialogTitle>
              <AlertDialogDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onAddNew)}
                    className="space-y-8 w-full"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input id="name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input id="AddressLine1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input id="AddressLine2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input id="city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input id="province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input id="country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postal"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input id="postal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {error ? (
                      <p className="text-destructive">{error}</p>
                    ) : (
                      <></>
                    )}
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
      </aside>
      <aside className="w-full flex flex1 flex-col gap-[30px] bg-layer-one p-[30px] rounded drop-shadow">
        {props.addresses.length === 0 ? (
          <p>You currently have no stored addresses.</p>
        ) : (
          <>
            {addressData.map((doc) => (
              <section
                className="flex flex-col md:flex-row items-center bg-layer-two rounded-lg border p-3 shadow-sm gap-[30px]"
                key={doc.id}
              >
                {doc.id === props.default_address ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <FontAwesomeIcon
                          className="icon h-4 w-4"
                          icon={faCircleDot}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Default Address</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          className="p-0"
                          onClick={() => {
                            makeDefault(doc.id);
                          }}
                          asChild
                        >
                          <FontAwesomeIcon
                            className="icon h-4 w-4"
                            icon={faCircle}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Make Default Address</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <div className="flex-1 space-y-0.5">
                  <p>
                    <b>{doc.data().name}</b>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {doc.data().address_line_1}
                    {doc.data().address_line_2}
                    {', '}
                    {doc.data().city}
                    {', '}
                    {doc.data().province} {doc.data().postal_code}
                  </p>
                </div>
                {doc.id === props.default_address ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <FontAwesomeIcon
                          className="icon h-4 w-4 text-muted-foreground"
                          icon={faTrash}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cannot delete while default</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          className="p-0"
                          onClick={() => {
                            deleteAddress(doc.id);
                          }}
                          asChild
                        >
                          <FontAwesomeIcon
                            className="icon h-4 w-4"
                            icon={faTrash}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Address</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </section>
            ))}
          </>
        )}
      </aside>
    </section>
  );
}
