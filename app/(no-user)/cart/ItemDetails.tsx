'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DocumentReference,
  Timestamp,
  doc,
  writeBatch,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { revalidate } from './actions';
import { Item } from './types';

type Props = {
  cart_id: string;
  item: Item;
};
const formSchema = z.object({
  quantity: z.string(),
});

export default function ItemDetails({ item, cart_id }: Props) {
  const [selectableQuantity, setSelectableQuantity] = React.useState<string[]>(
    []
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: item.quantity.toString(),
    },
  });

  async function onSubmit() {}
  async function deleteItem() {
    let cart_item_id = item.id;
    if (item.options.length > 0) {
      cart_item_id = `${item.id}_${item.options.join('_')}`;
    }
    const itemRef: DocumentReference = doc(
      db,
      'carts',
      cart_id,
      'items',
      cart_item_id
    );
    const cartRef: DocumentReference = doc(db, 'carts', cart_id);
    const batch = writeBatch(db);
    batch.delete(itemRef);
    batch.update(cartRef, {
      updated_at: Timestamp.fromDate(new Date()),
    });
    await batch.commit();
    toast.success('Product Removed', {
      description: `You removed ${item.name} ${item.options.join(' ')}`,
    });
    revalidate();
  }

  async function onOptionChange(event: string) {
    let cart_item_id = item.id;
    if (item.options.length > 0) {
      cart_item_id = `${item.id}_${item.options.join('_')}`;
    }
    const itemRef: DocumentReference = doc(
      db,
      'carts',
      cart_id,
      'items',
      cart_item_id
    );
    const cartRef: DocumentReference = doc(db, 'carts', cart_id);
    const batch = writeBatch(db);
    batch.update(itemRef, {
      quantity: parseInt(event),
    });
    batch.update(cartRef, {
      updated_at: Timestamp.fromDate(new Date()),
    });
    await batch.commit();
    toast.success('Product Quantity Updated', {
      description: `You updated the quantity of ${item.name} ${item.options.join(' ')}`,
    });
    revalidate();
  }

  React.useEffect(() => {
    let selectable = Array.from({ length: item.inventory }, (_, i) =>
      (i + 1).toString()
    );
    if (!item.track_inventory) {
      selectable = Array.from({ length: 999 }, (_, i) => (i + 1).toString());
    }
    console.log(item.inventory, item.track_inventory, selectable);
    setSelectableQuantity(selectable);
  }, []);
  return (
    <section className="w-full flex flex-col md:flex-row gap-4">
      <section className="flex-1 w-full flex gap-4">
        {item.images.length > 0 && (
          <section>
            <Link
              href={`/product/${item.id}`}
              className="aspect-square w-[100px] flex justify-center items-center bg-layer-one border rounded overflow-hidden group"
            >
              <Image
                src={item.images[0]}
                width="300"
                height="300"
                alt={item.name}
                className="flex w-full"
              />
            </Link>
          </section>
        )}
        <section className="w-full flex-1 flex flex-col">
          <p>
            <b>{item.name}</b>
          </p>
          <p className="text-sm text-muted-foreground pb-2">
            {item.product_type}
          </p>
          <p>{item.options.join(', ')}</p>
        </section>
      </section>
      <section className="w-full md:w-auto flex flex-row-reverse md:flex-col justify-between items-end gap-4">
        <section className="flex flex-col">
          {item.compare_at > 0 && item.compare_at < item.price ? (
            <>
              <p className="text-destructive line-through">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: item.currency,
                }).format(item.price)}
              </p>
              <p>
                <b>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: item.currency,
                  }).format(item.compare_at)}
                </b>
              </p>
            </>
          ) : (
            <p>
              <b>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: item.currency,
                }).format(item.price)}
              </b>
            </p>
          )}
        </section>
        <section className="flex items-center gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name={`quantity`}
                render={({ field }) => (
                  <FormItem className="w-full flex1">
                    <Select
                      onValueChange={(event) => onOptionChange(event)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select a quantity`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectableQuantity.map((item) => {
                          return (
                            <SelectItem value={item.toString()} key={item}>
                              {item.toString()}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Button variant="ghost" size="sm" onClick={deleteItem}>
            <FontAwesomeIcon className="icon h-4 w-4" icon={faTrash} />
          </Button>
        </section>
      </section>
    </section>
  );
}
