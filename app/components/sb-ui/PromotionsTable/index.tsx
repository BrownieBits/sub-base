import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { DataTable } from '@/components/sb-ui/DataTable';
import { columns } from './columns';

export const PromotionsTable = (props: {
  snapshot: QuerySnapshot<DocumentData, DocumentData>;
}) => {
  const data = props.snapshot.docs.map((item) => {
    return {
      id: item.id,
      amount: item.data().amount,
      title: item.data().title,
      minimum_order_value: item.data().minimum_order_value,
      number_of_uses: item.data().number_of_used,
      times_used: item.data().times_used,
      type: item.data().type,
      user_id: item.data().user_id,
      status: item.data().status,
      store_id: item.data().store_id,
      show_in_banner: item.data().show_in_banner,
    };
  });
  return (
    <section className="w-full">
      <DataTable columns={columns} data={data} />
    </section>
  );
};
