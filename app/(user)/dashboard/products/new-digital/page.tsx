import { Metadata } from 'next';
import { cookies } from 'next/headers';
import EditForm from './EditForm';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `New Digital Product - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://sub-base.vercel.app/dashboard/products/new-digital`,
      title: `New Digital Product - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `New Digital Product - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function NewDigitalProduct() {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const user_id = cookieStore.get('user_id');
  return <EditForm storeID={default_store?.value!} userID={user_id?.value!} />;
}
