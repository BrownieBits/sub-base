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
      const today = new Date();
      const expires = new Date(today.setMonth(today.getMonth() + 3));
      setCookie('user_role', doc.data().role, {
        secure: true,
        expires: expires,
      });
      setCookie('default_store', doc.data().default_store, {
        secure: true,
        expires: expires,
      });
      setCookie('user_name', doc.data().name, {
        secure: true,
        expires: expires,
      });
      setCookie('user_email', doc.data().email, {
        secure: true,
        expires: expires,
      });
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
