'use client';

import { Logo } from '@/components/sb-ui/Logo';
import { Separator } from '@/components/ui/separator';
import { Item, Promotion, RemovedProduct } from '@/lib/types';
import { faCircle as faCircleRegular } from '@fortawesome/free-regular-svg-icons';
import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import AddressForm from './AddressForm';
import RemovedItemsDialogue from './RemovedItemsDialogue';
import CheckoutSummary from './Summary';

type Items = {
  [key: string]: Item[];
};
type Promotions = {
  [key: string]: Promotion;
};
type Props = {
  items: Items;
  promotions: Promotions;
  removed_items: RemovedProduct[];
  user_id?: string;
};

export default function CheckoutPage(props: Props) {
  const [itemsTotal, setItemsTotal] = React.useState<number>(0);
  const [serviceTotal, setServiceTotal] = React.useState<number>(0);
  const [cartTotal, setCartTotal] = React.useState<number>(0);
  const [discountsTotal, setDiscountsTotal] = React.useState<number>(0);
  const [shippingTotal, setShippingTotal] = React.useState<number>(0);
  const [taxesTotal, setTaxesTotal] = React.useState<number>(0);
  const [removedItems, setRemovedItems] = React.useState<RemovedProduct[]>([]);
  const [step, setStep] = React.useState<string>('address');

  React.useEffect(() => {}, []);
  React.useEffect(() => {
    let item_total = 0;
    let service_total = 0;
    let discounts_total = 0;

    Object.keys(props.items).map((store) => {
      let store_total = 0;
      props.items[store].map((item) => {
        if (item.compare_at > 0 && item.compare_at < item.price) {
          store_total += parseFloat(item.compare_at.toString()) * item.quantity;
          item_total += parseFloat(item.compare_at.toString()) * item.quantity;
          service_total +=
            parseFloat(item.compare_at.toString()) *
            item.quantity *
            parseFloat(item.service_percent.toString());
        } else {
          store_total += parseFloat(item.price.toString()) * item.quantity;
          item_total += parseFloat(item.price.toString()) * item.quantity;
          service_total +=
            parseFloat(item.price.toString()) *
            item.quantity *
            parseFloat(item.service_percent.toString());
        }
      });
      if (props.promotions.hasOwnProperty(store)) {
        const expiration = props.promotions[store].expiration_date as Timestamp;
        let expiration_good = true;
        if (expiration !== null) {
          const expiration_date = new Date(expiration.seconds * 1000);
          const today = new Date();
          if (today.getTime() > expiration_date.getTime()) {
            expiration_good = false;
          }
        }
        let minimum_good = true;
        if (
          props.promotions[store].minimum_order_value > 0 &&
          props.promotions[store].minimum_order_value > store_total
        ) {
          minimum_good = false;
        }
        if (minimum_good && expiration_good) {
          if (props.promotions[store].type === 'Flat Amount') {
            discounts_total += props.promotions[store].amount;
          } else if (props.promotions[store].type === 'Percentage') {
            const discount_amount =
              store_total * (props.promotions[store].amount / 100);
            discounts_total += discount_amount;
          }
        }
      }
    });

    setDiscountsTotal(discounts_total);
    setItemsTotal(item_total);
    setServiceTotal(service_total);
    setCartTotal(item_total + service_total - discounts_total);
  }, [props.items, props.promotions]);
  React.useEffect(() => {
    setRemovedItems(props.removed_items);
  }, [props.removed_items]);

  return (
    <>
      <section className="w-full max-w-[1200px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <section className="flex justify-start items-center gap-2">
            <section className="w-[20px] md:w-[120px]">
              <Logo url="/" />
            </section>
            <p className="text-xs md:text-md ">Secure Checkout</p>
          </section>
          <section className="w-[200px] md:w-[350px] xl:w-[400px] flex items-center gap-2">
            <aside className="flex flex-col jusitify-center items-center gap-2">
              <>
                {step !== 'address' ? (
                  <p className="text-md md:text-xl text-success">
                    <FontAwesomeIcon className="icon" icon={faCircleCheck} />
                  </p>
                ) : (
                  <p className="text-md md:text-xl">
                    <FontAwesomeIcon className="icon" icon={faCircle} />
                  </p>
                )}
              </>
              <>
                {step !== 'address' ? (
                  <p className="text-xs text-success">Address</p>
                ) : (
                  <p className="text-xs">Address</p>
                )}
              </>
            </aside>
            <aside className="w-auto flex-1">
              <Separator />
            </aside>
            <aside className="flex flex-col jusitify-center items-center gap-2">
              <>
                {step === 'address' && (
                  <p className="text-md md:text-xl text-muted-foreground">
                    <FontAwesomeIcon className="icon" icon={faCircleRegular} />
                  </p>
                )}
                {step === 'shipping' && (
                  <p className="text-md md:text-xl text-foreground">
                    <FontAwesomeIcon className="icon" icon={faCircle} />
                  </p>
                )}
                {step === 'payment' && (
                  <p className="text-md md:text-xl text-success">
                    <FontAwesomeIcon className="icon" icon={faCircleCheck} />
                  </p>
                )}
              </>
              <>
                {step === 'address' && (
                  <p className="text-xs text-muted-foreground">Shipping</p>
                )}
                {step === 'shipping' && (
                  <p className="text-xs text-foreground">Shipping</p>
                )}
                {step === 'payment' && (
                  <p className="text-xs text-success">Shipping</p>
                )}
              </>
            </aside>
            <aside className="w-auto flex-1">
              <Separator />
            </aside>
            <aside className="flex flex-col jusitify-center items-center gap-2">
              <>
                {(step === 'address' || step === 'shipping') && (
                  <p className="text-md md:text-xl text-muted-foreground">
                    <FontAwesomeIcon className="icon" icon={faCircleRegular} />
                  </p>
                )}
                {step === 'payment' && (
                  <p className="text-md md:text-xl text-foreground">
                    <FontAwesomeIcon className="icon" icon={faCircle} />
                  </p>
                )}
              </>
              <>
                {(step === 'address' || step === 'shipping') && (
                  <p className="text-xs text-muted-foreground">Payment</p>
                )}
                {step === 'payment' && (
                  <p className="text-xs text-foreground">Payment</p>
                )}
              </>
            </aside>
          </section>
        </section>
      </section>
      <Separator />
      <section className="w-full max-w-[1200px] mx-auto">
        <section className="w-full flex flex-col-reverse md:flex-row px-4 py-4 gap-4">
          <aside className="w-full flex-1 flex flex-col gap-4">
            <AddressForm userID={props.user_id} />
          </aside>
          <CheckoutSummary
            items={props.items}
            items_total={itemsTotal}
            discount_total={discountsTotal}
            shipping_total={shippingTotal}
            service_total={serviceTotal}
            taxes_total={taxesTotal}
            cart_total={cartTotal}
          />
        </section>
      </section>
      <RemovedItemsDialogue removedItems={removedItems} />
    </>
  );
}
