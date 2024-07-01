'use client';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { DocumentReference, doc, writeBatch } from 'firebase/firestore';

export default function UploadItems({
  categories,
  cat_id,
}: {
  categories: any;
  cat_id: string;
}) {
  async function uploadItems() {
    const batch = writeBatch(db);
    const vbatch = writeBatch(db);
    categories.map((item: any) => {
      if (item !== null) {
        const categoryRef: DocumentReference = doc(
          db,
          `printful_categories/${cat_id}/products/`,
          item.product.id.toString()
        );
        if (!item.product.is_discontinued) {
          const colors = item.variants.map(
            (variant: any) => variant.color_code
          );
          const colorsSet = new Set(colors);
          item.product.colors = [...colorsSet];
          batch.set(categoryRef, item.product);
          item.variants.map((variant: any) => {
            const variantRef: DocumentReference = doc(
              db,
              `printful_categories/${cat_id}/products/${item.product.id.toString()}/variants`,
              variant.id.toString()
            );
            vbatch.set(variantRef, variant);
          });
        }
      }
    });
    await batch.commit();
    await vbatch.commit();
    return;
  }

  return <Button onClick={uploadItems}>Upload Items</Button>;
}
// export default function UploadItems({ categories }: { categories: any }) {
//     async function uploadItems() {
//       console.log(categories.length);
//       const batch = writeBatch(db);

//       categories.map((item: any) => {
//         console.log(item.id);
//         const categoryRef: DocumentReference = doc(
//           db,
//           'printful_products',
//           item.id.toString()
//         );
//         batch.set(categoryRef, item);
//       });
//       await batch.commit();
//       return;
//     }
//     return <Button onClick={uploadItems}>Upload Items</Button>;
// }
