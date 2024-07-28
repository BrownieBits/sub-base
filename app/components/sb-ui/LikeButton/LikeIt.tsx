'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  deleteDoc,
  doc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { revalidate } from './actions';

export const LikeIt = ({
  product,
  like_count,
  user_id,
}: {
  product: string;
  like_count: number;
  user_id: string;
}) => {
  const docRef = doc(db, 'users', user_id, 'likes', product);
  const [value, loading, error] = useDocument(docRef);

  async function UpdateSubStatus(
    action: 'Like' | 'Unlike',
    product: string,
    user_id: string
  ) {
    const docRef = doc(db, 'products', product);
    const likeRef = doc(db, 'users', user_id, 'likes', product);
    if (action === 'Like') {
      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(docRef);
        if (!productDoc.exists()) {
          return;
        }
        const newSubs = productDoc.data().like_count + 1;
        transaction.update(docRef, { like_count: newSubs });
      });
      await setDoc(likeRef, {
        date: serverTimestamp(),
        liked: true,
      });
    } else {
      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(docRef);
        if (!productDoc.exists()) {
          return;
        }
        const newSubs = productDoc.data().like_count - 1;
        transaction.update(docRef, { like_count: newSubs });
      });
      await deleteDoc(likeRef);
    }
    revalidate(product);
    return 'Success';
  }

  if (loading) {
    return <Button variant="ghost">Loading</Button>;
  }

  if (!loading && !value?.exists()) {
    return (
      <Button
        variant="outline"
        onClick={() => UpdateSubStatus('Like', product, user_id)}
      >
        <section>
          <FontAwesomeIcon
            className="icon pr-2 mr-2 h-4 w-4 border-r"
            icon={faThumbsUpRegular}
          />
          {like_count} Like{like_count > 1 ? 's' : ''}
        </section>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => UpdateSubStatus('Unlike', product, user_id)}
    >
      <section>
        <FontAwesomeIcon
          className="icon pr-2 mr-2 h-4 w-4 border-r"
          icon={faThumbsUp}
        />
        {like_count} Like{like_count > 1 ? 's' : ''}
      </section>
    </Button>
  );
};
