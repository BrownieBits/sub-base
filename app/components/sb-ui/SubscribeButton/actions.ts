'use server';

import { db } from '@/firebase';
import { deleteDoc, doc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function UpdateSubStatus(
  action: "Subscribe" | "Unsubscribe",
  store: string,
  user_id: string,
) {
  'use server';
  const docRef = doc(db, 'stores', store);
  const subRef = doc(db, 'users', user_id, 'subscribes', store);
  if (action === 'Subscribe') {
    await runTransaction(db, async (transaction) => {
      const storeDoc = await transaction.get(docRef);
      if (!storeDoc.exists()) {
        return;
      }
      const newSubs = storeDoc.data().subscription_count + 1;
      transaction.update(docRef, { subscription_count: newSubs });
    });
    await setDoc(subRef, {
      date: serverTimestamp()
    })
  } else {
    await runTransaction(db, async (transaction) => {
      const storeDoc = await transaction.get(docRef);
      if (!storeDoc.exists()) {
        return;
      }
      const newSubs = storeDoc.data().subscription_count - 1;
      transaction.update(docRef, { subscription_count: newSubs });
    });
    await deleteDoc(subRef)
  }
  revalidatePath(`/store/${store}`);
  return 'Success';
}
