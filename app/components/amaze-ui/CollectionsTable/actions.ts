'use server';

import { db } from "@/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function ChangeStatus(action: string, id: string) {
    'use server';
    const docRef = doc(db, 'collections', id);
    await updateDoc(docRef, {
        status: action,
    });
    revalidatePath('/dashboard/products')
    return 'Success'
}