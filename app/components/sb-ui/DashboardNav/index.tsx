import { DashboardSideNav } from '@/components/sb-ui/DashboardSideNav';
import { Logo } from '@/components/sb-ui/Logo';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Button } from '../../ui/button';
import { AddProductButton } from '../AddProductButton';
import { UserDropdown } from '../UserDropdown';

export const DashboardNav = () => {
  return (
    <nav className="flex h-[56px] items-center justify-between border-b-[1px] border-b-border bg-layer-one px-4">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger className="flex xl:hidden" asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-layer-one hover:bg-layer-two"
            >
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetTitle className="hidden"></SheetTitle>
            <SheetDescription>
              <nav className={`flex h-[100vh] bg-layer-one`}>
                <DashboardSideNav menu="Dashboard Menu" inSheet={true} />
              </nav>
            </SheetDescription>
          </SheetContent>
        </Sheet>
        <section className="w-[40px] md:w-[120px]">
          <Logo url="/dashboard" />
        </section>
      </div>
      <ul className="flex items-center gap-4 md:gap-8">
        <li>
          <Button asChild variant="link" size="sm" className="px-0">
            <Link href="/" aria-label="Spring by Amaze">
              <FontAwesomeIcon icon={faBell} />
            </Link>
          </Button>
        </li>
        <li>
          <AddProductButton
            copy="Create"
            variant="outline"
            size="sm"
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
