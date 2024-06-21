import Link from 'next/link';
import { HeroBanner } from '@/components/amaze-ui/HeroBanner';
import { Button } from '@/components/ui/button';
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
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProductsTable } from '@/components/amaze-ui/ProductsTable';
import { NoProducts } from '@/components/amaze-ui/NoProducts';
import { Separator } from '@/components/ui/separator';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`sign-in`);
  }
  const productsRef: CollectionReference = collection(db, 'products');
  const q = query(productsRef, where('store_id', '==', slug.value));
  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  return productData;
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
          <Button asChild variant="outline">
            <Link
              href={`/dashboard/products/baseProducts`}
              aria-label="Create Product"
              className="bg-layer hover:bg-layer-one hover:no-underline"
            >
              <i className="mr-2 h-4 w-4 fa-solid fa-circle-plus"></i>
              New Product
            </Link>
          </Button>
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
        {data.docs?.length! > 0 ? (
          <ProductsTable snapshot={data!} />
        ) : (
          <NoProducts />
        )}
      </section>
    </section>
  );
}
