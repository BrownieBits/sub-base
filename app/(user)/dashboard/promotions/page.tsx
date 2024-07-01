import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import NewPromotionForm from './NewPromotionForm';
import { cookies } from 'next/headers';
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
import { db } from '@/lib/firebase';
import { redirect } from 'next/navigation';
import { NoPromotions } from './NoPromotions';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/sb-ui/DataTable';
import { columns } from './DataColumns';

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
    title: 'Promotions',
  };
}

export default async function Promotions() {
  const cookieStore = cookies();
  const user_slug = cookieStore.get('user_slug');
  const data = await getData(user_slug);
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Promotions</h1>
          <NewPromotionForm displayName={user_slug?.value!} />
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
