import Link from 'next/link';
import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Button } from '@/components/ui/button';
import { Metadata, ResolvingMetadata } from 'next';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Separator } from '@/components/ui/separator';
import NewCollectionForm from './NewCollectionForm';
import { NoCollections } from './NoCollections';
import { DataTable } from '@/components/sb-ui/DataTable';
import { columns } from './DataColums';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`/sign-in?redirect=/dashboard/products`);
  }
  const collectionsRef: CollectionReference = collection(
    db,
    `stores/${slug.value}/collections`
  );
  const q = query(collectionsRef);
  const collectionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  const data = collectionsData.docs.map((item) => {
    return {
      id: item.id,
      products: item.data().products,
      status: item.data().status,
      name: item.data().name,
      type: item.data().type,
      owner_id: item.data().owner_id,
      tags: item.data().tags,
      store_id: item.data().store_id,
    };
  });

  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Collections',
  };
}

export default async function Collections() {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data = await getData(default_store);
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Collections</h1>
          <NewCollectionForm />
        </section>
        <HeroBanner page_slug="creator-collections" />
        <section className="flex w-full gap-[30px] justify-start px-[15px]">
          <Button
            asChild
            variant="link"
            className="px-0 text-md text-foreground rounded-none hover:no-underline border-b-[2px] border-transparent"
          >
            <Link href={`/dashboard/products`} aria-label="Products">
              Products
            </Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="px-0 text-md text-foreground border-b-[2px] rounded-none hover:no-underline"
          >
            <Link
              href={`/dashboard/products/collections`}
              aria-label="Collections"
            >
              Collections
            </Link>
          </Button>
        </section>
      </section>
      <Separator />
      <section className="w-full max-w-[3096px] mx-auto">
        {data.length! > 0 ? (
          <DataTable columns={columns} data={data!} />
        ) : (
          <NoCollections />
        )}
      </section>
    </section>
  );
}
