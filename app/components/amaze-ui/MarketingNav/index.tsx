import Link from 'next/link';
import { UserIcon } from './user-icon';
import { CartIcon } from './cart-icon';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { DashboardSideNav } from '@/components/amaze-ui/DashboardSideNav';
import { Logo } from '@/components/amaze-ui/Logo';

export const MarketingNav = () => {
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
              <DashboardSideNav menu="Marketing Menu" />
            </nav>
          </SheetContent>
        </Sheet>
        <section className="w-[22px] md:w-[120px]">
          <Logo url="/dashboard" />
        </section>
      </div>
      <ul className="flex gap-[15px] items-center">
        <li>
          <CartIcon />
        </li>
        <li>
          <UserIcon />
        </li>
      </ul>
    </nav>
  );
};
