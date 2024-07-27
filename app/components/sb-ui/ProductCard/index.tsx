'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useDocument } from 'react-firebase-hooks/firestore';

export default function ProductCard({
  id,
  show_creator,
}: {
  id: string;
  show_creator: boolean;
}) {
  const docRef = doc(db, 'products', id);
  const [value, loading, error] = useDocument(docRef);

  if (loading) {
    return (
      <div className="flex flex-col">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex justify-between pt-4 pb-[5px]">
          <Skeleton className="h-[24px] w-[250px]" />
          <Skeleton className="h-[24px] w-[75px]" />
        </div>
        <Skeleton className="h-[20px] w-[200px] mb-[5px]" />
        <Skeleton className="h-[20px] w-[225px]" />
      </div>
    );
  }

  if (value?.data()?.status === 'Private') {
    return;
  }

  return (
    <div className="flex flex-col w-full">
      <Link
        href={`/product/${value?.id}`}
        className="aspect-square flex justify-center items-center bg-layer-one border rounded overflow-hidden group"
      >
        {value?.data()?.images.length > 1 ? (
          <>
            <Image
              src={value?.data()?.images[0]}
              width="300"
              height="300"
              alt={value?.data()?.title}
              className="flex group-hover:hidden w-full"
            />
            <Image
              src={value?.data()?.images[1]}
              width="300"
              height="300"
              alt={value?.data()?.title}
              className="hidden group-hover:flex w-full"
            />
          </>
        ) : (
          <Image
            src={value?.data()?.images[0]}
            width="300"
            height="300"
            alt={value?.data()?.title}
            className="flex w-full"
          />
        )}
      </Link>
      <Link
        href={`/product/${value?.id}`}
        className="flex justify-between pt-4 pb-[5px]"
      >
        <p>
          <b>{value?.data()?.name}</b>
        </p>
        <p>
          <b>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: value?.data()?.currency,
            }).format(value?.data()?.price)}
          </b>
        </p>
      </Link>
      <Link
        href={`/creator/${value?.data()?.store_id}/product/${value?.id}`}
        className="text-sm text-muted-foreground mb-[5px]"
      >
        {value?.data()?.product_type}
      </Link>
      {show_creator ? (
        <Link
          href={`/store/${value?.data()?.store_id}`}
          className="text-sm text-muted-foreground"
        >
          {value?.data()?.store_id}
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
}
