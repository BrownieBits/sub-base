import { UserChecker } from '@/components/sb-ui/UserChecker';
import { DashboardNav } from '../components/sb-ui/DashboardNav';
import { DashboardSideNav } from '../components/sb-ui/DashboardSideNav';

export default function UserLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative w-full overflow-hidden">
      <section className="w-full">
        <DashboardNav />
      </section>
      <section className="grid w-full grid-cols-[0_auto] xl:grid-cols-[250px_auto]">
        <nav
          className={`flex h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] border-r-[1px] border-r-border bg-layer-one`}
        >
          <DashboardSideNav menu="Dashboard Menu" inSheet={false} />
        </nav>
        <main className="relative h-[calc(100vh-56px)] overflow-x-hidden pb-12">
          {children}
        </main>
      </section>
      <UserChecker />
    </section>
  );
}
