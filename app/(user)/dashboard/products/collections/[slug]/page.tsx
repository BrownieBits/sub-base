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

type Props = {
  params: { slug: string };
};

async function getData(slug: string) {
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
    title: data.data().name,
  };
}

export default async function EditCollection({ params }: Props) {
  const data: DocumentData = await getData(params.slug);
  return <Edit data={data.data()} id={params.slug} />;
}
