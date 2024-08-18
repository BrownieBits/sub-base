'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { db } from '@/lib/firebase';
import { setCookie } from 'cookies-next';
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
  const today = new Date();
  const expires = new Date(today.setMonth(today.getMonth() + 3));
  setCookie('user_id', user.uid, {
    secure: true,
    expires: expires,
  });
  const data: DocumentData = await onSnapshot(userDataRef, (doc) => {
    if (doc.exists()) {
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

export default function CartPopout() {
  const [open, setOpen] = React.useState<boolean>(false);

  React.useEffect(() => {}, []);

  return (
    <>
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
