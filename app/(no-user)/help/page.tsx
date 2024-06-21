import { HeroBanner } from '@/components/amaze-ui/HeroBanner';
import { Separator } from '@/components/ui/separator';

export default function Help() {
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Help</h1>
        </section>
        <HeroBanner page_slug="creator-help" />
      </section>
      <Separator />
    </section>
  );
}
