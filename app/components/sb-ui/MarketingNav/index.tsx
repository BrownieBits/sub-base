import { DashboardSideNav } from '@/components/sb-ui/DashboardSideNav';
import { Logo } from '@/components/sb-ui/Logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CartIcon } from './cart-icon';
import { UserIcon } from './user-icon';

export const MarketingNav = () => {
  return (
    <nav className="flex items-center justify-between px-4 h-[56px] bg-layer-one border-b-[1px] border-b-border">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger className="flex xl:hidden">
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
              <nav className={`flex bg-layer-one h-[100vh]`}>
                <DashboardSideNav menu="Marketing Menu" inSheet={true} />
              </nav>
            </SheetDescription>
          </SheetContent>
        </Sheet>
        <section className="w-[40px] md:w-[120px]">
          <Logo url="/" />
        </section>
      </div>
      <ul className="flex gap-4 items-center">
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
