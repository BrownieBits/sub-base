'use client';

import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleMinus,
  faCirclePlus,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { UpdateSubStatus } from './actions';

export const LikeIt = ({
  product,
  store,
  user_id,
}: {
  product: string;
  store: string;
  user_id: string;
}) => {
  const docRef = doc(db, 'users', user_id, 'likes', product);
  const [value, loading, error] = useDocument(docRef);

  if (loading) {
    return <Button variant="ghost">Loading</Button>;
  }

  if (!loading && !value?.exists()) {
    return (
      <Button
        asChild
        variant="secondary"
        onClick={() => UpdateSubStatus('Like', product, store, user_id)}
      >
        <div>
          <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faThumbsUp} />
          Like
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      asChild
      onClick={() => UpdateSubStatus('Unlike', product, store, user_id)}
    >
      <div>
        <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faThumbsDown} />
        UnLike
      </div>
    </Button>
  );
};
