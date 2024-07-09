import { db } from '@/lib/firebase';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Edit from './EditCollection';

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
    title: `${data.data().name} Collection - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://sub-base.vercel.app/dashboard/products/collections/${params.slug}/`,
      title: `${data.data().name} Collection - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `${data.data().name} Collection - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function EditCollection({ params }: Props) {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(params.slug, default_store?.value!);
  return (
    <Edit
      name={data.data().name}
      description={data.data().description}
      type={data.data().type}
      tags={data.data().tags}
      products={data.data().products}
      status={data.data().status}
      id={params.slug}
      store_id={default_store?.value!}
    />
  );
}
