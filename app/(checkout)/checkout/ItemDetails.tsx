'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { Item } from '@/lib/types';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import Image from 'next/image';
import React from 'react';

type Store = {
  name: string;
  avatar_url?: string;
};
type Props = {
  store_id: string;
  items: Item[];
};

export default function ItemDetails(props: Props) {
  const [store, setStore] = React.useState<Store | null>(null);

  React.useEffect(() => {
    const getStore = async () => {
      const storeRef: DocumentReference = doc(db, 'stores', props.store_id);
      const storeDoc: DocumentData = await getDoc(storeRef);
      if (storeDoc.exists()) {
        setStore({
          name: storeDoc.data().name,
          avatar_url: storeDoc.data().avatar_url,
        });
      }
    };
    getStore();
  }, []);

  return (
    <section className="w-full border rounded bg-layer-one">
      <section className="w-full flex items-center gap-4 p-2">
        {store === null ? (
          <>
            <Skeleton className="w-[25px] h-[25px] rounded-full bg-layer-three" />
            <Skeleton className="w-[120px] h-[20px] rounded-full bg-layer-three" />
          </>
        ) : (
          <>
            <Avatar className="h-[25px] w-[25px]">
              <AvatarImage src={store.avatar_url} alt="Avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground border-background">
                <b>{store.name.slice(0, 1).toUpperCase()}</b>
              </AvatarFallback>
            </Avatar>
            <p className="text-sm">
              <b>{store.name}</b>
            </p>
          </>
        )}
      </section>
      <Separator />
      <section className="w-full flex flex-col gap-4 p-2">
        {props.items.map((item: Item, index: number) => (
          <section
            className="w-full flex gap-4"
            key={`item-breakdown-item-${item.id}${item.options.join('')}`}
          >
            <section className="flex-1 w-full flex gap-2 whitespace-nowrap overflow-hidden">
              {item.images.length > 0 && (
                <section className="aspect-square w-[50px] flex justify-center items-center bg-layer-one border rounded overflow-hidden group">
                  <Image
                    src={item.images[0]}
                    width="300"
                    height="300"
                    alt={item.name}
                    className="flex w-full"
                  />
                </section>
              )}
              <section className="w-full flex-1 flex flex-col">
                <p className="text-sm">
                  <b>{item.name}</b>
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.options.join(', ')} x {item.quantity}
                </p>
              </section>
            </section>
            <section className="flex">
              {item.compare_at > 0 && item.compare_at < item.price ? (
                <p className="text-sm">
                  <b>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: item.currency,
                    }).format(item.compare_at * item.quantity)}
                  </b>
                </p>
              ) : (
                <p className="text-sm">
                  <b>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: item.currency,
                    }).format(item.price * item.quantity)}
                  </b>
                </p>
              )}
            </section>
          </section>
        ))}
      </section>
    </section>
  );
}
