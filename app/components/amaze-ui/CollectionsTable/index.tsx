import { DataTable } from '@/components/amaze-ui/DataTable';
import { columns } from './columns';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';

export const CollectionsTable = (props: {
  snapshot: QuerySnapshot<DocumentData, DocumentData>;
}) => {
  const data = props.snapshot.docs.map((item) => {
    return {
      id: item.id,
      products: item.data().products,
      status: item.data().status,
      title: item.data().title,
      type: item.data().type,
      user_id: item.data().user_id,
      tags: item.data().tags || null,
      store_id: item.data().store_id,
    };
  });

  return (
    <section className="w-full">
      <DataTable columns={columns} data={data} />
    </section>
  );
};
