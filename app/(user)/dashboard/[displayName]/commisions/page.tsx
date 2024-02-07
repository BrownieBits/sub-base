import { Button } from '@/components/ui/button';
import { HeroBanner } from '@/components/amaze-ui/HeroBanner';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Commissions',
  };
}

export default function Commisions({
  params,
}: {
  params: { displayName: string };
}) {
  return (
    <section>
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
      <HeroBanner
        page_slug="creator-commisions"
        displayName={params.displayName}
      />
    </section>
  );
}
