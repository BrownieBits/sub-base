import { Button } from '@/components/ui/button';
import { HeroBanner } from '@/components/amaze-ui/HeroBanner';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Settings',
  };
}

export default function Settings({
  params,
}: {
  params: { displayName: string };
}) {
  return (
    <section>
      <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
        <h1>Settings</h1>
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
      <HeroBanner
        page_slug="creator-settings"
        displayName={params.displayName}
      />
      <section className="flex w-full gap-[30px] justify-start border-b-[1px] px-[15px] pb-[10px]">
        <Button asChild variant="link" className="px-0 text-md">
          <Link href="/dashboard/products" aria-label="Products">
            My Info
          </Link>
        </Button>
        <Button asChild variant="link" className="px-0 text-md">
          <Link href="/dashboard/products/collections" aria-label="Collections">
            Team
          </Link>
        </Button>
      </section>
    </section>
  );
}
