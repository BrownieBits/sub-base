'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useDocument } from 'react-firebase-hooks/firestore';

export default function CreatorCard({ id }: { id: string }) {
  const docRef = doc(db, 'stores', id);
  const [value, loading, error] = useDocument(docRef);

  if (loading) {
    return (
      <div className="flex flex-col items-start space-x-4">
        <Skeleton className="aspect-square w-full rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] mt-[15px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        href={`/creator/${id}`}
        className="flex flex-col items-center justify-center group w-full"
      >
        <div className="flex justify-center items-center aspect-square rounded-full overflow-hidden w-full">
          <Image
            src={value?.data()?.logo}
            width="300"
            height="300"
            alt={value?.data()?.display_name}
            className="flex w-full"
          />
        </div>
        <p className="font-bold text-lg mt-[10px]">
          {value?.data()?.display_name}
        </p>
        <p className="text-muted-foreground">
          {value?.data()?.subscribers} subscriber
          {value?.data()?.subscribers > 1 ? <>s</> : <></>}
        </p>
      </Link>
    </>
  );
}
