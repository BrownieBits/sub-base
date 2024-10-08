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
      <section className="item-start flex w-full flex-col gap-8 rounded border bg-layer-one p-4">
        <Skeleton className="h-7 w-[100px] bg-layer-two" />

        <section className="flex w-full flex-col gap-2">
          <Skeleton className="h-5 w-[125px] bg-layer-two" />
          <Skeleton className="h-10 w-[50px] bg-layer-two" />
        </section>
        <section className="flex w-full flex-col gap-2">
          <Skeleton className="h-5 w-[100px] bg-layer-two" />
          <Skeleton className="h-3 w-[100px] bg-layer-two" />
          <section className="flex w-full justify-between gap-4">
            <Skeleton className="h-5 w-[125px] bg-layer-two" />
            <Skeleton className="h-5 w-[50px] bg-layer-two" />
          </section>
          <section className="flex w-full justify-between gap-4">
            <Skeleton className="h-5 w-[125px] bg-layer-two" />
            <Skeleton className="h-5 w-[50px] bg-layer-two" />
          </section>
        </section>

        <section className="flex w-full flex-col gap-2">
          <Skeleton className="h-5 w-[100px] bg-layer-two" />
          <Skeleton className="h-3 w-[100px] bg-layer-two" />
          <section className="flex w-full items-center gap-4">
            <Skeleton className="aspect-square w-[50px] bg-layer-two" />
            <Skeleton className="h-5 w-[125px] bg-layer-two" />
            <div className="flex-1" />
            <Skeleton className="h-5 w-[50px] bg-layer-two" />
          </section>
        </section>
        <Skeleton className="h-[40px] w-[100px] bg-layer-two" />
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col items-start justify-start gap-8 rounded border bg-layer-one p-4">
      <h3>Store Analytics</h3>
      <section className="flex w-full flex-col gap-2">
        <p>
          <b>Channel Subscriptions</b>
        </p>
        <p className="text-2xl">
          <b>{analytics.subscription_count}</b>
        </p>
      </section>
      <section className="flex w-full flex-col gap-4">
        <section className="flex w-full flex-col">
          <p>
            <b>Summary</b>
          </p>
          <p className="text-sm text-muted-foreground">Last 30 Days</p>
        </section>
        <section className="flex w-full justify-between gap-4">
          <p>Views</p>
          <p>{analytics.view_count}</p>
        </section>
        <section className="flex w-full justify-between gap-4">
          <p>Likes</p>
          <p>{analytics.like_count}</p>
        </section>
      </section>

      <section className="flex w-full flex-col gap-4">
        <section className="flex w-full flex-col">
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
                  className="flex w-full items-center gap-4"
                  key={product.name}
                >
                  <section className="flex aspect-square items-center justify-center overflow-hidden rounded border bg-layer-one">
                    <Image
                      src={product.image_url}
                      width="300"
                      height="300"
                      alt={product.name}
                      className="flex w-full"
                    />
                  </section>
                  <Skeleton className="aspect-square w-[50px] bg-layer-two" />
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
