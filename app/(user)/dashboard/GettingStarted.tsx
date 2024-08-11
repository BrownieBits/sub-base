'use client';

import { AddProductButton } from '@/components/sb-ui/AddProductButton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { GridProduct } from '@/lib/types';
import { Unsubscribe } from 'firebase/auth';
import {
  CollectionReference,
  Timestamp,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const GettingStartedGuide = (props: {}) => {
  const [latestProduct, setLatestProduct] = React.useState<
    GridProduct | '' | null
  >(null);
  React.useEffect(() => {
    const getLatest: Unsubscribe = async () => {
      const productsRef: CollectionReference = collection(db, 'products');
      const q = query(
        productsRef,
        where('created_at', '!=', null),
        orderBy('created_at', 'desc'),
        limit(1)
      );
      const unsubscribe = await onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          setLatestProduct('');
        } else {
          const newProduct: GridProduct = {
            name: snapshot.docs[0].data().name as string,
            images: snapshot.docs[0].data().images as string[],
            product_type: snapshot.docs[0].data().product_type as string,
            price: snapshot.docs[0].data().price as number,
            compare_at: snapshot.docs[0].data().compare_at as number,
            currency: snapshot.docs[0].data().currency as string,
            like_count: snapshot.docs[0].data().like_count as number,
            store_id: snapshot.docs[0].data().store_id as string,
            created_at: snapshot.docs[0].data().created_at as Timestamp,
            id: snapshot.docs[0].id as string,
            view_count: snapshot.docs[0].data().view_count as number,
            revenue: snapshot.docs[0].data().revenue as number,
          };
          setLatestProduct(newProduct);
        }
      });
      return unsubscribe;
    };
    getLatest();
  }, []);

  if (latestProduct === null) {
    return (
      <section className="w-full flex flex-col gap-4 p-4">
        <Skeleton className="w-[150px] h-7 bg-layer-two" />
        <Skeleton className="w-full aspect-square rounded bg-layer-two" />
        <Skeleton className="w-[125px] h-5 bg-layer-two" />
        <section className="w-full flex justify-between gap-4">
          <Skeleton className="w-[125px] h-5 bg-layer-two" />
          <Skeleton className="w-[50px] h-5 bg-layer-two" />
        </section>
        <section className="w-full flex justify-between gap-4">
          <Skeleton className="w-[125px] h-5 bg-layer-two" />
          <Skeleton className="w-[50px] h-5 bg-layer-two" />
        </section>
        <section className="w-full flex justify-between gap-4">
          <Skeleton className="w-[125px] h-5 bg-layer-two" />
          <Skeleton className="w-[50px] h-5 bg-layer-two" />
        </section>

        <section className="w-full flex  gap-4">
          <Skeleton className="w-[75px] h-[40px] bg-layer-two" />
          <Skeleton className="w-[75px] h-[40px] bg-layer-two" />
        </section>
      </section>
    );
  }
  if (latestProduct === '') {
    return (
      <section className="w-full flex flex-col items-start gap-4 p-4">
        <h3>Latest Product Performance</h3>
        <Skeleton className="w-full aspect-square rounded bg-layer-two" />
        <p>
          <b>No Products Yet</b>
        </p>
        <p>Create your first product and sell to the world!</p>
        <AddProductButton copy="Create" variant="default" />
      </section>
    );
  }
  return (
    <section className="w-full flex flex-col gap-4 p-8">
      <h3>Latest Product Performance</h3>
      <section className="aspect-square flex justify-center items-center bg-layer-one border rounded overflow-hidden group">
        <Image
          src={latestProduct.images[0]}
          width="1000"
          height="1000"
          alt={latestProduct.name}
          className="flex w-full"
        />
      </section>
      <p>
        <b>{latestProduct.name}</b>
      </p>
      <section className="w-full flex justify-between gap-4">
        <p>Views</p>
        <p>{latestProduct.view_count}</p>
      </section>
      <section className="w-full flex justify-between gap-4">
        <p>Likes</p>
        <p>{latestProduct.like_count}</p>
      </section>
      <section className="w-full flex justify-between gap-4">
        <p>Revenue</p>
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: latestProduct.currency,
          }).format(latestProduct.revenue!)}
        </p>
      </section>

      <section className="w-full flex  gap-4">
        <Button asChild>
          <Link href={`/product/${latestProduct.id}`}>View Product</Link>
        </Button>
        <Button
          variant="outline"
          className="bg-layer-one hover:bg-layer-two"
          asChild
        >
          <Link href="/dashboard/analytics">Go To Analytics</Link>
        </Button>
      </section>
    </section>
  );
};
