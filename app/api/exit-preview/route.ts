import { revalidatePath } from 'next/cache';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  draftMode().disable();

  const { searchParams } = new URL(request.url);
  const newUrl: string = searchParams.get('redirect') || '/';

  revalidatePath(newUrl);
  redirect(newUrl);
}
