'use server';

import { db } from "@/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function ChangeStatus(action: string | boolean, id: string, displayName: string, item: 'status' | 'show') {
    'use server';
    const docRef = doc(db, 'promotions', id);
    if (action === 'Delete') {
        await deleteDoc(docRef);
        return 'Success';
    }
    if (item === 'status') {
        await updateDoc(docRef, {
            status: action,
        });
    } else {
        await updateDoc(docRef, {
            show_in_banner: action,
        });
    }

    revalidatePath(`/dashboard/${displayName}/promotions`);
    return 'Success';
}