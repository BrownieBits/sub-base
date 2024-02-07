import { client, previewClient } from '@/lib/contentful';
import { MenuItem } from './MenuItem';

export const MenuItems = async (props: any) => {
  const data = await client.getEntry(props.id);
  const items = data.fields.creatorMenuItems;
  return (
    <ul
      className={`flex flex-col py-[15px] border-b-[1px] border-b-border`}
      key={props.id}
    >
      {items.map((item: any, i: number) => {
        return <MenuItem item={item} key={item.sys.id} />;
      })}
    </ul>
  );
};
