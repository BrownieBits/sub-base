import SelfEditForm from '@/components/sb-ui/ProductEditForms/selfEditForm';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `New Self Made Product - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/new-self-made`,
      title: `New Self Made Product - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `New Self Made Product - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function NewSelfMadeProduct() {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const user_id = cookieStore.get('user_id');
  return (
    <SelfEditForm storeID={default_store?.value!} userID={user_id?.value!} />
  );
}
