import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Tools`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/tools/`,
      title: `Tools`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      title: `Tools`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubBase Creator Platform',
    },
  };
}

export default function Tools() {
  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Tools</h1>
          {/* <Button asChild variant="outline">
          <Link
            href="/dashboard/products/baseProducts"
            aria-label="Create Product"
            className="bg-layer hover:bg-layer-one hover:no-underline"
          >
            <i className="mr-2 h-4 w-4 fa-solid fa-circle-plus"></i>
            Create Payout
          </Link>
        </Button> */}
        </section>
        <HeroBanner page_slug="creator-tools" />
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] mx-auto"></section>
    </section>
  );
}
