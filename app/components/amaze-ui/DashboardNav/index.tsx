import Link from 'next/link';
import { Button } from '../../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faSquarePlus, faBars } from '@fortawesome/free-solid-svg-icons';
import { UserDropdown } from '../UserDropdown';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardSideNav } from '@/components/amaze-ui/DashboardSideNav';
import { cookies } from 'next/headers';
import { Logo } from '@/components/amaze-ui/Logo';

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
          <Button
            asChild
            variant="outline"
            className="bg-layer-one hover:bg-layer-two"
          >
            <Link
              href={`/dashboard/${user_slug?.value}/products/baseProducts`}
              aria-label="Start Creating"
            >
              <FontAwesomeIcon
                icon={faSquarePlus}
                className="mr-2 h-4 w-4 text-primary"
              />
              Create
            </Link>
          </Button>
        </li>
        <li>
          <UserDropdown />
        </li>
      </ul>
    </nav>
  );
};
