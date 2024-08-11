import { ContentfulVideo } from '@/components/sb-ui/ContentfulVideo';
import ProductCard from '@/components/sb-ui/ProductCard';
import { client } from '@/lib/contentful';
import { analytics, db } from '@/lib/firebase';
import { GridProduct } from '@/lib/types';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  Timestamp,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';

type Data = {
  products: QuerySnapshot<DocumentData, DocumentData>;
  collections: QuerySnapshot<DocumentData, DocumentData>;
};

async function getData() {
  analytics;
  const productsRef: CollectionReference = collection(db, 'products');
  const q = query(
    productsRef,
    where('status', '==', 'Public'),
    where('created_at', '!=', null),
    orderBy('created_at', 'desc')
  );
  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  return productData;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/`,
      title: `SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function Home() {
  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getData();
  const data = await client.getEntries({
    content_type: 'page',
    'fields.title': 'Home Page',
  });
  const items = data.items[0].fields.pageItems;
  let products: GridProduct[] = productData.docs.map((product): GridProduct => {
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

  return (
    <main>
      <section className="w-full max-w-[2428px] mx-auto">
        {items.map((item: any, i: number) => {
          if (item.sys.contentType.sys.id === 'videoBlock') {
            return (
              <ContentfulVideo
                alt={item.title}
                src={`https:${item.fields.video.fields.file.url}`}
                maxWidth={item.fields.maxWidth}
                key={`contentful-video-${i}`}
              />
            );
          } else if (item.sys.contentType.sys.id === 'imageTiles') {
            return (
              <></>
              // <ContentfulImageTiles id={item.sys.id} key={`image-tiles-${i}`} />
            );
          }
          return <></>;
        })}
        <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-8 p-4">
          {products?.map((doc) => (
            <ProductCard product={doc} show_creator={true} key={doc.id} />
          ))}
        </section>
      </section>
    </main>
  );
}
