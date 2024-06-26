'use client';

import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { SubButton } from './SubButton';

export const SubsciberButton = ({ store }: { store: string }) => {
  const [user, userLoading, userError] = useAuthState(auth);

  if (userLoading) {
    return <Button variant="ghost">Loading</Button>;
  }

  if (!userLoading && !user) {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button asChild>
            <div>
              <FontAwesomeIcon
                className="icon mr-2 h-4 w-4"
                icon={faHeartCirclePlus}
              />
              Subscribe
            </div>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Want to subscribe to this creator?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Sign in to subscribe to this channel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`/sign-in?redirect=/store/${store}`}>Sign In</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return <SubButton store={store} user_id={user?.uid!} />;
};
