import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { printful } from '@/lib/printful';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import UploadItems from './UploadItems';

type Props = {
  params: { cat_id: string };
};
type Data = {
  products: any;
  category: DocumentSnapshot<DocumentData, DocumentData>;
};

async function getProducts(products: any) {
  console.log(products);
  var results = await Promise.all(
    products.map(async (item: any): Promise<any> => {
      const { result } = await printful.catalog.getProduct(parseInt(item.id));
      return result;
    })
  );
  return results;
}

async function getData(id: string) {
  const { result } = await printful.catalog.getAllProducts(id);
  const results = await getProducts(result);
  console.log(results);
  const categoryRef: DocumentReference = doc(db, 'printful_categories', id);
  const produtctsRef: CollectionReference = collection(db, 'printful_products');
  const q = query(produtctsRef, where('main_category_id', '==', parseInt(id)));
  const produtctsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);
  const categoryDoc: DocumentSnapshot<DocumentData, DocumentData> =
    await getDoc(categoryRef);
  return {
    products: results,
    category: categoryDoc,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: Data = await getData(params.cat_id);
  return {
    title: data.category.data()?.title,
  };
}

export default async function BaseProducts({ params }: Props) {
  const data: Data = await getData(params.cat_id);
  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] pt-[30px] gap-[15px]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/products">
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/products/base-products">
                  Base Categories
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.category.data()?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>{data.category.data()?.title}</h1>
        </section>
        <HeroBanner page_slug="creator-liked-items" />
      </section>
      <Separator />
      <UploadItems categories={data.products} cat_id={params.cat_id} />

      {/* <section className="w-full max-w-[3096px] mx-auto">
        {data.products.docs.length === 0 ? (
          <NoBaseProducts />
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-[30px] gap-y-[60px] px-[15px] py-[30px]">
            {data.products.docs.map((doc: any) => {
              return (
                <Link
                  href={`/dashboard/products/base-products/${doc.id}`}
                  key={doc.id}
                >
                  <Image
                    src={doc.data().image}
                    width="300"
                    height="300"
                    alt={doc.data().title}
                    className="flex group-hover:hidden rounded-lg overflow-hidden w-full pb-[15px]"
                  />
                  <p>
                    <b>{doc.data().title}</b>
                  </p>
                </Link>
              );
            })}
          </section>
        )}
      </section> */}
    </section>
  );
}
