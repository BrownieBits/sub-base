'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../ui/button';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CartCount } from './cart-count';

export const CartIcon = () => {
  const [user, userLoading, userError] = useAuthState(auth);

  return (
    <>
      {userLoading ? (
        <></>
      ) : (
        <Button
          asChild
          variant="outline"
          className="bg-layer-one hover:bg-layer-two"
        >
          <Link href="/cart" aria-label="Cart" title="Cart">
            <FontAwesomeIcon
              icon={faCartShopping}
              className="mr-[10px] h-4 w-4"
            />
            <CartCount />
          </Link>
        </Button>
      )}
    </>
  );
};
