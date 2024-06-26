import CreatorCard from '@/components/sb-ui/CreatorCard';
import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { NoSubscriptions } from '@/components/sb-ui/NoSubscriptions';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
} from 'firebase/firestore';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Subscriptions',
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
          <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-[30px] gap-y-[60px] p-[15px]">
            {data.docs.map((doc) => {
              return <CreatorCard id={doc.id} key={doc.id} />;
            })}
          </section>
        )}
      </section>
    </section>
  );
}
