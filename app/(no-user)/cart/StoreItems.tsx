'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import ItemDetails from './ItemDetails';
import { Item } from './types';

type Store = {
  name: string;
  avatar_url?: string;
};
type Props = {
  cart_id: string;
  store_id: string;
  items: Item[];
};

export default function StoreItems(props: Props) {
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

  if (store === null) {
    return <></>;
  }

  return (
    <section className="w-full border rounded bg-layer-one">
      <Link
        href={`/store/${props.store_id}`}
        className="w-full flex items-center gap-4 p-4"
      >
        <Avatar className="h-[50px] w-[50px]">
          <AvatarImage src={store.avatar_url} alt="Avatar" />
        </Avatar>
        <p>
          <b>{store.name}</b>
        </p>
      </Link>
      <Separator />
      <section className="w-full flex gap-4 p-4">
        {props.items.map((item: Item) => (
          <ItemDetails
            item={item}
            cart_id={props.cart_id}
            key={`item-${item.id}`}
          />
        ))}
      </section>
      <Separator />
      <section className="w-full flex gap-4 p-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-layer-one hover:bg-layer-two"
        >
          <FontAwesomeIcon className="icon h-4 w-4" icon={faTag} />
          Apply Store Discount Code
        </Button>
      </section>
    </section>
  );
}
