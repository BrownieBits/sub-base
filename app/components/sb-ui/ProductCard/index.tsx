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
        <div className="flex justify-between pt-[15px] pb-[5px]">
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
      <Link href={`/creator/${value?.data()?.store_id}/product/${value?.id}`}>
        {value?.data()?.images.length > 1 ? (
          <div className="group">
            <Image
              src={value?.data()?.images[0]}
              width="300"
              height="300"
              alt={value?.data()?.title}
              className="flex group-hover:hidden rounded-lg overflow-hidden w-full"
            />
            <Image
              src={value?.data()?.images[1]}
              width="300"
              height="300"
              alt={value?.data()?.title}
              className="hidden group-hover:flex rounded-lg overflow-hidden w-full"
            />
          </div>
        ) : (
          <Image
            src={value?.data()?.images[0]}
            width="300"
            height="300"
            alt={value?.data()?.title}
            className="flex rounded-lg overflow-hidden w-full"
          />
        )}
      </Link>
      <Link
        href={`/creator/${value?.data()?.store_id}/product/${value?.id}`}
        className="flex justify-between pt-[15px] pb-[5px]"
      >
        <p className="text-md">{value?.data()?.title}</p>
        <span className="font-bold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value?.data()?.base_price)}
        </span>
      </Link>
      <Link
        href={`/creator/${value?.data()?.store_id}/product/${value?.id}`}
        className="text-sm text-muted-foreground mb-[5px]"
      >
        {value?.data()?.type}
      </Link>
      {show_creator ? (
        <Link
          href={`/creator/${value?.data()?.store_id}`}
          className="text-sm text-muted-foreground"
        >
          {value?.data()?.store_name}
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
}
