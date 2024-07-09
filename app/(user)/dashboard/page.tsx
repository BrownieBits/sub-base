import { Button } from '@/components/ui/button';
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
      url: `https://sub-base.vercel.app/dashboard/`,
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
    </>
  );
}
