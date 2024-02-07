'use server';

import { revalidatePath } from 'next/cache';

export async function revalidate(displayName: string) {
  'use server';
  revalidatePath(`/dashboard/${displayName}/promotions`);
}
