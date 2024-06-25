'use client';

import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDialogCancel } from '@/components/ui/alert-dialog';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  search: z.string(),
});

export default function AddProductsToCollectionForm(props: {
  closeModal: (updatedProducts: string[]) => void;
  preselected: string[];
  products: QuerySnapshot<DocumentData, DocumentData>;
  loading: boolean;
}) {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [searchedTerm, setSearchedTerm] = React.useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchedTerm(values.search || '');
  }
  async function checkChange(event: any) {
    if (event.target.checked) {
      setSelectedProducts([...selectedProducts, event.target.id]);
    } else {
      setSelectedProducts(
        selectedProducts.filter((a) => a !== event.target.id)
      );
    }
  }

  React.useEffect(() => {
    setSelectedProducts(props.preselected || []);
  }, [props.preselected]);

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
          id="new-collection"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Search" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {props.loading ? (
        <div>Loading</div>
      ) : (
        <ScrollArea className="flex flex-col max-h-[300px]">
          {props.products?.docs?.length! > 0 ? (
            <>
              {props.products?.docs.map((doc) => {
                if (
                  searchedTerm !== '' &&
                  !doc
                    .data()
                    .title.toLowerCase()
                    .includes(searchedTerm.toLowerCase()) &&
                  !doc
                    .data()
                    .description.toLowerCase()
                    .includes(searchedTerm.toLowerCase())
                ) {
                  return <></>;
                }
                return (
                  <section
                    className="flex items-center gap-[15px] my-[15px]"
                    key={doc.id}
                  >
                    <input
                      type="checkbox"
                      id={doc.id}
                      onChange={checkChange}
                      checked={selectedProducts.includes(doc.id)}
                    />
                    <div className="w-[50px]">
                      <Image
                        alt={doc.data().title}
                        src={doc.data().images[0].replace('800/800', '50/50')}
                        width="50"
                        height="50"
                      />
                    </div>
                    <span className="flex-1">{doc.data().title}</span>
                    <span className="flex-1">{doc.data().type}</span>
                    {doc.data().status === 'Public' ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        {doc.data().status}
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                        {doc.data().status}
                      </span>
                    )}
                  </section>
                );
              })}
            </>
          ) : (
            <div>No Data</div>
          )}
        </ScrollArea>
      )}

      <section className="flex justify-between items-center gap-[15px]">
        <span>
          {selectedProducts?.length} Product
          {selectedProducts?.length === 1 ? '' : 's'} Selected
        </span>
        <section className="flex gap-[15px]">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={() => props.closeModal(selectedProducts)}>
            Save
          </Button>
        </section>
      </section>
    </section>
  );
}
