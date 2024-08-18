'use client';

import { auth, db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCookie, setCookie } from 'cookies-next';
import { User } from 'firebase/auth';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  Timestamp,
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { Button } from '../../ui/button';

export const CartIcon = () => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [cartID, setCartID] = React.useState<string>('');
  const [itemCount, setItemCount] = React.useState<number>(0);
  const [user, setUser] = React.useState<User | null>(null);

  async function createNewCart() {
    const cartsReference: CollectionReference = collection(db, 'carts');
    const cartsDoc: DocumentReference = doc(cartsReference);
    const today = new Date();
    const expires = new Date(today.setMonth(today.getMonth() + 1));
    setCookie('cart_id', cartsDoc.id, {
      secure: true,
      expires: expires,
    });
    setCartID(cartsDoc.id);
    setLoaded(true);
  }

  async function checkUserCarts() {
    const userCartsReference: CollectionReference = collection(db, 'carts');
    const q = query(
      userCartsReference,
      where('__name__', '!=', cartID),
      where('owner_id', '==', user?.uid),
      limit(1)
    );
    const userCartsData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(q);
    if (itemCount > 0 || userCartsData.docs.length === 0) {
      const batch = writeBatch(db);
      userCartsData.docs.map((doc) => {
        batch.delete(doc.ref);
      });
      const newUserCartRef: DocumentReference = doc(db, 'carts', cartID);
      const newUserCartDoc: DocumentData = await getDoc(newUserCartRef);
      if (newUserCartDoc.exists()) {
        batch.update(newUserCartRef, {
          owner_id: user?.uid,
          owner_email: user?.email,
          updated_at: Timestamp.fromDate(new Date()),
        });
      } else {
        batch.set(newUserCartRef, {
          owner_id: user?.uid,
          owner_email: user?.email,
          created_at: Timestamp.fromDate(new Date()),
          updated_at: Timestamp.fromDate(new Date()),
        });
      }

      await batch.commit();
      return;
    } else if (userCartsData.docs.length > 0) {
      const oldCartsRef: DocumentReference = doc(db, 'carts', cartID);
      const oldCartDoc: DocumentData = await getDoc(oldCartsRef);
      if (oldCartDoc.exists()) {
        await deleteDoc(oldCartsRef);
      }
      const today = new Date();
      const expires = new Date(today.setMonth(today.getMonth() + 1));
      setCookie('cart_id', userCartsData.docs[0].id, {
        secure: true,
        expires: expires,
      });
      setCartID(userCartsData.docs[0].id);
    }
  }

  React.useEffect(() => {
    const cart_id = getCookie('cart_id');
    auth.onAuthStateChanged(async function handleAuth(user) {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    if (cart_id === undefined) {
      createNewCart();
    } else {
      setCartID(cart_id);
      setLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    const getLatest: Unsubscribe = async () => {
      const cartRef: CollectionReference = collection(
        db,
        `carts/${cartID}/items`
      );
      const q = query(cartRef);
      const unsubscribe = await onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          setItemCount(0);
        } else {
          let count = 0;
          snapshot.docs.map((doc) => {
            count += parseInt(doc.data().quantity);
          });
          setItemCount(count);
        }
      });
      return unsubscribe;
    };
    if (cartID != '') {
      getLatest();
    }
  }, [cartID]);

  React.useEffect(() => {
    if (loaded) {
      if (user) {
        checkUserCarts();
      } else {
        createNewCart();
      }
    }
  }, [user, loaded]);

  return (
    <Button
      asChild
      variant="outline"
      className="bg-layer-one hover:bg-layer-two"
    >
      <Link href="/cart" aria-label="Cart" title="Cart">
        <FontAwesomeIcon
          icon={faCartShopping}
          className={cn('h-4 w-4', {
            'mr-4': itemCount > 0,
          })}
        />
        {itemCount > 0 && <p>{itemCount}</p>}
      </Link>
    </Button>
  );
};
