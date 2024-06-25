'use client';

import { hasCookie } from 'cookies-next';

export const CartCount = () => {
  if (!hasCookie('localConsent')) {
    return <></>;
  }
  return <>0</>;
};
