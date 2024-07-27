import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import ProductCard from '@/components/sb-ui/ProductCard';
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
import { NoLikes } from './NoLikes';

async function getData(id: { [key: string]: string } | undefined) {
  if (id === undefined) {
    redirect(`sign-in?redirect=/my-likes`);
  }
  const userSubsRef = collection(db, 'users', id.value, 'likes');
  const data: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(userSubsRef);
  return data;
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
  const data = await getData(user_id);
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-8 gap-4">
          <h1>My Likes</h1>
        </section>
        <HeroBanner page_slug="creator-liked-items" />
      </section>
      <Separator />
      <section className="w-full max-w-[3096px] mx-auto">
        {data.docs.length === 0 ? (
          <NoLikes />
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-[60px] p-4">
            {data.docs.map((doc) => {
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
