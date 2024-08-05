import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LatestProduct } from './LatestProduct';
import { StoreAnalytics } from './StoreAnalytics';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`sign-in`);
  }
  const docRef: DocumentReference = doc(db, 'stores', slug?.value);
  const data: DocumentData = await getDoc(docRef);
  if (!data.exists()) {
    redirect(`/dashboard/products/collections`);
  }
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(default_store);
  return {
    title: `${data.data().name} - Dashboard - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/`,
      title: `${data.data().name} - Dashboard - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `${data.data().name} - Dashboard - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function Dashboard() {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(default_store);

  return (
    <>
      {!data.data().password_protected ? (
        <></>
      ) : (
        <section className="w-full flex justify-center bg-destructive py-[5px]">
          <p>
            Your store is currently password protect with:{' '}
            <b>{data.data().password}</b>. You can change this in the{' '}
            <Button
              variant="link"
              size="sm"
              asChild
              className="text-foreground px-[5px]"
            >
              <Link href="/dashboard/preferences">
                <FontAwesomeIcon className="icon mr-[5px]" icon={faStore} />
                <b>Preferences</b>
              </Link>
            </Button>
          </p>
        </section>
      )}

      <section>
        <section className="w-full max-w-[3096px] mx-auto">
          <section className="flex w-full justify-between items-center px-4 py-8 gap-4">
            <h1>Dashboard</h1>
          </section>
          <HeroBanner page_slug="creator-dashboard" />
        </section>
        <Separator />
        <section className="w-full max-w-[3096px] mx-auto flex flex-col md:flex-row gap-8 py-8">
          <section className="flex-1 bg-layer-one border rounded">
            <LatestProduct />
          </section>
          <section className="flex-1">
            <StoreAnalytics />
          </section>
          <section className="flex-1 h-20 border rounded"></section>
        </section>
      </section>
    </>
  );
}
