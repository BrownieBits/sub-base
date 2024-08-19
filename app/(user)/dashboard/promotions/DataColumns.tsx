'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { db } from '@/lib/firebase';
import {
  faArrowDown,
  faArrowUp,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import { getCookie } from 'cookies-next';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { revalidate } from './actions';

export type Promotion = {
  id: string;
  amount: number;
  title: string;
  minimum_order_value: number;
  number_of_uses: number;
  times_used: number;
  type: string;
  user_id: string;
  status: 'Active' | 'Inactive';
  store_id: string;
};

export async function ChangeStatus(
  action: string | boolean,
  id: string,
  item: 'status' | 'show'
) {
  const store_id = getCookie('default_store');
  const docRef = doc(db, 'stores', store_id!, 'promotions', id);
  if (action === 'Delete') {
    await deleteDoc(docRef);
    return 'Success';
  }
  if (item === 'status') {
    await updateDoc(docRef, {
      status: action,
    });
  } else {
    await updateDoc(docRef, {
      show_in_banner: action,
    });
  }

  revalidate();
}

export const columns: ColumnDef<Promotion>[] = [
  {
    accessorKey: 'store_id',
    header: () => <div className="hidden"></div>,
    cell: ({ row }) => <div className="hidden"></div>,
  },
  {
    accessorKey: 'id',
    header: () => <div className="hidden"></div>,
    cell: ({ row }) => <div className="hidden"></div>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            Code
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            Code
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 bg-inherit hover:bg-inherit"
        >
          Code
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            Type
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            Type
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 bg-inherit hover:bg-inherit"
        >
          Type
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'times_used',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            # of Times Used
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            # of Times Used
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 bg-inherit hover:bg-inherit"
        >
          # of Times Used
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            Status
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            Status
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 bg-inherit hover:bg-inherit"
        >
          Status
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const store_id = row.getValue('store_id') as string;
      const on = row.getValue('status') === 'Active' ? true : false;
      return (
        <Switch
          id="status"
          aria-label={`Status ${row.getValue('status')}`}
          title={`Status ${row.getValue('status')}`}
          checked={on}
          onCheckedChange={(event) => {
            if (event) {
              ChangeStatus('Active', id, 'status');
            } else {
              ChangeStatus('Inactive', id, 'status');
            }
          }}
        />
      );
    },
  },
  {
    accessorKey: 'show_in_banner',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            Show In Banner
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-inherit hover:bg-inherit text-foreground"
          >
            Show In Banner
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 bg-inherit hover:bg-inherit"
        >
          Show In Banner
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const store_id = row.getValue('store_id') as string;
      return (
        <Switch
          id="status"
          aria-label={`Status ${row.getValue('status')}`}
          title={`Status ${row.getValue('status')}`}
          checked={row.getValue('show_in_banner')}
          onCheckedChange={(event) => {
            if (event) {
              ChangeStatus(true, id, 'show');
            } else {
              ChangeStatus(false, id, 'show');
            }
          }}
        />
      );
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const store_id = row.getValue('store_id') as string;
      return (
        <section className="flex gap-4 justify-end items-center">
          <Button
            variant="link"
            title="Make Active"
            onClick={() => ChangeStatus('Delete', id, 'show')}
            className="p-0 text-foreground"
          >
            <FontAwesomeIcon className="icon" icon={faTrash} />
          </Button>
        </section>
      );
    },
  },
];
