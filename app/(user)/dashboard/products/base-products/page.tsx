import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NoBaseCategories } from './NoBaseCategories';

async function getData() {
  const categoriesRef: CollectionReference = collection(
    db,
    'printful_categories'
  );
  const q = query(
    categoriesRef,
    where('catalog_position', '!=', null),
    orderBy('catalog_position')
  );
  const categoriesData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);
  return categoriesData;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Base Products',
  };
}

export default async function BaseProducts() {
  // const cookieStore = cookies();
  // const default_store = cookieStore.get('default_store');
  const data = await getData();
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Base Products</h1>
        </section>
        <HeroBanner page_slug="creator-liked-items" />
      </section>
      <Separator />

      <section className="w-full max-w-[3096px] mx-auto">
        {data.docs.length === 0 ? (
          <NoBaseCategories />
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-[30px] gap-y-[60px] px-[15px] py-[30px]">
            {data.docs.map((doc: any) => {
              return (
                <Link
                  href={`/dashboard/products/base-products/${doc.id}`}
                  key={doc.id}
                >
                  <Image
                    src={doc.data().image_url}
                    width="300"
                    height="300"
                    alt={doc.data().title}
                    className="flex group-hover:hidden rounded-lg overflow-hidden w-full pb-[15px]"
                  />
                  <p>
                    <b>{doc.data().title}</b>
                  </p>
                </Link>
              );
            })}
          </section>
        )}
      </section>
    </section>
  );
}
