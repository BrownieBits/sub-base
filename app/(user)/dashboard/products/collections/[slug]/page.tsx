import { db } from '@/firebase';
import {
  DocumentReference,
  doc,
  DocumentData,
  getDoc,
} from 'firebase/firestore';
import type { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import Edit from './EditCollection';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

type Props = {
  params: { id: string; slug: string };
};

async function getData(slug: string) {
  const cookieStore = cookies();
  const user_slug = cookieStore.get('user_slug');
  if (user_slug === undefined) {
    redirect(`/sign-in`);
  }
  const docRef: DocumentReference = doc(db, 'collections', slug);
  const data: DocumentData = await getDoc(docRef);
  if (!data.exists()) {
    redirect(`/dashboard/products/collections`);
  }
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: DocumentData = await getData(params.slug);
  return {
    title: data.data().title,
  };
}

export default async function EditCollection({ params }: Props) {
  const cookieStore = cookies();
  const user_slug = cookieStore.get('user_slug');
  const data: DocumentData = await getData(params.slug);
  async function revalidate() {
    'use server';
    revalidatePath(`/dashboard/products/collections/${params.slug}`);
  }
  return (
    <Edit
      data={data.data()}
      id={params.slug}
      revalidate={revalidate}
      displayName={user_slug!.value}
    />
  );
}
