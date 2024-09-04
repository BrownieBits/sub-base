import { db } from '@/lib/firebase';
import { Item, Promotion, RemovedProduct } from '@/lib/types';
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
  writeBatch,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import CheckoutPage from './CheckoutPage';
import TrackCheckout from './TrackCheckout';

type Items = {
  [key: string]: Item[];
};
type Promotions = {
  [key: string]: Promotion;
};
type Data = {
  store_ids?: string[];
  items?: Items;
  promotions?: Promotions;
  removedItems?: RemovedProduct[];
  error?: string;
};

async function getData(cartId: string) {
  const itemsRef: CollectionReference = collection(
    db,
    'carts',
    cartId,
    'items'
  );
  const itemsQuery = query(itemsRef);
  const itemsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(itemsQuery);

  if (itemsData.empty) {
    return {
      error: 'No Products',
    };
  }

  const promosRef: CollectionReference = collection(
    db,
    'carts',
    cartId,
    'promotions'
  );
  const promosQuery = query(promosRef);
  const promosData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(promosQuery);

  const productIDs: string[] = [];
  const cartItems: Items = {};

  itemsData.docs.map((doc) => {
    productIDs.push(doc.id.split('_')[0]);
    if (!cartItems.hasOwnProperty(doc.data().store_id)) {
      cartItems[doc.data().store_id] = [
        {
          cart_item_id: doc.id,
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
          service_percent: 0,
        },
      ];
    } else {
      cartItems[doc.data().store_id].push({
        cart_item_id: doc.id,
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
        service_percent: 0,
      });
    }
  });
  const productsRef: CollectionReference = collection(db, 'products');
  const productsQuery = query(productsRef, where('__name__', 'in', productIDs));
  const productsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(productsQuery);

  const batch = writeBatch(db);
  const removed_items: RemovedProduct[] = [];

  await Promise.all(
    productsData.docs.map(async (document) => {
      if (document.data().status === 'Private') {
        let removeIndex = 0;
        cartItems[document.data().store_id].map((item, index) => {
          if (item.id === document.id) {
            removeIndex = index;
            removed_items.push({
              image_url: document.data().images[0],
              name: document.data().name,
              reason: 'Product no longer public.',
            });
            const removeDoc: DocumentReference = doc(
              db,
              `carts/${cartId}/items`,
              item.cart_item_id
            );
            batch.delete(removeDoc);
          }
        });
        cartItems[document.data().store_id].splice(removeIndex, 1);
        if (cartItems[document.data().store_id].length === 0) {
          delete cartItems[document.data().store_id];
        }
      } else if (
        document.data().track_inventory &&
        document.data().inventory === 0
      ) {
        let removeIndex = 0;
        cartItems[document.data().store_id].map((item, index) => {
          if (item.id === document.id) {
            removeIndex = index;
            removed_items.push({
              image_url: document.data().images[0],
              name: document.data().name,
              reason: 'Product out of stock.',
            });
            const removeDoc: DocumentReference = doc(
              db,
              `carts/${cartId}/items`,
              item.cart_item_id
            );
            batch.delete(removeDoc);
          }
        });
        cartItems[document.data().store_id].splice(removeIndex, 1);
        if (cartItems[document.data().store_id].length === 0) {
          delete cartItems[document.data().store_id];
        }
      } else {
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
              item.service_percent = document.data().service_percent;
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
              if (item.track_inventory && item.inventory < item.quantity) {
                item.quantity = item.inventory;
                removed_items.push({
                  image_url: document.data().images[0],
                  name: document.data().name,
                  reason: `Only ${item.inventory} in stock.`,
                });
                const updateDoc: DocumentReference = doc(
                  db,
                  `carts/${cartId}/items`,
                  item.cart_item_id
                );
                batch.update(updateDoc, {
                  quantity: item.quantity,
                });
              }
            }
          })
        );
      }
    })
  );
  await batch.commit();

  const promotions: Promotions = {};
  if (!promosData.empty) {
    await Promise.all(
      promosData.docs.map(async (promo) => {
        const promotionRef: DocumentReference = doc(
          db,
          'stores',
          promo.id,
          'promotions',
          promo.data().id
        );
        const promotionDoc: DocumentData = await getDoc(promotionRef);
        if (promotionDoc.exists() && promotionDoc.data().status === 'Active') {
          promotions[promo.id] = {
            promo_id: promotionDoc.id,
            amount: promotionDoc.data().amount,
            minimum_order_value: promotionDoc.data().minimum_order_value,
            expiration_date: promotionDoc.data().expiration_date,
            name: promotionDoc.data().name,
            status: promotionDoc.data().status,
            type: promotionDoc.data().type,
          };
        }
      })
    );
  }
  const store_ids: string[] = Object.keys(cartItems);

  return {
    store_ids: store_ids,
    items: cartItems,
    promotions: promotions,
    removedItems: removed_items,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Checkout`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/checkout/`,
      title: `Checkout`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      title: `Checkout`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function Checkout() {
  const cookieStore = cookies();
  const cartId = cookieStore.get(`cart_id`);
  const user_id = cookieStore.get(`user_id`);
  const country = headers().get('x-geo-country') as string;
  const city = headers().get('x-geo-city') as string;
  const region = headers().get('x-geo-region') as string;
  const ip = headers().get('x-ip') as string;
  const data: Data = await getData(cartId?.value!);

  if (data.error === 'No Products') {
    return (
      <section>
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Cart is empty</h1>
        </section>
      </section>
    );
  }

  return (
    <section className="w-full">
      <CheckoutPage
        items={data.items!}
        promotions={data.promotions!}
        removed_items={data.removedItems!}
        user_id={user_id?.value}
      />
      <TrackCheckout
        store_ids={data.store_ids!}
        user_id={user_id?.value}
        country={country}
        city={city}
        region={region}
        ip={ip}
      />
    </section>
  );
}
