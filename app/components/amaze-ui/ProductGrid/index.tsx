'use client';

import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { NoProducts } from '@/components/amaze-ui/NoProducts';
import ProductCard from '../ProductCard';

export default function ProductGrid({
  products,
}: {
  products: QueryDocumentSnapshot<DocumentData, DocumentData>[];
}) {
  const productIds = products.map((doc) => doc.id);
  const blogsRef = collection(db, 'products');
  const q = query(blogsRef, where('__name__', 'in', productIds));
  const [blogSnapShots, loading1] = useCollection(q);

  return (
    <>
      {loading1 ? (
        <div>Loading</div>
      ) : (
        <div>
          {blogSnapShots?.docs?.length! > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4  gap-[15px] p-[15px]">
              {blogSnapShots?.docs?.map((doc) => (
                <ProductCard id={doc.id} show_creator={true} key={doc.id} />
              ))}
            </div>
          ) : (
            <NoProducts />
          )}
        </div>
      )}
    </>
  );
}
