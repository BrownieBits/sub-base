import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { Item, Promotion } from '@/lib/types';
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
          }
        })
      );
    })
  );

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
    <section>
      <section className="w-full max-w-[1754px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Checkout</h1>
        </section>
      </section>
      <Separator />
      <CheckoutPage items={data.items!} promotions={data.promotions!} />
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
