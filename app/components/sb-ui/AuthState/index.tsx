'use client';

import { analytics, auth, db } from '@/lib/firebase';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { setUserId } from 'firebase/analytics';
import { User } from 'firebase/auth';
import {
  DocumentData,
  DocumentReference,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import React from 'react';

async function SetCookies(user: User) {
  const userDataRef: DocumentReference = doc(db, 'users', user.uid);
  setCookie('user_id', user.uid);
  const data: DocumentData = await onSnapshot(userDataRef, (doc) => {
    if (doc.exists()) {
      setCookie('user_role', doc.data().role);
      setCookie('default_store', doc.data().default_store);
      setCookie('user_name', doc.data().name);
      setCookie('user_email', doc.data().email);
    }
  });
}

export default function AuthState() {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    auth.onAuthStateChanged(function handleAuth(user) {
      if (user) {
        if (getCookie('localConsent')) {
          SetCookies(user);
        }
        if (analytics) {
          setUserId(analytics, user.uid);
        }
        setUser(user);
      } else {
        if (analytics) {
          setUserId(analytics, '');
        }
        deleteCookie('user_id');
        deleteCookie('default_store');
        deleteCookie('user_role');
        deleteCookie('user_name');
        setUser(null);
      }
    });
  }, [user]);

  return <></>;
}
