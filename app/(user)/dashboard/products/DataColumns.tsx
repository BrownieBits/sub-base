'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPenToSquare,
  faGear,
  faWrench,
  faArrowDown,
  faArrowUp,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { ChangeStatus } from './actions';
import Image from 'next/image';

export type Product = {
  id: string;
  base_price: number;
  description: string;
  likes: number;
  revenue: number;
  tags: string[];
  title: string;
  type: string;
  units_sold: number;
  user_id: string;
  views: string;
  status: 'Private' | 'Public';
  images: string[];
};

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'images',
    header: () => <div className="w-[60px]"></div>,
    cell: ({ row }) => {
      const imgs: string[] = row.getValue('images');

      return (
        <Image
          src={imgs[0].replace('800/800', '60/60')}
          width="60"
          height="60"
          alt="Product Image"
          className="rounded-lg overflow-hidden w-[60px]"
        />
      );
    },
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
            Product
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
            Product
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
          Product
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
      return row.getValue('status') === 'Public' ? (
        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
          {row.getValue('status')}
        </span>
      ) : (
        <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
          {row.getValue('status')}
        </span>
      );
    },
  },
  {
    accessorKey: 'units_sold',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-none hover:bg-none"
          >
            Units Sold
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
            Units Sold
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
          Units Sold
          <FontAwesomeIcon
            className="icon text-muted hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'views',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-none hover:bg-none"
          >
            Views
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
            Views
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
          Views
          <FontAwesomeIcon
            className="icon text-muted hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'likes',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-none hover:bg-none"
          >
            Likes
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
            Likes
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
          Likes
          <FontAwesomeIcon
            className="icon text-muted hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'revenue',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-none hover:bg-none"
          >
            Revenue
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
            Revenue
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
          Revenue
          <FontAwesomeIcon
            className="icon text-muted hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('revenue'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const store_id = row.getValue('store_id') as string;
      return (
        <section className="flex gap-[15px] justify-end">
          <Button asChild variant="link" className="p-0 text-foreground">
            <Link
              href={`/dashboard/${row.getValue('store_id')}/products/baseProducts`}
              aria-label="Create Product"
            >
              <FontAwesomeIcon className="icon" icon={faPenToSquare} />
            </Link>
          </Button>
          <Button asChild variant="link" className="p-0 text-foreground">
            <Link
              href={`/dashboard/${row.getValue('store_id')}/products/baseProducts`}
              aria-label="Create Product"
            >
              <FontAwesomeIcon className="icon" icon={faGear} />
            </Link>
          </Button>
          <Button asChild variant="link" className="p-0 text-foreground">
            <Link
              href={`/dashboard/${row.getValue('store_id')}/products/baseProducts`}
              aria-label="Create Product"
            >
              <FontAwesomeIcon className="icon" icon={faWrench} />
            </Link>
          </Button>
          {row.getValue('status') === 'Public' ? (
            <Button
              variant="link"
              title="Make Private"
              onClick={() => ChangeStatus('Private', id)}
              className="p-0 text-foreground"
            >
              <FontAwesomeIcon className="icon" icon={faEyeSlash} />
            </Button>
          ) : (
            <Button
              variant="link"
              title="Make Public"
              onClick={() => ChangeStatus('Public', id)}
              className="p-0 text-foreground"
            >
              <FontAwesomeIcon className="icon" icon={faEye} />
            </Button>
          )}
          <Button
            variant="link"
            title="Delte"
            onClick={() => ChangeStatus('Delete', id)}
            className="p-0 text-foreground"
          >
            <FontAwesomeIcon className="icon" icon={faTrash} />
          </Button>
        </section>
      );
    },
  },
];
