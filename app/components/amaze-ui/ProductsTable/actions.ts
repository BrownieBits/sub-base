'use server';

import { db } from "@/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function ChangeStatus(action: string, id: string) {
    'use server';
    const docRef = doc(db, 'products', id);
    if (action === 'Delete') {
        await deleteDoc(docRef);
        return 'Success';
    }
    else {
        await updateDoc(docRef, {
            status: action,
        });
    }
    revalidatePath(`/dashboard/products`)
    return 'Success'
}