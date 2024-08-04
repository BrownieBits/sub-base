'use client';

import { analytics, db } from '@/lib/firebase';
import { getCookie } from 'cookies-next';
import { logEvent } from 'firebase/analytics';
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  where,
} from 'firebase/firestore';
import React from 'react';

export default function TrackProductViews(props: {
  product_id: string;
  product_name: string;
  store_name: string;
  country: string;
  city: string;
  region: string;
  ip: string;
}) {
  const user_id = getCookie('user_id');

  async function getAndSetAnalytics() {
    const analyticsColRef: CollectionReference = collection(db, 'analytics');
    const q = query(
      analyticsColRef,
      where('ip', '==', props.ip),
      where('product_id', '==', props.product_id)
    );
    const querySnapshot = await getDocs(q);
    console.log('SNAPSHOT EMPTY?', querySnapshot.empty, props.ip);
    if (querySnapshot.empty) {
      const analyticsRef: DocumentReference = doc(db, 'analytics');
      const productRef: DocumentReference = doc(
        db,
        'products',
        props.product_id
      );
      await setDoc(analyticsRef, {
        type: 'product_view',
        product_id: props.product_id,
        user_id: user_id,
        country: props.country,
        city: props.city,
        region: props.region,
        ip: props.ip,
        created_at: Timestamp.fromDate(new Date()),
      });

      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
          return;
        }
        const newSubs = productDoc.data().view_count + 1;
        transaction.update(productRef, { view_count: newSubs });
      });
    }
  }
  React.useEffect(() => {
    if (analytics !== null) {
      logEvent(analytics, 'product_viewed', {
        product_id: props.product_id,
      });
      logEvent(analytics, 'page_view', {
        title: `${props.product_name} - ${props.store_name} - SubBase Creator Platform`,
      });
    }
    getAndSetAnalytics();
  }, []);
  return <></>;
}
