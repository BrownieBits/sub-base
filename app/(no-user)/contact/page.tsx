import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Contact - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/contact/`,
      title: `Contact - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Contact - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default function Contact() {
  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Contact</h1>
        </section>
        <HeroBanner page_slug="creator-contact" />
      </section>
      <Separator />
    </section>
  );
}
