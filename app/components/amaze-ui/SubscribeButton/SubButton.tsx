'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { UpdateSubStatus } from './actions';

export const SubButton = ({
  store,
  user_id,
}: {
  store: string;
  user_id: string;
}) => {
  const docRef = doc(db, 'users', user_id, 'subscribes', store);
  const [value, loading, error] = useDocument(docRef);

  if (loading) {
    return <Button variant="ghost">Loading</Button>;
  }

  if (!loading && !value?.exists()) {
    return (
      <Button
        asChild
        onClick={() => UpdateSubStatus('Subscribe', store, user_id)}
      >
        <div>
          <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faCirclePlus} />
          Subscibe
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      asChild
      onClick={() => UpdateSubStatus('Unsubscribe', store, user_id)}
    >
      <div>
        <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faCircleMinus} />
        Unubscibe
      </div>
    </Button>
  );
};
