import { AddProductButton } from '@/components/sb-ui/AddProductButton';
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
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { columns } from './DataColumns';
import { NoProducts } from './NoProducts';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`sign-in`);
  }
  const productsRef: CollectionReference = collection(db, 'products');
  const q = query(productsRef, where('store_id', '==', slug.value));
  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  const data = productData.docs.map((item) => {
    return {
      id: item.id,
      base_price: item.data().base_price,
      description: item.data().description,
      likes: item.data().likes,
      revenue: item.data().revenue,
      tags: item.data().tags,
      title: item.data().title,
      type: item.data().type,
      units_sold: item.data().units_sold,
      user_id: item.data().user_id,
      views: item.data().views,
      status: item.data().status,
      store_id: item.data().store_id,
      images: item.data().images,
    };
  });

  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Products',
  };
}

export default async function Products() {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data = await getData(default_store);
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Products</h1>
          <AddProductButton copy="Add Product" variant="outline" />
        </section>
        <HeroBanner page_slug="creator-products" />
        <section className="flex w-full gap-[30px] justify-start px-[15px]">
          <Button
            asChild
            variant="link"
            className="px-0 text-md text-foreground border-b-[2px] rounded-none hover:no-underline"
          >
            <Link href={`/dashboard/products`} aria-label="Products">
              Products
            </Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="px-0 text-md text-foreground rounded-none hover:no-underline border-b-[2px] border-transparent"
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
          <NoProducts />
        )}
      </section>
    </section>
  );
}
