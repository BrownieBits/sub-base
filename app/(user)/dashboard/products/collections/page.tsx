import Link from 'next/link';
import { HeroBanner } from '@/components/amaze-ui/HeroBanner';
import NewCollectionForm from '@/components/amaze-ui/NewCollectionForm';
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
import { CollectionsTable } from '@/components/amaze-ui/CollectionsTable';
import { NoCollections } from '@/components/amaze-ui/NoCollections';
import { Separator } from '@/components/ui/separator';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`sign-in`);
  }
  const collectionsRef: CollectionReference = collection(db, 'collections');
  const q = query(collectionsRef, where('store_id', '==', slug.value));
  const collectionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  return collectionsData;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Collections',
  };
}

export default async function Collections() {
  const cookieStore = cookies();
  const user_slug = cookieStore.get('user_slug');
  const data = await getData(user_slug);
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Collections</h1>
          <NewCollectionForm displayName={user_slug?.value!} />
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
        {data.docs?.length! > 0 ? (
          <CollectionsTable snapshot={data!} />
        ) : (
          <NoCollections />
        )}
      </section>
    </section>
  );
}
