import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `No Store Here - SubBase Creator Platform`,
    description: 'There was no store id given so our Sub lost its way.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/store/`,
      title: `No Store Here - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description: 'There was no store id given so our Sub lost its way.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `No Store Here - SubBase Creator Platform`,
      description: 'There was no store id given so our Sub lost its way.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default function StoreDoesntExistPage() {
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-8 gap-4">
          <h1>Help</h1>
        </section>
        <HeroBanner page_slug="creator-help" />
      </section>
      <Separator />
    </section>
  );
}
