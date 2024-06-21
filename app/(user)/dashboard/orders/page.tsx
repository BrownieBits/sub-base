import { HeroBanner } from '@/components/amaze-ui/HeroBanner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Orders',
  };
}

export default function Orders() {
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Orders</h1>
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
        <HeroBanner page_slug="creator-orders" />
      </section>
      <Separator />
      <section className="w-full max-w-[3096px] mx-auto"></section>
    </section>
  );
}
