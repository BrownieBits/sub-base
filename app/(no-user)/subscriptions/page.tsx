import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import StoreCard from '@/components/sb-ui/StoreCard';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NoSubscriptions } from './NoSubscriptions';

type Props = {
  params: {};
};

async function getData(id: { [key: string]: string } | undefined) {
  if (id === undefined) {
    redirect(`/sign-in?redirect=/subscriptions`);
  }
  const userSubsRef = collection(db, 'users', id.value, 'subscribes');
  const data: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(userSubsRef);
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Subscriptions - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions/`,
      title: `Subscriptions - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Subscriptions - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function Subscriptions() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  const data = await getData(user_id);
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>My Subscriptions</h1>
        </section>
        <HeroBanner page_slug="creator-liked-items" />
      </section>
      <Separator />
      <section className="w-full max-w-[3096px] mx-auto">
        {data.docs.length === 0 ? (
          <NoSubscriptions />
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-[30px] gap-y-[60px] px-[15px] py-[30px]">
            {data.docs.map((doc) => {
              return <StoreCard id={doc.id} key={doc.id} />;
            })}
          </section>
        )}
      </section>
    </section>
  );
}
