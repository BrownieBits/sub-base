import { db } from '@/firebase';
import {
  DocumentReference,
  doc,
  DocumentData,
  getDoc,
} from 'firebase/firestore';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Edit from './EditCollection';
import { cookies } from 'next/headers';

type Props = {
  params: { slug: string };
};

async function getData(slug: string, default_store: string) {
  const docRef: DocumentReference = doc(
    db,
    `stores/${default_store}/collections`,
    slug
  );
  const data: DocumentData = await getDoc(docRef);
  if (!data.exists()) {
    redirect(`/dashboard/products/collections`);
  }
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(params.slug, default_store?.value!);
  return {
    title: data.data().name,
  };
}

export default async function EditCollection({ params }: Props) {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(params.slug, default_store?.value!);
  return (
    <Edit
      data={data.data()}
      id={params.slug}
      store_id={default_store?.value!}
    />
  );
}
