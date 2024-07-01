import { DashboardSideNav } from '@/components/sb-ui/DashboardSideNav';
import { Logo } from '@/components/sb-ui/Logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '../../ui/button';
import { AddProductButton } from '../AddProductButton';
import { UserDropdown } from '../UserDropdown';

export const DashboardNav = () => {
  const cookieStore = cookies();
  const user_slug = cookieStore.get('user_slug');

  return (
    <nav className="flex items-center justify-between sticky px-[15px] h-[56px] top-0 z-10 overflow-auto border-r-[1px] bg-layer-one border-b-[1px] border-b-border">
      <div className="flex gap-[15px]">
        <Sheet>
          <SheetTrigger className="flex xl:hidden">
            <Button
              variant="outline"
              className="bg-layer-one hover:bg-layer-two"
              asChild
            >
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <nav className={`flex bg-layer-one h-[100vh]`}>
              <DashboardSideNav menu="Dashboard Menu" />
            </nav>
          </SheetContent>
        </Sheet>
        <section className="w-[22px] md:w-[120px]">
          <Logo url="/dashboard" />
        </section>
      </div>
      <ul className="flex gap-[15px] md:gap-[30px] items-center">
        <li>
          <Button asChild variant="link" className="px-0">
            <Link href="/" aria-label="Spring by Amaze">
              <FontAwesomeIcon icon={faBell} />
            </Link>
          </Button>
        </li>
        <li>
          <AddProductButton
            copy="Create"
            variant="outline"
            className="bg-layer-one hover:bg-layer-two"
          />
        </li>
        <li>
          <UserDropdown />
        </li>
      </ul>
    </nav>
  );
};
