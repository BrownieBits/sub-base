'use client';

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
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LikeIt } from './LikeIt';

export const LikeButton = ({
  product,
  like_count,
}: {
  product: string;
  like_count: number;
}) => {
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
                icon={faThumbsUp}
              />
              Like
            </div>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Want to like this product?</AlertDialogTitle>
            <AlertDialogDescription>
              Sign in to subscribe to this channel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={`sign-in?redirect=/product/${product}`}>Sign In</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <LikeIt product={product} like_count={like_count} user_id={user?.uid!} />
  );
};
