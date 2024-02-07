import { HeroBanner } from '@/components/amaze-ui/HeroBanner';
import NewPromotionForm from '@/components/amaze-ui/NewPromotionForm';
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
import { db } from '@/firebase';
import { redirect } from 'next/navigation';
import { NoPromotions } from '@/components/amaze-ui/NoPromotions';
import { PromotionsTable } from '@/components/amaze-ui/PromotionsTable';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`sign-in`);
  }
  const promotionsRef: CollectionReference = collection(db, 'promotions');
  const q = query(promotionsRef, where('store_id', '==', slug.value));
  const promotionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  return promotionsData;
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
      <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
        <h1>Promotions</h1>
        <NewPromotionForm displayName={user_slug?.value!} />
      </section>
      <HeroBanner
        page_slug="creator-promotions"
        displayName={user_slug?.value!}
      />
      {data?.docs?.length! > 0 ? (
        <PromotionsTable snapshot={data!} />
      ) : (
        <NoPromotions />
      )}
    </section>
  );
}
