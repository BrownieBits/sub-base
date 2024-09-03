'use client';

import { Separator } from '@/components/ui/separator';
import { Item, Promotion, RemovedProduct } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import AddressForm from './AddressForm';
import ItemDetails from './ItemDetails';
import RemovedItemsDialogue from './RemovedItemsDialogue';

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
};

export default function CheckoutPage(props: Props) {
  const [itemsTotal, setItemsTotal] = React.useState<number>(0);
  const [serviceTotal, setServiceTotal] = React.useState<number>(0);
  const [cartTotal, setCartTotal] = React.useState<number>(0);
  const [discountsTotal, setDiscountsTotal] = React.useState<number>(0);
  const [shippingTotal, setShippingTotal] = React.useState<number>(0);
  const [taxesTotal, setTaxesTotal] = React.useState<number>(0);
  const [removedItems, setRemovedItems] = React.useState<RemovedProduct[]>([]);

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
    <section className="w-full max-w-[1754px] mx-auto px-4 py-4">
      <section className="w-full flex flex-col-reverse md:flex-row gap-8">
        <aside className="w-full flex1 flex flex-col gap-4">
          <AddressForm userID="" />
        </aside>
        <aside className="flex flex-col gap-4 w-full md:w-[350px] xl:w-[400px]">
          {Object.keys(props.items).map((store) => {
            return (
              <ItemDetails
                items={props.items[store]}
                store_id={store}
                key={`item-breakdown-${store}`}
              />
            );
          })}
          <section className="w-full flex flex-col gap-2">
            <section className="w-full flex justify-between">
              <p>Item(s) Total:</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(itemsTotal)}
              </p>
            </section>
            <section className="w-full flex justify-between">
              <p>Service Fees:</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(serviceTotal)}
              </p>
            </section>
            <section className="w-full flex justify-between">
              <p>Discounts:</p>
              <p>
                {discountsTotal > 0 && <>-</>}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(discountsTotal)}
              </p>
            </section>
            <section className="w-full flex justify-between">
              <p>Shipping:</p>
              <p>
                {discountsTotal > 0 && <>-</>}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(shippingTotal)}
              </p>
            </section>
            <section className="w-full flex justify-between">
              <p>Taxes:</p>
              <p>
                {discountsTotal > 0 && <>-</>}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(taxesTotal)}
              </p>
            </section>
            <Separator />
            <section className="w-full flex justify-between pt-4">
              <p>
                <b>Total:</b>
              </p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(cartTotal)}
              </p>
            </section>
          </section>
        </aside>
      </section>
      <RemovedItemsDialogue removedItems={removedItems} />
    </section>
  );
}
