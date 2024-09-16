'use client';

import { SheetClose } from '@/components/ui/sheet';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '../../ui/button';

export const MenuItem = (props: any) => {
  const [user, loading, userError] = useAuthState(auth);
  const pathname = usePathname();
  let isCurrent = false;
  if (
    (pathname! === '/dashboard' && props.item.fields.slug === 'dashboard') ||
    (props.item.fields.slug !== 'dashboard' &&
      pathname?.includes(props.item.fields.slug))
  ) {
    isCurrent = true;
  }
  if (loading) {
    return <></>;
  }
  if (props.item.fields.needsLogin && !user) {
    if (props.inSheet) {
      return (
        <li>
          <SheetClose asChild>
            <Button
              asChild
              variant="link"
              aria-label="Sign In to Access"
              title="Sign In to Access"
              className="w-full justify-start rounded-none px-4 py-0 text-muted-foreground"
            >
              <Link
                href="/sign-in"
                aria-label="Sign In to Access"
                className="bg-layer-one hover:bg-layer-two hover:no-underline"
              >
                <i className={`mr-2 h-4 w-4 ${props.item.fields.iconName}`}></i>
                {props.item.fields.title}
              </Link>
            </Button>
          </SheetClose>
        </li>
      );
    }
    return (
      <li>
        <Button
          asChild
          variant="link"
          aria-label="Sign In to Access"
          title="Sign In to Access"
          className="w-full justify-start rounded-none px-4 py-0 text-muted-foreground"
        >
          <Link
            href="/sign-in"
            aria-label="Sign In to Access"
            className="bg-layer-one hover:bg-layer-two hover:no-underline"
          >
            <i className={`mr-2 h-4 w-4 ${props.item.fields.iconName}`}></i>
            {props.item.fields.title}
          </Link>
        </Button>
      </li>
    );
  }
  if (props.inSheet) {
    return (
      <li>
        <Button
          asChild
          variant="link"
          className="w-full justify-start rounded-none px-4 py-0 text-foreground"
        >
          <SheetClose asChild>
            <Link
              href={props.item.fields.url}
              aria-label={props.item.fields.title}
              className={cn('w-full hover:no-underline', {
                'bg-layer-two hover:bg-layer-three': isCurrent,
                'bg-layer-one hover:bg-layer-two': !isCurrent,
              })}
            >
              <i className={`mr-2 h-4 w-4 ${props.item.fields.iconName}`}></i>
              {props.item.fields.title}
            </Link>
          </SheetClose>
        </Button>
      </li>
    );
  }
  return (
    <li>
      <Button
        asChild
        variant="link"
        className="w-full justify-start rounded-none px-4 py-0 text-foreground"
      >
        <Link
          href={props.item.fields.url}
          aria-label={props.item.fields.title}
          className={cn('hover:no-underline', {
            'bg-layer-two hover:bg-layer-three': isCurrent,
            'bg-layer-one hover:bg-layer-two': !isCurrent,
          })}
        >
          <i className={`mr-2 h-4 w-4 ${props.item.fields.iconName}`}></i>
          {props.item.fields.title}
        </Link>
      </Button>
    </li>
  );
};
