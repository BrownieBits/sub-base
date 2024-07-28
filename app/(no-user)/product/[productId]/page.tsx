import { db } from '@/lib/firebase';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import ProductDetailPage from './ProductDetailPage';
// import ShowAvatar from '../../ShowAvatar';

type Props = {
  params: { productId: string };
};
type Data = {
  store?: DocumentData;
  product?: DocumentData;
  error?: string;
};

async function getData(productId: string) {
  const productRef: DocumentReference = doc(db, 'products', productId);
  const productData: DocumentData = await getDoc(productRef);

  if (productData.exists()) {
    const storeRef: DocumentReference = doc(
      db,
      'stores',
      productData.data().store_id
    );
    const storeData: DocumentData = await getDoc(storeRef);

    return {
      store: storeData,
      product: productData,
    };
  }
  return {
    error: 'No Product',
  };
}

export default async function ProductPage({ params }: Props) {
  const data: Data = await getData(params.productId);

  if (data.error === 'No Product') {
    return (
      <section>
        <section className="flex w-full justify-between items-center px-4 py-8 gap-4">
          <h1>No Such Product</h1>
        </section>
      </section>
    );
  }
  return (
    <ProductDetailPage
      store_id={data.store?.id}
      avatar={data.store?.data().avatar_url}
      store_name={data.store?.data().name}
      subscription_count={data.store?.data().subscription_count}
      images={data.product?.data().images}
      product_name={data.product?.data().name}
      product_type={data.product?.data().product_type}
      price={data.product?.data().price}
      compare_at={data.product?.data().compare_at}
      currency={data.product?.data().currency}
      product_id={data.product?.id}
      product_description={data.product?.data().description}
      like_count={data.product?.data().like_count}
    />
  );
}
