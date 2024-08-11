import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Privacy Policy - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy/`,
      title: `Privacy Policy - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Privacy Policy - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default function PrivacyPolicy() {
  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Privacy Policy</h1>
        </section>
        <HeroBanner page_slug="creator-privacy-policy" />
      </section>
      <Separator />
    </section>
  );
}
