'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { ChangeStatus } from './actions';
import { Switch } from '@/components/ui/switch';

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
            className="p-0 bg-none hover:bg-none"
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
            className="p-0 bg-none hover:bg-none"
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
            className="icon text-muted hover:text-foreground ml-[5px]"
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
            className="p-0 bg-none hover:bg-none"
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
            className="p-0 bg-none hover:bg-none"
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
            className="icon text-muted hover:text-foreground ml-[5px]"
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
            className="p-0 bg-none hover:bg-none"
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
            className="p-0 bg-none hover:bg-none"
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
            className="icon text-muted hover:text-foreground ml-[5px]"
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
            className="p-0 bg-none hover:bg-none"
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
            className="p-0 bg-none hover:bg-none"
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
            className="icon text-muted hover:text-foreground ml-[5px]"
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
          onCheckedChange={(e) => {
            if (e) {
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
            className="p-0 bg-none hover:bg-none"
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
            className="p-0 bg-none hover:bg-none"
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
            className="icon text-muted hover:text-foreground ml-[5px]"
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
          onCheckedChange={(e) => {
            if (e) {
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
        <section className="flex gap-[15px] justify-end items-center">
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
