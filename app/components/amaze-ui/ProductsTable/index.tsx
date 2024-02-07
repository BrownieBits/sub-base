import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { columns } from './columns';
import { DataTable } from '@/components/amaze-ui/DataTable';

export const ProductsTable = (props: {
  snapshot: QuerySnapshot<DocumentData, DocumentData>;
}) => {
  const data = props.snapshot.docs.map((item) => {
    return {
      id: item.id,
      base_price: item.data().base_price,
      description: item.data().description,
      likes: item.data().likes,
      revenue: item.data().revenue,
      tags: item.data().tags,
      title: item.data().title,
      type: item.data().type,
      units_sold: item.data().units_sold,
      user_id: item.data().user_id,
      views: item.data().views,
      status: item.data().status,
      store_id: item.data().store_id,
      images: item.data().images,
    };
  });
  return (
    <section className="w-full">
      <DataTable columns={columns} data={data} />
    </section>
  );
};
