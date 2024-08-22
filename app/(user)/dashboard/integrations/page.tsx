import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Integrations`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/`,
      title: `Integrations`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      title: `Integrations`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubBase Creator Platform',
    },
  };
}

export default function Integrations() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Integrations</h1>
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
        <HeroBanner page_slug="creator-integrations" />
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] mx-auto">
        <Button asChild>
          <Link
            href={`https://www.printful.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_PRINTFUL_CLIENT_ID}&state=${user_id?.value!}&redirect_url=https://${process.env.NEXT_PUBLIC_BASE_URL}/printful`}
          >
            Link to Printful
          </Link>
        </Button>
      </section>
    </section>
  );
}
