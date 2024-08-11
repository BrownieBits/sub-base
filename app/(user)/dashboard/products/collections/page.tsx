import { DataTable } from '@/components/sb-ui/DataTable';
import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  query,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { columns } from './DataColums';
import NewCollectionForm from './NewCollectionForm';
import { NoCollections } from './NoCollections';

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
    title: `Collections - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/collections/`,
      title: `Collections - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Collections - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function Collections() {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data = await getData(default_store);
  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Collections</h1>
          <NewCollectionForm />
        </section>
        <HeroBanner page_slug="creator-collections" />
        <section className="flex w-full gap-8 justify-start px-4">
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
      <section className="w-full max-w-[2428px] mx-auto">
        {data.length! > 0 ? (
          <DataTable columns={columns} data={data!} />
        ) : (
          <NoCollections />
        )}
      </section>
    </section>
  );
}
