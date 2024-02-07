'use server';

import { DocumentReference, deleteDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function DeleteFSDoc(docRef: DocumentReference, path: string) {
    'use server';

    await deleteDoc(docRef);
    revalidatePath(path);
    return 'Success';
}