'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';

export default function Loading() {
  return (
    <section className="overflow-y-auto overflow-x-hidden">Loading</section>
  );
}
