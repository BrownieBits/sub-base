import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import GetSettings from './GetSettings';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Settings`,
  };
}

export default async function Settings() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');

  return <GetSettings userID={user_id?.value!} />;
}
