import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Commissions - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://sub-base.vercel.app/dashboard/commissions/`,
      title: `Commissions - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Commissions - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default function Commisions() {
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Commissions</h1>
          <Button asChild variant="outline">
            <Link
              href="/dashboard/products/baseProducts"
              aria-label="Create Product"
              className="bg-layer hover:bg-layer-one hover:no-underline"
            >
              <i className="mr-2 h-4 w-4 fa-solid fa-circle-plus"></i>
              New Payout
            </Link>
          </Button>
        </section>
        <HeroBanner page_slug="creator-commisions" />
      </section>
      <Separator />
      <section className="w-full max-w-[3096px] mx-auto"></section>
    </section>
  );
}
