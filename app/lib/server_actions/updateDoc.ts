'use server'

import { DocumentReference, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function GetFSDocs(docRef: DocumentReference, data: { [parentKey: string]: any }, path: string) {
    'use server';

    await updateDoc(docRef, data);

    revalidatePath(path);
    return 'Success';
}