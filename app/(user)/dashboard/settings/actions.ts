'use server';

import { revalidatePath } from 'next/cache';

export async function revalidate() {
    'use server';
    console.log('REVALIDATING')
    revalidatePath(`/dashboard/settings`);
}