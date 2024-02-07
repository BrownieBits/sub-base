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
  const user_slug = cookieStore.get('user_slug');
  const data = await getData(user_slug);
  return (
    <section>
      <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
        <h1>Products</h1>
        <Button asChild variant="outline">
          <Link
            href={`/dashboard/${user_slug?.value!}/products/baseProducts`}
            aria-label="Create Product"
            className="bg-layer hover:bg-layer-one hover:no-underline"
          >
            <i className="mr-2 h-4 w-4 fa-solid fa-circle-plus"></i>
            New Product
          </Link>
        </Button>
      </section>
      <HeroBanner
        page_slug="creator-products"
        displayName={user_slug?.value!}
      />
      <section className="flex w-full gap-[30px] justify-start border-b-[1px] px-[15px] pb-[10px]">
        <Button asChild variant="link" className="px-0 text-md">
          <Link
            href={`/dashboard/${user_slug?.value!}/products`}
            aria-label="Products"
          >
            Products
          </Link>
        </Button>
        <Button asChild variant="link" className="px-0 text-md">
          <Link
            href={`/dashboard/${user_slug?.value!}/products/collections`}
            aria-label="Collections"
          >
            Collections
          </Link>
        </Button>
      </section>
      {data.docs?.length! > 0 ? (
        <ProductsTable snapshot={data!} />
      ) : (
        <NoProducts />
      )}
    </section>
  );
}
