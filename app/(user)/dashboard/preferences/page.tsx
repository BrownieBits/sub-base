import { db } from '@/lib/firebase';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditForm from './EditForm';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`sign-in`);
  }
  const docRef: DocumentReference = doc(db, 'stores', slug?.value);
  const data: DocumentData = await getDoc(docRef);
  if (!data.exists()) {
    redirect(`/dashboard`);
  }
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(default_store);
  return {
    title: `${data.data().name} - Preferences - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/preferences/`,
      title: `${data.data().name} - Preferences - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `${data.data().name} - Preferences - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function Preferences() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(default_store);

  async function revalidate() {
    'use server';
    revalidatePath(`/dashboard/preferences`);
  }

  return (
    <EditForm
      data={data.data()}
      storeID={default_store?.value!}
      revalidate={revalidate}
      userID={user_id!.value}
    />
  );
}
