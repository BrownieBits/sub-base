'use client';
import { ShowAvatar } from '@/components/sb-ui/ShowAvatar';
import { GridProduct } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({
  product,
  avatar,
  show_creator,
}: {
  product: GridProduct;
  avatar?: string;
  show_creator: boolean;
}) {
  const today = Timestamp.fromDate(new Date());
  function timeDifference() {
    const difference = today.seconds - product.created_at.seconds;
    const yearDifference = Math.floor(difference / 60 / 60 / 24 / 365);
    const monthDifference = Math.floor(difference / 60 / 60 / 24 / 30);
    const daysDifference = Math.floor(difference / 60 / 60 / 24);
    const hoursDifference = Math.floor(difference / 60 / 60);
    const minutesDifference = Math.floor(difference / 60);
    if (yearDifference > 0) {
      return `${yearDifference} Year${yearDifference > 1 ? 's' : ''}`;
    }
    if (monthDifference > 0) {
      return `${monthDifference} Month${monthDifference > 1 ? 's' : ''}`;
    }
    if (daysDifference > 0) {
      return `${daysDifference} Day${daysDifference > 1 ? 's' : ''}`;
    }
    if (hoursDifference > 0) {
      return `${hoursDifference} Hour${hoursDifference > 1 ? 's' : ''}`;
    }
    return `${minutesDifference} Month${minutesDifference > 1 ? 's' : ''}`;
  }
  return (
    <section className="flex flex-col w-full">
      <Link
        href={`/product/${product.id}`}
        className="aspect-square flex justify-center items-center bg-layer-one border rounded overflow-hidden group"
      >
        {product.images.length > 1 ? (
          <>
            <Image
              src={product.images[0]}
              width="300"
              height="300"
              alt={product.name}
              className="flex group-hover:hidden w-full"
            />
            <Image
              src={product.images[1]}
              width="300"
              height="300"
              alt={product.name}
              className="hidden group-hover:flex w-full"
            />
          </>
        ) : (
          <Image
            src={product.images[0]}
            width="300"
            height="300"
            alt={product.name}
            className="flex w-full"
          />
        )}
      </Link>
      <section className="w-full flex pt-4 gap-4">
        {show_creator ? (
          <Link
            href={`/store/${product.store_id}`}
            className="text-sm text-muted-foreground"
          >
            <ShowAvatar url={avatar!} name={product.store_id} size="sm" />
          </Link>
        ) : (
          <></>
        )}
        <aside className="flex-1 flex justify-between">
          <section className="flex flex-col gap-1">
            <Link
              href={`/product/${product.id}`}
              className="flex flex-col gap-1"
            >
              <p>
                <b>{product.name}</b>
              </p>
              <p className="text-sm text-muted-foreground">
                {product.product_type}
              </p>
            </Link>
            {show_creator ? (
              <Link
                href={`/store/${product.store_id}`}
                className="text-sm text-muted-foreground"
              >
                {product.store_id}
              </Link>
            ) : (
              <></>
            )}
            <p className="text-sm text-muted-foreground">
              {product.like_count} Likes{' '}
              <span className="text-sm text-muted-foreground">&bull;</span>{' '}
              {timeDifference()}
            </p>
          </section>
          <section>
            <Link
              href={`/product/${product.id}`}
              className="w-full flex flex-col items-end gap-1"
            >
              {product.compare_at > 0 && product.price != product.compare_at ? (
                <>
                  <p className="text-destructive line-through">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency,
                    }).format(product.price)}
                  </p>
                  <p>
                    <b>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: product.currency,
                      }).format(product.compare_at)}
                    </b>
                  </p>
                </>
              ) : (
                <p>
                  <b>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency,
                    }).format(product.price)}
                  </b>
                </p>
              )}
            </Link>
          </section>
        </aside>
      </section>
    </section>
  );
}
