'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { analytics, db } from '@/lib/firebase';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logEvent } from 'firebase/analytics';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import StoreItems from './StoreItems';
import { Item } from './types';

type Items = {
  [key: string]: Item[];
};
type Props = {
  cart_id: string;
  country: string;
  city: string;
  region: string;
  ip: string;
};

export default function CartDetailPage(props: Props) {
  const [items, setItems] = React.useState<Items | null>(null);
  const [itemsTotal, setItemsTotal] = React.useState<number>(0);
  const [serviceTotal, setServiceTotal] = React.useState<number>(0);
  const [cartTotal, setCartTotal] = React.useState<number>(0);

  React.useEffect(() => {
    if (analytics !== null) {
      logEvent(analytics, 'page_view', {
        title: 'Cart - SubBase Creator Platform',
      });
    }
    const getItems = async () => {
      let item_total = 0;
      let service_total = 0;

      const itemsRef: CollectionReference = collection(
        db,
        'carts',
        props.cart_id,
        'items'
      );
      const itemsQuery = query(itemsRef);
      const itemsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(itemsQuery);

      const productIDs: string[] = [];
      const cartItems: Items = {};
      itemsData.docs.map((doc) => {
        productIDs.push(doc.id.split('_')[0]);
        if (!cartItems.hasOwnProperty(doc.data().store_id)) {
          cartItems[doc.data().store_id] = [
            {
              id: doc.id.split('_')[0],
              options: doc.data().options || [],
              quantity: doc.data().quantity,
              store_id: doc.data().store_id,
              compare_at: 0.0,
              price: 0.0,
              currency: 'USD',
              images: [],
              inventory: 0,
              track_inventory: false,
              product_type: '',
              name: '',
            },
          ];
        } else {
          cartItems[doc.data().store_id].push({
            id: doc.id.split('_')[0],
            options: doc.data().options || [],
            quantity: doc.data().quantity,
            store_id: doc.data().store_id,
            compare_at: 0.0,
            price: 0.0,
            currency: 'USD',
            images: [],
            inventory: 0,
            track_inventory: false,
            product_type: '',
            name: '',
          });
        }
      });
      const productsRef: CollectionReference = collection(db, 'products');
      const productsQuery = query(
        productsRef,
        where('__name__', 'in', productIDs)
      );
      const productsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(productsQuery);

      await Promise.all(
        productsData.docs.map(async (document) => {
          await Promise.all(
            cartItems[document.data().store_id].map(async (item) => {
              if (item.id === document.id) {
                item.compare_at = document.data().compare_at as number;
                item.price = document.data().price as number;
                item.currency = document.data().currency;
                item.images = document.data().images;
                item.inventory = document.data().inventory;
                item.track_inventory = document.data().track_inventory;
                item.product_type = document.data().product_type;
                item.name = document.data().name;
                if (item.options.length > 0) {
                  const variantRef: DocumentReference = doc(
                    db,
                    'products',
                    document.id,
                    'variants',
                    item.options.join('-')
                  );
                  const variantDoc: DocumentData = await getDoc(variantRef);
                  if (variantDoc.exists()) {
                    item.compare_at = variantDoc.data().compare_at as number;
                    item.price = variantDoc.data().price as number;
                    item.inventory = variantDoc.data().inventory;
                  }
                }
                if (item.compare_at > 0 && item.compare_at < item.price) {
                  item_total +=
                    parseFloat(item.compare_at.toString()) * item.quantity;
                  service_total +=
                    parseFloat(item.compare_at.toString()) *
                    item.quantity *
                    parseFloat(document.data().service_percent.toString());
                } else {
                  item_total +=
                    parseFloat(item.price.toString()) * item.quantity;
                  service_total +=
                    parseFloat(item.price.toString()) *
                    item.quantity *
                    parseFloat(document.data().service_percent.toString());
                }
              }
            })
          );
        })
      );
      setItemsTotal(item_total);
      setServiceTotal(service_total);
      setCartTotal(item_total + service_total);
      setItems(cartItems);
    };
    getItems();
  }, []);

  if (items === null) {
    return (
      <section className="w-full max-w-[2428px] mx-auto flex items-center px-4 py-8 gap-1">
        <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faSpinner} spin />
        <p>Loading Cart</p>
      </section>
    );
  }
  return (
    <section className="w-full max-w-[2428px] mx-auto flex flex-col  px-4 py-8 gap-8">
      <section className="w-full flex flex-col md:flex-row gap-8">
        <section className="w-full flex1 flex flex-col gap-4">
          {Object.keys(items).length === 0 ? (
            <></>
          ) : (
            <>
              {Object.keys(items).map((store) => (
                <StoreItems
                  cart_id={props.cart_id}
                  store_id={store}
                  items={items[store]}
                  key={`store-${store}`}
                />
              ))}
            </>
          )}
        </section>
        <section className="flex flex-col gap-4 w-full md:w-[350px] xl:w-[400px]">
          <h3>Summary</h3>
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
            <section className="w-full flex justify-between pb-4">
              <p className="text-sm text-muted-foreground">
                Shipping, taxes, and discount codes are calculated at checkout
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
          <Button className="w-full" asChild>
            <Link href="/checkout" className="w-full">
              Checkout
            </Link>
          </Button>
        </section>
      </section>
      <section></section>
      <section></section>
    </section>
  );
}
