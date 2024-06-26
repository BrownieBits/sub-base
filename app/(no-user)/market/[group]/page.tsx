import { client, previewClient } from '@/lib/contentful';
import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { NoSubscriptions } from '@/components/sb-ui/NoSubscriptions';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import ProductCard from '@/components/sb-ui/ProductCard';

type Props = {
  params: { group: string };
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
    return 'No Page';
  } else {
    const productsColRef = collection(db, 'products');
    if (data.items[0].fields.type === 'Trending') {
      const q = query(
        productsColRef,
        where('revenue', '>', data.items[0].fields.trendingOver),
        orderBy('revenue')
      );
      const productsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(q);

      return {
        title: data.items[0].fields.title,
        products: productsData.docs,
      };
    } else if (data.items[0].fields.type === 'Manual') {
      const products = data.items[0].fields.productList.map((item: string) => {
        return { id: item };
      });
      return {
        title: data.items[0].fields.title,
        products: products,
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
        products: productsData.docs,
      };
    }
    return {
      title: data.items[0].fields.title,
      products: [],
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { isEnabled } = draftMode();
  // const currentClient = isEnabled ? previewClient : client;
  const currentClient = client;
  const data = await currentClient.getEntries({
    content_type: 'marketplacePage',
    'fields.slug': `${params.group}`,
  });
  if (data.items.length === 0) {
    return {
      title: 'Marketplace',
    };
  }
  return {
    title: data.items[0].fields.title,
  };
}

export default async function MarketplacePage({ params }: Props) {
  const data = await getData(params.group);

  if (data === 'No Page') {
    return <>No Marketplace Page</>;
  }

  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>{data.title}</h1>
        </section>
        <HeroBanner page_slug="creator-liked-items" />
      </section>
      <Separator />
      <section className="w-full max-w-[3096px] mx-auto">
        {data.products.length === 0 ? (
          <NoSubscriptions />
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-[30px] gap-y-[60px] p-[15px]">
            {data.products.map((doc: any) => {
              return (
                <ProductCard id={doc.id} show_creator={true} key={doc.id} />
              );
            })}
          </section>
        )}
      </section>
    </section>
  );
}
