import DigitalEditForm from '@/components/sb-ui/ProductEditForms/digitalEditForm';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `New Digital Product`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/new-digital`,
      title: `New Digital Product`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      title: `New Digital Product`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function NewDigitalProduct() {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const user_id = cookieStore.get('user_id');
  return (
    <DigitalEditForm storeID={default_store?.value!} userID={user_id?.value!} />
  );
}
