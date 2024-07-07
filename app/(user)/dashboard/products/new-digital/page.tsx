import { Metadata } from 'next';
import { cookies } from 'next/headers';
import EditForm from './EditForm';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'New Digital Product',
  };
}

export default async function NewDigitalProduct() {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const user_id = cookieStore.get('user_id');
  return <EditForm storeID={default_store?.value!} userID={user_id?.value!} />;
}
