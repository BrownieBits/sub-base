import { HeroBanner } from '@/components/amaze-ui/HeroBanner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/firebase';
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
import EditForm from './EditForm';
import { revalidatePath } from 'next/cache';

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
    title: `${data.data().name} - Preferences`,
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
