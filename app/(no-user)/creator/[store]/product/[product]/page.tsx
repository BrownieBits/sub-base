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
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
// import ShowAvatar from '../../ShowAvatar';
import { LikeButton } from '@/components/sb-ui/LikeButton';
import { SubsciberButton } from '@/components/sb-ui/SubscribeButton';
import { Button } from '@/components/ui/button';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ProductImages from './ProductImages';

type Props = {
  params: { store: string; product: string };
};
type Data = {
  store: DocumentData;
  product: DocumentData;
  collections: QuerySnapshot<DocumentData, DocumentData>;
};

async function getData(store: string, productId: string) {
  const storeRef: DocumentReference = doc(db, 'stores', store);
  const storeData: DocumentData = await getDoc(storeRef);

  if (!storeData.exists()) {
    return 'No Store';
  }

  const productRef: DocumentReference = doc(db, 'products', productId);
  const productData: DocumentData = await getDoc(productRef);

  if (!productData.exists) {
    redirect(`/creator/${store}`);
  }

  const collectionsRef: CollectionReference = collection(db, 'collections');
  const colQuery = query(collectionsRef, where('store_id', '==', store));
  const collectionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(colQuery);

  return {
    store: storeData,
    product: productData,
    collections: collectionsData,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: Data | 'No Store' = await getData(params.store, params.product);
  if (data === 'No Store') {
    return {
      title: 'No Store',
    };
  }
  return {
    title: `${data.store.data().display_name} - ${data.product.data().title}`,
  };
}

export default async function CreatorStoreProduct({ params }: Props) {
  const data: Data | 'No Store' = await getData(params.store, params.product);

  if (data === 'No Store') {
    return (
      <section>
        <section className="flex w-full justify-between items-center px-4 py-8 gap-4">
          <h1>No Such Store</h1>
        </section>
      </section>
    );
  }
  return (
    <section className="flex flex-col gap-8 p-4 max-w-[2428px] mx-auto">
      <section key="productInfo" className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col md:hidden">
          <div className="flex justify-between">
            <Link
              href={`/creator/${params.store}`}
              className="flex gap-4 items-center mb-4"
            >
              {/* <ShowAvatar data={data.store.data()} size="sm" /> */}
              <p className="font-bold text-sm">
                {data.store.data().display_name}
              </p>
            </Link>
            <SubsciberButton store={params.store} />
          </div>

          <div className="flex justify-between">
            <h1 className="text-xl">{data.product.data().title}</h1>
            <span className="font-bold text-xl">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(data.product.data().base_price)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.product.data().type}
          </p>
        </div>
        <ProductImages images={data.product.data().images} />
        <section className="w-full md:w-[600px] lg:w-[1000px] flex flex-col">
          <div className="hidden md:flex flex-col">
            <div className="flex justify-between">
              <Link
                href={`/creator/${params.store}`}
                className="flex gap-4 items-center mb-8"
              >
                {/* <ShowAvatar data={data.store.data()} size="sm" /> */}
                <p className="font-bold text-md">
                  {data.store.data().display_name}
                </p>
              </Link>
              <SubsciberButton store={params.store} />
            </div>
            <div className="flex justify-between">
              <h1 className="text-2xl">{data.product.data().title}</h1>
              <span className="font-bold text-2xl">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(data.product.data().base_price)}
              </span>
            </div>
            <p className="text-md text-muted-foreground">
              {data.product.data().type}
            </p>
          </div>
          {data.product.data().colors &&
          data.product.data().colors.length > 1 ? (
            <div className="pt-0 md:pt-8">
              <p>Color:</p>
              <div className="flex flex-wrap gap-4 pt-[5px]">
                {data.product
                  .data()
                  .colors.map((color: { hex: string; name: string }) => {
                    return (
                      <div
                        className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]"
                        key={color.hex}
                      >
                        <div
                          className="rounded-full w-full h-full"
                          style={{
                            backgroundColor: `${color.hex}`,
                          }}
                        ></div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="pt-8">
            <p>Size:</p>
            <div className="flex flex-wrap w-full gap-4 pt-[5px]">
              <div className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]">
                <div className="flex justify-center items-center rounded-full w-full h-full">
                  <p className="font-bold text-sm">XS</p>
                </div>
              </div>
              <div className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]">
                <div className="flex justify-center items-center rounded-full w-full h-full">
                  <p className="font-bold text-sm">SM</p>
                </div>
              </div>
              <div className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]">
                <div className="flex justify-center items-center rounded-full w-full h-full">
                  <p className="font-bold text-sm">MD</p>
                </div>
              </div>
              <div className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]">
                <div className="flex justify-center items-center rounded-full w-full h-full">
                  <p className="font-bold text-sm">LG</p>
                </div>
              </div>
              <div className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]">
                <div className="flex justify-center items-center rounded-full w-full h-full">
                  <p className="font-bold text-sm">XL</p>
                </div>
              </div>
              <div className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]">
                <div className="flex justify-center items-center rounded-full w-full h-full">
                  <p className="font-bold text-sm">2XL</p>
                </div>
              </div>
              <div className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]">
                <div className="flex justify-center items-center rounded-full w-full h-full">
                  <p className="font-bold text-sm">3XL</p>
                </div>
              </div>
              <div className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]">
                <div className="flex justify-center items-center rounded-full w-full h-full">
                  <p className="font-bold text-sm">4XL</p>
                </div>
              </div>
              <div className="border rounded-full cursor-pointer w-[40px] h-[40px] p-[2px]">
                <div className="flex justify-center items-center rounded-full w-full h-full">
                  <p className="font-bold text-sm">5XL</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="mt-8">Add To Cart</Button>
          <div className="flex gap-4 justify-start pt-4">
            {/* <SubsciberButton store={params.store} /> */}
            <LikeButton product={params.product} store={params.store} />
            <Button variant="outline" asChild>
              <div>
                <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faShare} />
                Share
              </div>
            </Button>
          </div>
        </section>
      </section>
      <section key="productDescription"></section>
      <section key="productLike"></section>
      <section key="creatorOther"></section>
      {/* <section className="flex w-full justify-between items-center px-4 py-8 gap-4">
        <Link href={`/creator/${params.store}`} className="flex gap-8">
          <ShowAvatar data={data.store.data()} />
          <div className="">
            <h1>{data.store.data().display_name}</h1>
            <p>{data.store.data().subscribers} subscribers</p>
          </div>
        </Link>

        <SubsciberButton store={params.store} />
      </section>

      {data.collections.docs.length === 0 ? (
        <></>
      ) : (
        <section className="flex w-full gap-8 justify-start px-4 pb-[10px]">
          {data.collections?.docs?.map((doc) => (
            <Button
              asChild
              variant="link"
              className="px-0 text-md"
              key={doc.id}
            >
              <Link
                href={`/creator/${params.store}/collection/${doc.id}`}
                aria-label="Products"
              >
                {doc.data().title}
              </Link>
            </Button>
          ))}
        </section>
      )}
      <Separator /> */}

      {/* {data.collection.data().products.length === 0 ? (
        <span className="p-4">Nothing here yet...</span>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4  gap-x-8 gap-y-[60px] p-4">
          {data.collection
            .data()
            .products?.map((item: string) => (
              <ProductCard id={item} show_creator={false} key={item} />
            ))}
        </div>
      )} */}
    </section>
  );
}
