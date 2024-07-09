import ProductCard from '@/components/sb-ui/ProductCard';
import { ShowMoreText } from '@/components/sb-ui/ShowMoreText';
import { SubsciberButton } from '@/components/sb-ui/SubscribeButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
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
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ShowAvatar from '../../ShowAvatar';
import { StorePasswordForm } from '../../password-protection';

type Props = {
  params: { slug: string; collection: string };
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
    redirect(`/store/${store}`);
  }

  const collectionsRef: CollectionReference = collection(
    db,
    `stores/${store}/collections`
  );
  const colQuery = query(collectionsRef, where('status', '==', 'Public'));
  const collectionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(colQuery);

  return {
    store: storeData,
    collection: collectionData,
    collections: collectionsData,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: Data | 'No Store' = await getData(params.slug, params.collection);
  if (data === 'No Store') {
    return {
      title: 'No Store',
    };
  }
  const description =
    data.store.data().description === ''
      ? 'This is a store'
      : data.store.data().description;
  const openGraphImages: string[] = [];

  if (data.store.data().banner_url !== '') {
    openGraphImages.push(data.store.data().banner_url);
  }
  return {
    title: `${data.store.data().name} Store - SubBase Creator Platform`,
    description: description,
    openGraph: {
      type: 'website',
      url: `https://sub-base.vercel.app/store/${params.slug}/${params.collection}`,
      title: `${data.store.data().name} Store - SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description: description,
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      creator: data.store.data().name,
      images: openGraphImages,
      title: `${data.store.data().name} Store - SubBase Creator Platform`,
      description: description,
      site: 'SubBase Creator Platform',
    },
  };
}

export default async function StoreCollection({ params }: Props) {
  const cookieStore = cookies();
  const store_pw = cookieStore.get(`${params.slug}-pw`);
  const data: Data | 'No Store' = await getData(params.slug, params.collection);

  async function revalidate() {
    'use server';
    revalidatePath(`/store/${params.slug}`);
  }

  if (data === 'No Store') {
    return (
      <section>
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>No Such Store</h1>
        </section>
      </section>
    );
  }
  if (
    data.store.data().password_protected &&
    data.store.data().password !== null &&
    data.store.data().password !== store_pw?.value!
  ) {
    return (
      <section>
        <section className="flex flex-col w-full h-[calc(100vh-56px)] justify-center align-center items-center px-[15px] py-[30px] gap-[15px]">
          <section className="flex flex-col bg-layer-one rounded border p-[30px]">
            <p className="pb-[15px]">
              <b>{data.store.data().name} is password protected</b>
            </p>
            <StorePasswordForm
              revalidate={revalidate}
              pw={data.store.data().password}
              cookieSlug={`${params.slug}-pw`}
            />
          </section>
        </section>
      </section>
    );
  }
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        {data.store.data().banner_url === '' ? (
          <></>
        ) : (
          <section className="flex justify-end rounded-b aspect-[6/1] md:aspect-[128/15] overflow-hidden">
            <Image
              src={data.store.data().banner_url}
              alt={data.store.data().name}
              width={3096}
              height={526}
              style={{ width: '100%', height: 'auto' }}
            ></Image>
          </section>
        )}
        <section className="flex flex-col md:flex-row w-full justify-between items-start md:items-center px-[15px] py-[30px] gap-[15px]">
          <section className="flex gap-[30px]">
            <Link href={`/store/${params.slug}`} className="">
              <ShowAvatar
                name={data.store.data().name}
                url={data.store.data().avatar_url}
              />
            </Link>
            <div className="">
              <h3>{data.store.data().name}</h3>
              <p>{data.store.data().subscription_count} subscribers</p>
              <ShowMoreText
                text={data.store.data().description}
                howManyToShow={50}
              />
            </div>
          </section>
          <SubsciberButton store={params.slug} />
        </section>

        {data.collections.docs.length === 0 ? (
          <></>
        ) : (
          <section className="flex w-full gap-[30px] justify-start px-[15px]">
            <Button
              asChild
              variant="link"
              className="px-0 text-md text-foreground border-b-[2px] rounded-none hover:no-underline border-transparent"
            >
              <Link
                href={`/store/${params.slug}`}
                aria-label={`${params.slug} Store`}
              >
                Home
              </Link>
            </Button>
            {data.collections?.docs?.map((doc) => (
              <Button
                asChild
                variant="link"
                className={cn(
                  'px-0 text-md text-foreground border-b-[2px] rounded-none hover:no-underline',
                  { 'border-transparent': params.collection !== doc.id }
                )}
                key={doc.id}
              >
                <Link
                  href={`/store/${params.slug}/collection/${doc.id}`}
                  aria-label="Products"
                >
                  {doc.data().name}
                </Link>
              </Button>
            ))}
          </section>
        )}
      </section>
      <Separator />
      <section className="w-full max-w-[3096px] mx-auto">
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
    </section>
  );
}
