'use client';
import { LikeButton } from '@/components/sb-ui/LikeButton';
import { ShowAvatar } from '@/components/sb-ui/ShowAvatar';
import { SubsciberButton } from '@/components/sb-ui/SubscribeButton';
import { Button } from '@/components/ui/button';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import ProductImages from './ProductImages';
// import ShowAvatar from '../../ShowAvatar';

type Props = {
  store_id: string;
  avatar: string | null;
  store_name: string;
  subscription_count: number;
  images: string[];
  product_name: string;
  product_type: string;
  price: number;
  compare_at: number;
  currency: string;
  product_id: string;
  product_description: string;
  like_count: number;
};

export default function ProductDetailPage(props: Props) {
  return (
    <section className="flex flex-col gap-8 p-4 max-w-[1754px] mx-auto">
      <section key="productInfo" className="flex flex-col md:flex-row gap-8">
        <section className="flex flex-col md:hidden">
          <section className="flex justify-between">
            <Link
              href={`/store/${props.store_id}`}
              className="flex gap-4 items-center"
            >
              <ShowAvatar
                url={props.avatar!}
                name={props.store_name}
                size="sm"
              />
              <section>
                <p className="font-bold text-sm">{props.store_name}</p>
                <p className="text-muted-foreground text-sm">
                  {props.subscription_count} subscriber
                  {props.subscription_count > 0 ? 's' : ''}
                </p>
              </section>
            </Link>
            <SubsciberButton store={props.store_id} full_width={false} />
          </section>
        </section>
        <ProductImages images={props.images} />
        <section className="w-full md:w-[600px] flex flex-col">
          <section className="hidden md:flex justify-between items-center mb-8">
            <Link
              href={`/store/${props.store_id}`}
              className="flex gap-4 items-center"
            >
              <ShowAvatar
                url={props.avatar!}
                name={props.store_name}
                size="md"
              />
              <section className="flex flex-col gap-1">
                <p className="font-bold text-sm">{props.store_name}</p>
                <p className="text-muted-foreground text-sm">
                  {props.subscription_count} subscriber
                  {props.subscription_count > 0 ? 's' : ''}
                </p>
              </section>
            </Link>
            <SubsciberButton store={props.store_id} full_width={false} />
          </section>
          <section className="flex justify-between">
            <section className="flex flex-col items-start gap-1">
              <h1 className="text-2xl">{props.product_name}</h1>
              <p className="text-md text-muted-foreground">
                {props.product_type}
              </p>
            </section>
            <section className="flex flex-col items-end gap-1">
              {props.compare_at > 0 && props.price !== props.compare_at ? (
                <>
                  <p className="text-destructive line-through">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: props.currency,
                    }).format(props.price)}
                  </p>
                  <p className="text-2xl">
                    <b>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: props.currency,
                      }).format(props.compare_at)}
                    </b>
                  </p>
                </>
              ) : (
                <p className="font-bold text-2xl">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: props.currency,
                  }).format(props.price)}
                </p>
              )}
            </section>
          </section>

          <Button className="mt-8">Add To Cart</Button>
          <div className="flex gap-4 justify-start pt-4">
            <LikeButton
              product={props.product_id}
              like_count={props.like_count}
            />
            <Button variant="outline" asChild>
              <div>
                <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faShare} />
                Share
              </div>
            </Button>
          </div>
        </section>
      </section>
    </section>
  );
}
