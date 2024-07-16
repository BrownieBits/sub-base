import { UserChecker } from '@/components/sb-ui/UserChecker';
import { DashboardNav } from '../components/sb-ui/DashboardNav';
import { DashboardSideNav } from '../components/sb-ui/DashboardSideNav';

export default function UserLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full overflow-hidden relative">
      <section className="w-full">
        <DashboardNav />
      </section>
      <section className="w-full grid grid-cols-[0_auto] xl:grid-cols-[250px_auto]">
        <nav
          className={`flex border-r-[1px] border-r-border bg-layer-one h-[calc(100vh-56px)] min-h-[calc(100vh-56px)]`}
        >
          <DashboardSideNav menu="Dashboard Menu" />
        </nav>
        <main className="h-[calc(100vh-56px)] overflow-x-hidden pb-[250px] relative">
          {children}
        </main>
      </section>
      <UserChecker />
    </section>
  );
}
