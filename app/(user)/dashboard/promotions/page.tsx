import { DataTable } from '@/components/sb-ui/DataTable';
import { HeroBanner } from '@/components/sb-ui/HeroBanner';
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
import { redirect } from 'next/navigation';
import { columns } from './DataColumns';
import NewPromotionForm from './NewPromotionForm';
import { NoPromotions } from './NoPromotions';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`sign-in`);
  }
  const promotionsRef: CollectionReference = collection(db, 'promotions');
  const q = query(promotionsRef, where('store_id', '==', slug.value));
  const promotionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  const data = promotionsData.docs.map((item) => {
    return {
      id: item.id,
      amount: item.data().amount,
      title: item.data().title,
      minimum_order_value: item.data().minimum_order_value,
      number_of_uses: item.data().number_of_used,
      times_used: item.data().times_used,
      type: item.data().type,
      user_id: item.data().user_id,
      status: item.data().status,
      store_id: item.data().store_id,
      show_in_banner: item.data().show_in_banner,
    };
  });

  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Promotions - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/promotions/`,
      title: `Promotions - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Promotions - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function Promotions() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  const default_store = cookieStore.get('default_store');
  const data = await getData(default_store);
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-8 gap-4">
          <h1>Promotions</h1>
          <NewPromotionForm displayName={default_store?.value!} />
        </section>
        <HeroBanner page_slug="creator-promotions" />
      </section>
      <Separator />
      <section className="w-full max-w-[3096px] mx-auto">
        {data?.length! > 0 ? (
          <DataTable columns={columns} data={data!} />
        ) : (
          <NoPromotions />
        )}
      </section>
    </section>
  );
}
