'use client';

import { db } from '@/firebase';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeartCircleMinus,
  faHeartCirclePlus,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { UpdateSubStatus } from './actions';
import { getCookie } from 'cookies-next';
import { useState } from 'react';

export const SubButton = ({
  store,
  user_id,
}: {
  store: string;
  user_id: string;
}) => {
  const user = getCookie('user_id');
  const docRef = doc(db, 'users', user!, 'subscribes', store);
  const [value, loading, error] = useDocument(docRef);
  const [thinking, setThinking] = useState(false);
  if (loading || thinking) {
    return (
      <Button variant="ghost">
        <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faSpinner} spin />{' '}
        Loading
      </Button>
    );
  }

  if (!loading && !value?.exists()) {
    return (
      <Button
        asChild
        onClick={async () => {
          setThinking(true);
          await UpdateSubStatus('Subscribe', store, user_id);
          setThinking(false);
        }}
      >
        <div>
          <FontAwesomeIcon
            className="icon mr-2 h-4 w-4"
            icon={faHeartCirclePlus}
          />
          Subscibe
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      asChild
      onClick={async () => {
        setThinking(true);
        await UpdateSubStatus('Unsubscribe', store, user_id);
        setThinking(false);
      }}
    >
      <div>
        <FontAwesomeIcon
          className="icon mr-2 h-4 w-4"
          icon={faHeartCircleMinus}
        />
        Unubscibe
      </div>
    </Button>
  );
};
