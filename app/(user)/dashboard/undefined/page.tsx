import { redirect } from 'next/navigation';

export default function NoUserInfo() {
  redirect(`/avatar-upload`);
  return <>No User Info</>;
}
