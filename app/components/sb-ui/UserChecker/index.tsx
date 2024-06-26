'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

export function UserChecker() {
  const [user, loading, error] = useAuthState(auth);
  const { push } = useRouter();
  const pathname = usePathname();
  if (!user && !loading) {
    push(`/sign-in?redirect=${pathname}`);
  }

  return <></>;
}
