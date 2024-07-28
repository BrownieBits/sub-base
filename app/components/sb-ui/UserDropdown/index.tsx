'use client';

import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import {
  faBrush,
  faCog,
  faColumns,
  faComment,
  faGlobe,
  faLanguage,
  faQuestion,
  faRepeat,
  faShirt,
  faSignOut,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCookie } from 'cookies-next';
import { doc } from 'firebase/firestore';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignOut } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

export const UserDropdown = () => {
  const user_name = getCookie('user_name');
  const default_store = getCookie('default_store') || 'f';
  const docRef = doc(db, 'stores', default_store!);
  const [value, loadingDoc, docError] = useDocument(docRef);
  const [signOut, loading, error] = useSignOut(auth);
  const { push } = useRouter();
  const { setTheme } = useTheme();
  async function onSubmit() {
    push('/sign-in');
    await signOut();
  }

  if (loading || default_store === undefined) {
    return <></>;
  }

  if (loadingDoc) {
    return <></>;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 bg-layer-one hover:bg-layer-one">
          <Avatar className="bg-secondary text-foreground h-[29px] w-[29px]">
            <AvatarImage
              src={value?.data()?.avatar_url}
              alt={value?.data()?.name}
            />
            <AvatarFallback>
              <b>{value?.data()?.name.slice(0, 1).toUpperCase()}</b>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuGroup className="p-4 space-y-[5px]">
          <DropdownMenuItem asChild className="p-[0] focus:bg-background">
            <p>
              <b>{user_name}</b>
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link
              href={`/store/${default_store}`}
              className="w-full "
              aria-label="Store"
            >
              @{default_store}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-4 space-y-[5px]">
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link href={`/switch-stores`} className="w-full" aria-label="Store">
              <FontAwesomeIcon className="icon mr-4" icon={faRepeat} />
              Swtich Stores
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <form action={onSubmit}>
              <button type="submit" className="w-full text-left">
                <FontAwesomeIcon className="icon mr-4" icon={faSignOut} />
                Sign Out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-4 space-y-[5px]">
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link href={`/dashboard`} className="w-full" aria-label="Store">
              <FontAwesomeIcon className="icon mr-4" icon={faColumns} />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link
              href={`/dashboard/products`}
              className="w-full"
              aria-label="Store"
            >
              <FontAwesomeIcon className="icon mr-4" icon={faShirt} />
              My Products
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link
              href={`/dashboard/preferences`}
              className="w-full"
              aria-label="Store"
            >
              <FontAwesomeIcon className="icon mr-4" icon={faStore} />
              Preferences
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-4 space-y-[5px]">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="p-[0] focus:bg-layer-one">
              <FontAwesomeIcon className="icon mr-4" icon={faBrush} />
              Appearance
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-4 space-y-[5px]">
                <DropdownMenuItem
                  className="p-[0] focus:bg-layer-one"
                  onClick={() => setTheme('light')}
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-[0] focus:bg-layer-one"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-[0] focus:bg-layer-one"
                  onClick={() => setTheme('system')}
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="p-[0] focus:bg-layer-one">
              <FontAwesomeIcon className="icon mr-4" icon={faLanguage} />
              Language
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-4 space-y-[5px]">
                <DropdownMenuItem
                  className="p-[0] focus:bg-layer-one"
                  onClick={() => setTheme('light')}
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-[0] focus:bg-layer-one"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-[0] focus:bg-layer-one"
                  onClick={() => setTheme('system')}
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="p-[0] focus:bg-layer-one">
              <FontAwesomeIcon className="icon mr-4" icon={faGlobe} />
              Location
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-4 space-y-[5px]">
                <DropdownMenuItem
                  className="p-[0] focus:bg-layer-one"
                  onClick={() => setTheme('light')}
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-[0] focus:bg-layer-one"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-[0] focus:bg-layer-one"
                  onClick={() => setTheme('system')}
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-4 space-y-[5px]">
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link
              href={`/dashboard/settings`}
              className="w-full"
              aria-label="Store"
            >
              <FontAwesomeIcon className="icon mr-4" icon={faCog} />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-4 space-y-[5px]">
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link href={`/help`} className="w-full" aria-label="Store">
              <FontAwesomeIcon className="icon mr-4" icon={faQuestion} />
              Help
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link href={`/send-feedback`} className="w-full" aria-label="Store">
              <FontAwesomeIcon className="icon mr-4" icon={faComment} />
              Send Feedback
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
