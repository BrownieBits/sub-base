import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import ProductCard from '@/components/sb-ui/ProductCard';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { GridProduct } from '@/lib/types';
import {
  DocumentData,
  QuerySnapshot,
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NoLikes } from './NoLikes';

type Data = {
  products?: QuerySnapshot<DocumentData, DocumentData>;
  error?: string;
};

async function getData(id: { [key: string]: string } | undefined) {
  if (id === undefined) {
    redirect(`sign-in?redirect=/my-likes`);
  }
  const userSubsRef = collection(db, 'users', id.value, 'likes');
  const data: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(userSubsRef);

  if (data.docs.length === 0) {
    return {
      error: 'No Likes',
    };
  }
  const ids = data.docs.map((doc) => doc.id);
  const productsRef = collection(db, 'products');
  const productsQuery = query(
    productsRef,
    where('__name__', 'in', ids),
    where('status', '==', 'Public')
  );

  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(productsQuery);

  return {
    products: productData,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `My Likes - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/my-likes/`,
      title: `My Likes - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `My Likes - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function LikedItems() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  const data: Data = await getData(user_id);
  if (data.error === 'No Likes') {
    return <NoLikes />;
  }
  let products: GridProduct[] = [];
  if (data.products) {
    products = data.products?.docs.map((product): GridProduct => {
      return {
        name: product.data().name as string,
        images: product.data().images as string[],
        product_type: product.data().product_type as string,
        price: product.data().price as number,
        compare_at: product.data().compare_at as number,
        currency: product.data().currency as string,
        like_count: product.data().like_count as number,
        store_id: product.data().store_id as string,
        created_at: product.data().created_at as Timestamp,
        id: product.id as string,
      };
    });
  }

  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>My Likes</h1>
        </section>
        <HeroBanner page_slug="creator-liked-items" />
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-8 p-4">
          {products?.map((doc) => (
            <ProductCard product={doc} show_creator={false} key={doc.id} />
          ))}
        </section>
      </section>
    </section>
  );
}
