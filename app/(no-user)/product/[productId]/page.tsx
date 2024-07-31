import { db } from '@/lib/firebase';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import ProductDetailPage from './ProductDetailPage';
import { options, variants } from './typedef';
// import ShowAvatar from '../../ShowAvatar';

type Props = {
  params: { productId: string };
};
type Data = {
  store?: DocumentData;
  product?: DocumentData;
  options?: QuerySnapshot<DocumentData, DocumentData>;
  variants?: QuerySnapshot<DocumentData, DocumentData>;
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

    const optionsRef: CollectionReference = collection(
      db,
      'products',
      productId,
      'options'
    );
    const optionsQuery = query(
      optionsRef,
      where('index', '!=', null),
      orderBy('index')
    );
    const optionsData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(optionsQuery);

    const variantsRef: CollectionReference = collection(
      db,
      'products',
      productId,
      'variants'
    );
    const variantsQuery = query(
      variantsRef,
      where('index', '!=', null),
      orderBy('index')
    );
    const variantsData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(variantsQuery);

    return {
      store: storeData,
      product: productData,
      options: optionsData,
      variants: variantsData,
    };
  }
  return {
    error: 'No Product',
  };
}

export default async function ProductPage({ params }: Props) {
  const data: Data = await getData(params.productId);
  let options: options[] = [];
  let variants: variants[] = [];
  if (data.error === 'No Product') {
    return (
      <section>
        <section className="flex w-full justify-between items-center px-4 py-8 gap-4">
          <h1>No Such Product</h1>
        </section>
      </section>
    );
  }

  if (data.options !== undefined) {
    options = data.options?.docs.map((option) => {
      return {
        name: option.data().name,
        options: option.data().options,
      };
    });
  }
  if (data.variants !== undefined) {
    variants = data.variants?.docs.map((variant) => {
      return {
        compare_at: variant.data().compare_at as number,
        inventory: variant.data().inventory as number,
        name: variant.data().name as string,
        price: variant.data().price as number,
      };
    });
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
      created_at={data.product?.data().created_at}
      options={options}
      variants={variants}
      view_count={data.product?.data().view_count}
      track_inventory={data.product?.data().track_inventory}
    />
  );
}
