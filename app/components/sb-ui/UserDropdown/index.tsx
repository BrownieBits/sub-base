'use client';

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
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import { getCookie } from 'cookies-next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

export const UserDropdown = () => {
  const user_name = getCookie('user_name');
  const default_store = getCookie('default_store');
  const [user, userLoading, userError] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);
  const { push } = useRouter();
  const { setTheme } = useTheme();
  async function onSubmit() {
    await signOut();
    push('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 bg-layer-one hover:bg-layer-one">
          <Avatar className="bg-secondary text-foreground h-[29px] w-[29px]">
            <AvatarImage src={user?.photoURL!} alt={user?.displayName!} />
            <AvatarFallback>
              <b>{user_name?.slice(0, 1).toUpperCase()}</b>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuGroup className="p-[15px] space-y-[5px]">
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
        <DropdownMenuGroup className="p-[15px] space-y-[5px]">
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link href={`/switch-stores`} className="w-full" aria-label="Store">
              <FontAwesomeIcon className="icon mr-[15px]" icon={faRepeat} />
              Swtich Stores
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <form action={onSubmit}>
              <button type="submit" className="w-full text-left">
                <FontAwesomeIcon className="icon mr-[15px]" icon={faSignOut} />
                Sign Out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-[15px] space-y-[5px]">
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link href={`/dashboard`} className="w-full" aria-label="Store">
              <FontAwesomeIcon className="icon mr-[15px]" icon={faColumns} />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link
              href={`/dashboard/products`}
              className="w-full"
              aria-label="Store"
            >
              <FontAwesomeIcon className="icon mr-[15px]" icon={faShirt} />
              My Products
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link
              href={`/dashboard/preferences`}
              className="w-full"
              aria-label="Store"
            >
              <FontAwesomeIcon className="icon mr-[15px]" icon={faStore} />
              Preferences
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-[15px] space-y-[5px]">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="p-[0] focus:bg-layer-one">
              <FontAwesomeIcon className="icon mr-[15px]" icon={faBrush} />
              Appearance
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-[15px] space-y-[5px]">
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
              <FontAwesomeIcon className="icon mr-[15px]" icon={faLanguage} />
              Language
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-[15px] space-y-[5px]">
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
              <FontAwesomeIcon className="icon mr-[15px]" icon={faGlobe} />
              Location
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-[15px] space-y-[5px]">
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
        <DropdownMenuGroup className="p-[15px] space-y-[5px]">
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link
              href={`/dashboard/settings`}
              className="w-full"
              aria-label="Store"
            >
              <FontAwesomeIcon className="icon mr-[15px]" icon={faCog} />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-[15px] space-y-[5px]">
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link href={`/help`} className="w-full" aria-label="Store">
              <FontAwesomeIcon className="icon mr-[15px]" icon={faQuestion} />
              Help
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-[0] focus:bg-layer-one">
            <Link href={`/send-feedback`} className="w-full" aria-label="Store">
              <FontAwesomeIcon className="icon mr-[15px]" icon={faComment} />
              Send Feedback
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
