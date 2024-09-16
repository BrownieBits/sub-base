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
                <DashboardSideNav menu="Marketing Menu" inSheet={true} />
              </nav>
            </SheetDescription>
          </SheetContent>
        </Sheet>
        <section className="w-[40px] md:w-[120px]">
          <Logo url="/" />
        </section>
      </div>
      <ul className="flex items-center gap-4">
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
