import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { Suspense } from 'react';
import CartDetailPage from './CartDetailPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Cart - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/Cart/`,
      title: `Cart - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Cart - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function Cart() {
  const cookieStore = cookies();
  const cartId = cookieStore.get(`cart_id`);
  const country = (headers().get('x-geo-country') as string) || 'US';
  const city = (headers().get('x-geo-city') as string) || 'Los Angeles';
  const region = (headers().get('x-geo-region') as string) || 'CA';
  const ip = (headers().get('x-ip') as string) || '0.0.0.0';

  return (
    <Suspense fallback={<></>}>
      <CartDetailPage
        cart_id={cartId?.value!}
        country={country}
        city={city}
        region={region}
        ip={ip}
      />
    </Suspense>
  );
}
