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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { db } from '@/lib/firebase';
import { Address } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { revalidate } from '../actions';
import SelectVerifiedAddress from './SelectVerifiedAddress';
import AddAddress from './UserAddAddress';

const formSchema = z.object({
  address: z.string(),
});
type Props = {
  user_id: string;
  addresses: Address[];
  default_address: string;
  selectAddress: (address: Address) => void;
};

export default function UserAddressSelect(props: Props) {
  const [matchedAddress, setMatchedAddress] = React.useState<Address | null>(
    null
  );
  const [originalAddress, setOriginalAddress] = React.useState<Address | null>(
    null
  );
  const [addressesData, setAddressesData] = React.useState<Address[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: props.default_address,
    },
  });

  function setValidated(matched: Address, original: Address) {
    setMatchedAddress(matched);
    setOriginalAddress(original);
  }

  async function addValidatedAddress(address: Address) {
    setMatchedAddress(null);
    setOriginalAddress(null);
    const docRef: DocumentReference = doc(db, 'users', props.user_id);
    const addressesRef: CollectionReference = collection(db, 'addresses');
    address.owner_id = props.user_id;
    address.created_at = Timestamp.fromDate(new Date());
    const newDoc: DocumentReference<DocumentData, DocumentData> = await addDoc(
      addressesRef,
      address
    );
    let default_address = props.default_address;
    const addresses = props.addresses.map((addressDoc) => addressDoc.id);
    if (props.default_address === '') {
      default_address = newDoc.id;
    }
    addresses.push(newDoc.id);
    address.id = newDoc.id;
    const newAddresses = addressesData.splice(0);
    newAddresses.push(address);
    await updateDoc(docRef, {
      addresses: addresses,
      default_address: default_address,
    });
    revalidate();
    setAddressesData(newAddresses);
    form.setValue('address', newDoc.id);
    toast.success('Address Added', {
      description: 'Your user info has been updated.',
    });
  }

  React.useEffect(() => {
    if (props.default_address != '') {
      form.setValue('address', props.default_address);
    }
  }, [props.default_address]);
  React.useEffect(() => {
    setAddressesData(props.addresses);
  }, [props.addresses]);

  async function onSubmit() {
    if (form.getValues('address') === '') {
      form.setError('address', { message: 'You must select an address.' });
    } else {
      const address = addressesData.filter(
        (doc) => doc.id === form.getValues('address')
      );
      if (address.length > 0) {
        props.selectAddress({
          address_line1: address[0].address_line1,
          address_line2: address[0].address_line2,
          address_line3: address[0].address_line3,
          address_residential_indicator:
            address[0].address_residential_indicator,
          city_locality: address[0].city_locality,
          company_name: address[0].company_name,
          country_code: address[0].country_code,
          email: address[0].email,
          name: address[0].name,
          phone: address[0].phone,
          postal_code: address[0].postal_code,
          state_province: address[0].state_province,
        });
      } else {
        console.log('coudnt fint', form.getValues('address'));
      }
    }
  }

  return (
    <section className="flex w-full flex-col gap-4 rounded border bg-layer-one p-4 drop-shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <section className="flex flex-col gap-4">
            <h3>Shipping Address</h3>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col gap-4"
                      defaultValue={field.value}
                    >
                      {addressesData.map((doc) => {
                        return (
                          <FormItem
                            className="flex items-center space-x-3 space-y-0"
                            key={`address-${doc.id!}`}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={doc.id!}
                                id={doc.id!}
                                defaultChecked={
                                  doc.id === props.default_address
                                }
                                checked={doc.id === field.value}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <p>
                                <b>{doc.name}</b>
                              </p>
                              <span>
                                <p>{doc.address_line1}</p>
                                {doc.address_line2 && (
                                  <p>{doc.address_line2}</p>
                                )}
                                <p>
                                  {doc.city_locality}, {doc.state_province}{' '}
                                  {doc.postal_code}
                                </p>
                              </span>
                            </FormLabel>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </form>
      </Form>
      <AddAddress setValidated={setValidated} />
      <SelectVerifiedAddress
        matchedAddress={matchedAddress}
        originalAddress={originalAddress}
        selectAddress={addValidatedAddress}
      />
      <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
        Next
      </Button>
    </section>
  );
}
