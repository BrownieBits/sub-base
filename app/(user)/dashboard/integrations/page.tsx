import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Integrations - SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://sub-base.vercel.app/dashboard/integrations/`,
      title: `Integrations - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `Integrations - SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

export default function Integrations() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
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
      <section className="w-full max-w-[3096px] mx-auto">
        <Button asChild>
          <Link
            href={`https://www.printful.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_PRINTFUL_CLIENT_ID}&state=${user_id?.value!}&redirect_url=https://4383-97-118-192-39.ngrok-free.app/printful`}
          >
            Link to Printful
          </Link>
        </Button>
      </section>
    </section>
  );
}
