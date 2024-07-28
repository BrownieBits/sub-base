import { client } from '@/lib/contentful';
import { MenuItem } from './MenuItem';

export const MenuItems = async (props: any) => {
  const data = await client.getEntry(props.id);
  const items = data.fields.menuItems;
  return (
    <ul
      className={`flex flex-col py-4 border-b-[1px] border-b-border`}
      key={props.id}
    >
      {items.map((item: any, i: number) => {
        return (
          <MenuItem item={item} inSheet={props.inSheet} key={item.sys.id} />
        );
      })}
    </ul>
  );
};
