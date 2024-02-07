import { HeroBanner } from '@/components/amaze-ui/HeroBanner';

export default function SendFeedback() {
  return (
    <section>
      <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
        <h1>Send Feedback</h1>
        {/* <Button asChild variant="outline">
          <Link
            href="/dashboard/products/baseProducts"
            aria-label="Create Product"
            className="bg-layer hover:bg-layer-one hover:no-underline"
          >
            <i className="mr-2 h-4 w-4 fa-solid fa-circle-plus"></i>
            Create Product
          </Link>
        </Button> */}
      </section>
      <HeroBanner page_slug="creator-feedback" displayName="" />
    </section>
  );
}
