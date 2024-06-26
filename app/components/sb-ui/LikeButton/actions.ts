'use server';

import { db } from '@/lib/firebase'
import { deleteDoc, doc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function UpdateSubStatus(
  action: "Like" | "Unlike",
  product: string,
  store: string,
  user_id: string,
) {
  'use server';
  const docRef = doc(db, 'products', product);
  const likeRef = doc(db, 'users', user_id, 'likes', product);
  if (action === 'Like') {
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(docRef);
      if (!productDoc.exists()) {
        return;
      }
      const newSubs = productDoc.data().likes + 1;
      transaction.update(docRef, { likes: newSubs });
    });
    await setDoc(likeRef, {
      date: serverTimestamp(),
      liked: true,
    })
  } else {
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(docRef);
      if (!productDoc.exists()) {
        return;
      }
      const newSubs = productDoc.data().likes - 1;
      transaction.update(docRef, { likes: newSubs });
    });
    await deleteDoc(likeRef)
  }
  revalidatePath(`/creator/${store}/product/${product}`);
  return 'Success';
}
