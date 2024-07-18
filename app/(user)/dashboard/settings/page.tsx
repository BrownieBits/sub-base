import { Metadata } from 'next';
import { cookies } from 'next/headers';
import GetSettings from './GetSettings';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Settings - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings/`,
      title: `Settings - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Settings - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function Settings() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');

  return <GetSettings userID={user_id?.value!} />;
}
