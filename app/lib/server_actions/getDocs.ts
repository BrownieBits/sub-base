'use server'

import { DocumentData, Query, getDocs } from "firebase/firestore";

export async function GetFSDocs(query: Query<DocumentData, DocumentData>) {
    'use server';

    const querySnapshot = await getDocs(query);
    return querySnapshot;
}