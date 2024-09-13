import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import ProductCard from '@/components/sb-ui/ProductCard';
import { Separator } from '@/components/ui/separator';
import { client } from '@/lib/contentful';
import { db } from '@/lib/firebase';
import { GridProduct } from '@/lib/types';
import {
  DocumentData,
  QuerySnapshot,
  Timestamp,
  collection,
  getDocs,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { NoProducts } from './NoProducts';

type Props = {
  params: { group: string };
};
type Data = {
  error?: string;
  title?: string;
  products?: QuerySnapshot<DocumentData, DocumentData>;
};

async function getData(group: string) {
  const { isEnabled } = draftMode();
  // const currentClient = isEnabled ? previewClient : client;
  const currentClient = client;
  const data = await currentClient.getEntries({
    content_type: 'marketplacePage',
    'fields.slug': `${group}`,
  });
  if (data.items.length === 0) {
    return {
      error: 'No Page',
    };
  } else {
    const productsColRef = collection(db, 'products');
    if (data.items[0].fields.type === 'Trending') {
      const q = query(
        productsColRef,
        where('revenue', '>=', data.items[0].fields.trendingOver),
        orderBy('revenue')
      );
      const productsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(q);

      return {
        title: data.items[0].fields.title,
        products: productsData,
      };
    } else if (data.items[0].fields.type === 'Manual') {
      const products = data.items[0].fields.productList.map((item: string) => {
        return item;
      });
      const q = query(productsColRef, where('__name__', 'in', products));
      const productsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(q);
      return {
        title: data.items[0].fields.title,
        products: productsData,
      };
    } else if (data.items[0].fields.type === 'Tags') {
      const q = query(
        productsColRef,
        or(
          where('tags', 'array-contains-any', data.items[0].fields.tags),
          where('admin_tags', 'array-contains-any', data.items[0].fields.tags)
        )
      );
      const productsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(q);
      return {
        title: data.items[0].fields.title,
        products: productsData,
      };
    }
    return {
      title: data.items[0].fields.title,
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: Data = await getData(params.group);
  if (data.error === 'No Page') {
    return {
      title: 'Marketplace',
    };
  }

  const description = `Discover a vast selection of ${params.group} products at SubPort. Find everything from ${data.products?.docs[0].data().name} to ${data.products?.docs[1].data().name} and more. Compare prices, read reviews, and enjoy safe and secure shopping. Explore our diverse range of ${params.group} products today!`;
  return {
    title: `${data.title} Marketplace`,
    description: description,
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/market/${params.group}`,
      title: `${data.title} Marketplace`,
      siteName: 'SubPort Creator Platform',
      description: description,
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `${data.title} Marketplace`,
      description: description,
      site: 'SubPort Creator Platform',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
  };
}

export default async function MarketplacePage({ params }: Props) {
  const data: Data = await getData(params.group);

  if (data.error === 'No Page') {
    return <>No Marketplace Page</>;
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
          <h1>{data.title}</h1>
        </section>
        <HeroBanner page_slug="creator-liked-items" />
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] mx-auto">
        {products.length === 0 ? (
          <NoProducts />
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-8 p-4">
            {products?.map((doc) => (
              <ProductCard product={doc} show_creator={true} key={doc.id} />
            ))}
          </section>
        )}
      </section>
    </section>
  );
}
