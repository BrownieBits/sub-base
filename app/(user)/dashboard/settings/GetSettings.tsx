'use client';

import {
  DocumentReference,
  Unsubscribe,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebase';
import React from 'react';
import EditSettings from './EditSettings';
import { UserSettings } from './typedef';
import { revalidate } from './actions';

export default function GetSettings(props: { userID: string }) {
  const [userSettings, setUserSettings] = React.useState<UserSettings | null>(
    null
  );

  React.useEffect(() => {
    const userDataRef: DocumentReference = doc(db, 'users', props.userID);
    const unsubscribe: Unsubscribe = onSnapshot(userDataRef, (doc) => {
      if (doc.exists()) {
        setUserSettings({
          name: doc.data().name,
          email: doc.data().email,
          phone: doc.data().phone,
          default_currency: doc.data().default_currency,
          addresses: doc.data().addresses,
          default_address: doc.data().default_address,
        });
      }
    });
    return () => unsubscribe();
  }, [props.userID]);

  React.useEffect(() => {
    revalidate();
  }, [userSettings]);

  if (userSettings === null) {
    return <></>;
  }
  return <EditSettings userID={props.userID} userSettings={userSettings} />;
}
