'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { getCookie } from 'cookies-next';
import { Unsubscribe } from 'firebase/auth';
import {
  CollectionReference,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Analytics = {
  subscription_count: number;
  view_count: number;
  like_count: number;
  products: {
    image_url: string;
    name: string;
    revenue: number;
    currency: string;
  }[];
};

export const StoreAnalytics = (props: {}) => {
  const default_store = getCookie('default_store');
  const [analytics, setAnalytics] = React.useState<Analytics | null>(null);
  React.useEffect(() => {
    const getAnalytics: Unsubscribe = async () => {
      const analyticsRef: CollectionReference = collection(
        db,
        `stores/${default_store}/analytics`
      );
      const today = new Date();
      const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
      const q = query(analyticsRef, where('created_at', '>', thirtyDaysAgo));
      const unsubscribe = await onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          const newAnalytics: Analytics = {
            subscription_count: 0,
            view_count: 0,
            like_count: 0,
            products: [],
          };
          setAnalytics(newAnalytics);
        } else {
          const newAnalytics: Analytics = {
            subscription_count: 0,
            view_count: 0,
            like_count: 0,
            products: [],
          };
          snapshot.docs.map((doc) => {
            if (doc.data().type === 'store_view') {
              newAnalytics.view_count += 1;
            } else if (doc.data().type === 'product_view') {
              newAnalytics.view_count += 1;
            } else if (doc.data().type === 'subscribe') {
              newAnalytics.subscription_count += 1;
            } else if (doc.data().type === 'unsubscribe') {
              newAnalytics.subscription_count -= 1;
            } else if (doc.data().type === 'like') {
              newAnalytics.like_count += 1;
            } else if (doc.data().type === 'unlike') {
              newAnalytics.like_count -= 1;
            }
          });

          setAnalytics(newAnalytics);
        }
      });
      return unsubscribe;
    };
    getAnalytics();
  }, []);

  if (analytics === null) {
    return (
      <section className="w-full flex flex-col item-start gap-8 p-4 rounded border bg-layer-one">
        <Skeleton className="w-[100px] h-7 bg-layer-two" />

        <section className="w-full flex flex-col gap-2">
          <Skeleton className="w-[125px] h-5 bg-layer-two" />
          <Skeleton className="w-[50px] h-10 bg-layer-two" />
        </section>
        <section className="w-full flex flex-col gap-2">
          <Skeleton className="w-[100px] h-5 bg-layer-two" />
          <Skeleton className="w-[100px] h-3 bg-layer-two" />
          <section className="w-full flex justify-between gap-4">
            <Skeleton className="w-[125px] h-5 bg-layer-two" />
            <Skeleton className="w-[50px] h-5 bg-layer-two" />
          </section>
          <section className="w-full flex justify-between gap-4">
            <Skeleton className="w-[125px] h-5 bg-layer-two" />
            <Skeleton className="w-[50px] h-5 bg-layer-two" />
          </section>
        </section>

        <section className="w-full flex flex-col gap-2">
          <Skeleton className="w-[100px] h-5 bg-layer-two" />
          <Skeleton className="w-[100px] h-3 bg-layer-two" />
          <section className="w-full flex items-center gap-4">
            <Skeleton className="w-[50px] aspect-square bg-layer-two" />
            <Skeleton className="w-[125px] h-5 bg-layer-two" />
            <div className="flex-1" />
            <Skeleton className="w-[50px] h-5 bg-layer-two" />
          </section>
        </section>
        <Skeleton className="w-[100px] h-[40px] bg-layer-two" />
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col justify-start items-start gap-8 p-4 bg-layer-one border rounded">
      <h3>Store Analytics</h3>
      <section className="w-full flex flex-col gap-2">
        <p>
          <b>Channel Subscriptions</b>
        </p>
        <p className="text-2xl">
          <b>{analytics.subscription_count}</b>
        </p>
      </section>
      <section className="w-full flex flex-col gap-4">
        <section className="w-full flex flex-col">
          <p>
            <b>Summary</b>
          </p>
          <p className="text-sm text-muted-foreground">Last 30 Days</p>
        </section>
        <section className="w-full flex justify-between gap-4">
          <p>Views</p>
          <p>{analytics.view_count}</p>
        </section>
        <section className="w-full flex justify-between gap-4">
          <p>Likes</p>
          <p>{analytics.like_count}</p>
        </section>
      </section>

      <section className="w-full flex flex-col gap-4">
        <section className="w-full flex flex-col">
          <p>
            <b>Top Products</b>
          </p>
          <p className="text-sm text-muted-foreground">Last 30 Days</p>
        </section>
        {analytics.products.length === 0 ? (
          <p>No product sales during this period.</p>
        ) : (
          <>
            {analytics.products.map((product) => {
              return (
                <section
                  className="w-full flex items-center gap-4"
                  key={product.name}
                >
                  <section className="aspect-square flex justify-center items-center bg-layer-one border rounded overflow-hidden">
                    <Image
                      src={product.image_url}
                      width="300"
                      height="300"
                      alt={product.name}
                      className="flex w-full"
                    />
                  </section>
                  <Skeleton className="w-[50px] aspect-square bg-layer-two" />
                  <p className="flex-1">{product.name}</p>
                  <p>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency,
                    }).format(product.revenue)}
                  </p>
                </section>
              );
            })}
          </>
        )}
      </section>
      <Button
        variant="outline"
        className="bg-layer-one hover:bg-layer-two"
        asChild
      >
        <Link href="/dashboard/analytics">Go To Analytics</Link>
      </Button>
    </section>
  );
};
