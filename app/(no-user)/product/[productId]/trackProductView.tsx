'use client';

import { analytics, db } from '@/lib/firebase';
import { getCookie } from 'cookies-next';
import { logEvent } from 'firebase/analytics';
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import React from 'react';

export default function TrackProductViews(props: {
  product_id: string;
  product_name: string;
  store_name: string;
  store_id: string;
  country: string;
  city: string;
  region: string;
  ip: string;
}) {
  const user_id = getCookie('user_id');
  const default_store = getCookie('default_store');
  async function getAndSetAnalytics() {
    const analyticsColRef: CollectionReference = collection(
      db,
      `stores/${default_store}/analytics`
    );
    const now = new Date();
    const threeHoursAgo = new Date(now.getHours() - 3);
    const q = query(
      analyticsColRef,
      where('ip', '==', props.ip),
      where('product_id', '==', props.product_id),
      where('created_at', '<', Timestamp.fromDate(threeHoursAgo))
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const productRef: DocumentReference = doc(
        db,
        'products',
        props.product_id
      );
      await addDoc(analyticsColRef, {
        type: 'product_view',
        product_id: props.product_id,
        store_id: props.store_id,
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
        await transaction.update(productRef, { view_count: newSubs });
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
