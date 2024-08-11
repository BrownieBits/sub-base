import { DashboardSideNav } from '@/components/sb-ui/DashboardSideNav';
import { MarketingNav } from '../components/sb-ui/MarketingNav';

export default function NoUserLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full overflow-hidden">
      <section className="w-full">
        <MarketingNav />
      </section>
      <section className="w-full grid grid-cols-[0_auto] xl:grid-cols-[250px_auto]">
        <nav
          className={`flex border-r-[1px] border-r-border bg-layer-one h-[calc(100vh-56px)] min-h-[calc(100vh-56px)]`}
        >
          <DashboardSideNav menu="Marketing Menu" inSheet={false} />
        </nav>
        <main className="h-[calc(100vh-56px)] overflow-x-hidden">
          {children}
        </main>
      </section>
    </section>
  );
}
