import { db } from '@/firebase';
import {
  DocumentReference,
  doc,
  DocumentData,
  getDoc,
  CollectionReference,
  collection,
  query,
  where,
  getDocs,
  QuerySnapshot,
} from 'firebase/firestore';
import { Metadata, ResolvingMetadata } from 'next';
import ShowAvatar from '../../ShowAvatar';
import ProductCard from '@/components/amaze-ui/ProductCard';
import { SubsciberButton } from '@/components/amaze-ui/SubscribeButton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  params: { store: string; collection: string };
};
type Data = {
  store: DocumentData;
  collection: DocumentData;
  collections: QuerySnapshot<DocumentData, DocumentData>;
};

async function getData(store: string, collectionId: string) {
  const storeRef: DocumentReference = doc(db, 'stores', store);
  const storeData: DocumentData = await getDoc(storeRef);

  if (!storeData.exists()) {
    return 'No Store';
  }

  const collectionRef: DocumentReference = doc(db, 'collections', collectionId);
  const collectionData: DocumentData = await getDoc(collectionRef);

  if (!collectionData.exists) {
    redirect(`/creator/${store}`);
  }

  const collectionsRef: CollectionReference = collection(db, 'collections');
  const colQuery = query(collectionsRef, where('store_id', '==', store));
  const collectionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(colQuery);

  return {
    store: storeData,
    collection: collectionData,
    collections: collectionsData,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: Data | 'No Store' = await getData(
    params.store,
    params.collection
  );
  if (data === 'No Store') {
    return {
      title: 'No Store',
    };
  }
  return {
    title: `${data.store.data().display_name} - ${data.collection.data().title}`,
  };
}

export default async function CreatorStoreCollection({ params }: Props) {
  const data: Data | 'No Store' = await getData(
    params.store,
    params.collection
  );

  if (data === 'No Store') {
    return (
      <section>
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>No Such Store</h1>
        </section>
      </section>
    );
  }
  return (
    <section>
      <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
        <Link href={`/creator/${params.store}`} className="flex gap-[30px]">
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
        <section className="flex w-full gap-[30px] justify-start px-[15px] pb-[10px]">
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
      <Separator />

      {data.collection.data().products.length === 0 ? (
        <span className="p-[15px]">Nothing here yet...</span>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4  gap-x-[30px] gap-y-[60px] p-[15px]">
          {data.collection
            .data()
            .products?.map((item: string) => (
              <ProductCard id={item} show_creator={false} key={item} />
            ))}
        </div>
      )}
    </section>
  );
}
