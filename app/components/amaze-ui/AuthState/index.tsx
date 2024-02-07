'use client';

import { auth, db } from '@/firebase';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import React from 'react';

async function SetCookies(user: User) {
  const userDataRef: DocumentReference = doc(db, 'users', user.uid);
  const data: DocumentData = await getDoc(userDataRef);
  setCookie('user_id', user.uid);
  setCookie('user_slug', user.displayName?.toLowerCase());
  if (data.exists()) {
    setCookie('user_role', data.data().role);
  }
}

export default function AuthState() {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    auth.onAuthStateChanged(function handleAuth(user) {
      if (user) {
        if (getCookie('localConsent')) {
          SetCookies(user);
        }
        setUser(user);
      } else {
        deleteCookie('user_id');
        deleteCookie('user_slug');
        deleteCookie('user_role');
        setUser(null);
      }
    });
  }, [user]);

  return <></>;
}
