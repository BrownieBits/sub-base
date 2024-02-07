'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';

export function UserChecker() {
  const [user, loading, error] = useAuthState(auth);
  const { push } = useRouter();
  const pathname = usePathname();
  const pathArray = pathname.split('/');
  if (!user && !loading) {
    push(`/sign-in?redirect=${pathname}`);
  }
  if (
    !loading &&
    user &&
    !user?.displayName &&
    pathname !== '/avatar-upload' &&
    !loading
  ) {
    push(`/avatar-upload?redirect=${pathname}`);
  }
  if (!loading && user && pathArray[2] !== user?.displayName?.toLowerCase()) {
    push(`/dashboard/${user?.displayName?.toLowerCase()!}`);
  }

  return <></>;
}
