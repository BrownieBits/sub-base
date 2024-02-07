'use client';

import Link from 'next/link';
import { Button } from '../../ui/button';
import { usePathname } from 'next/navigation';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export const MenuItem = (props: any) => {
  const [user, loading, userError] = useAuthState(auth);
  const pathname = usePathname();

  if (loading) {
    return <></>;
  }

  if (props.item.fields.url.includes('{user}') && !user) {
    return (
      <li>
        <Button
          asChild
          variant="link"
          aria-label="Sign In to Access"
          title="Sign In to Access"
          className="px-[15px] py-0 w-full justify-start"
        >
          <Link
            href="/sign-in"
            aria-label="Sign In to Access"
            className="bg-layer-one hover:bg-layer-two hover:no-underline text-muted-foreground"
          >
            <i className={`mr-2 h-4 w-4 ${props.item.fields.iconName}`}></i>
            {props.item.fields.title}
          </Link>
        </Button>
      </li>
    );
  }
  return (pathname! === '/dashboard' &&
    props.item.fields.slug === 'dashboard') ||
    (props.item.fields.slug !== 'dashboard' &&
      pathname?.includes(props.item.fields.slug)) ? (
    <li>
      <Button
        asChild
        variant="link"
        aria-aria-label={props.item.fields.title}
        title={props.item.fields.title}
        className="px-[15px] py-0 w-full justify-start"
      >
        <Link
          href={props.item.fields.url.replace(
            '{user}',
            user?.displayName?.toLowerCase()
          )}
          aria-label={props.item.fields.title}
          className="bg-layer-two hover:bg-layer-three hover:no-underline font-bold"
        >
          <i className={`mr-2 h-4 w-4 ${props.item.fields.iconName}`}></i>
          {props.item.fields.title}
        </Link>
      </Button>
    </li>
  ) : (
    <li>
      <Button
        asChild
        variant="link"
        className="px-[15px] py-0 w-full justify-start"
      >
        <Link
          href={props.item.fields.url.replace(
            '{user}',
            user?.displayName?.toLowerCase()
          )}
          aria-label="Spring by Amaze"
          className="bg-layer-one hover:bg-layer-two hover:no-underline"
        >
          <i className={`mr-2 h-4 w-4 ${props.item.fields.iconName}`}></i>
          {props.item.fields.title}
        </Link>
      </Button>
    </li>
  );
};
