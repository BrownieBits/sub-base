import DigitalEditForm from '@/components/sb-ui/ProductEditForms/digitalEditForm';
import { db } from '@/lib/firebase';
import { ProductImage } from '@/lib/types';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
type Props = {
  params: { productID: string };
};

async function getData(productID: string) {
  const docRef: DocumentReference = doc(db, `products`, productID);
  const data: DocumentData = await getDoc(docRef);
  if (!data.exists()) {
    redirect(`/dashboard/products`);
  }

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: DocumentData = await getData(params.productID);
  return {
    title: `${data.data().name} - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/new-digital`,
      title: `${data.data().name} - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `${data.data().name} - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function NewDigitalProduct({ params }: Props) {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const user_id = cookieStore.get('user_id');
  const data: DocumentData = await getData(params.productID);
  const images: ProductImage[] = data
    .data()
    .images.map((image: string, index: number) => {
      return { id: index, image: image };
    });
  if (data.data().vendor === 'digital') {
    return (
      <DigitalEditForm
        storeID={default_store?.value!}
        userID={user_id?.value!}
        docID={data.id}
        name={data.data().name}
        description={data.data().description}
        product_images={images}
        digital_file={data.data().digital_file}
        digital_file_name={data.data().digital_file_name}
        tags={data.data().tags}
        price={data.data().price}
        compare_at={data.data().compare_at}
        currency={data.data().currency}
        sku={data.data().sku}
        is_featured={data.data().is_featured}
        status={data.data().status}
      />
    );
  }
  return <></>;
}
