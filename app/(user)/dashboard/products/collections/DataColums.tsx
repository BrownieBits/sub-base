'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPenToSquare,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Revalidate } from './actions';
import { DocumentReference, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

async function Archive(
  action: string,
  id: string,
  name: string,
  store_id: string
) {
  const docRef: DocumentReference = doc(
    db,
    `stores/${store_id}/collections`,
    id
  );
  await updateDoc(docRef, {
    status: action,
  });
  toast('Colletion Updated', {
    description: `The ${name} collection was made ${action}.`,
  });
  Revalidate();
}

export type Collection = {
  id: string;
  products: string[];
  status: 'Private' | 'Public';
  name: string;
  type: string;
  owner_id: string;
  tags: string;
  store_id: string;
};

export const columns: ColumnDef<Collection>[] = [
  {
    accessorKey: 'id',
    header: () => <div className="hidden"></div>,
    cell: ({ row }) => <div className="hidden"></div>,
  },
  {
    accessorKey: 'store_id',
    header: () => <div className="hidden"></div>,
    cell: ({ row }) => <div className="hidden"></div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-none hover:bg-none"
          >
            Name
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
            Name
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
          Name
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
    accessorKey: 'tags',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-none hover:bg-none"
          >
            Tags
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
            Tags
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
          Tags
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
    accessorKey: 'products',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 bg-none hover:bg-none"
          >
            # of Products
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
            # of Products
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
          # of Products
          <FontAwesomeIcon
            className="icon text-muted hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const products = row.getValue('products') as string[];
      return <div>{products.length}</div>;
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const name = row.getValue('name') as string;
      const store_id = row.getValue('store_id') as string;
      return (
        <section className="flex gap-[15px] justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button asChild variant="link" className="p-0 text-foreground">
                  <Link
                    href={`/dashboard/products/collections/${row.getValue('id')}`}
                    aria-label="Create Product"
                  >
                    <FontAwesomeIcon className="icon" icon={faPenToSquare} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {row.getValue('status') === 'Public' ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="link"
                    title="Make Private"
                    onClick={() => Archive('Private', id, name, store_id)}
                    className="p-0 text-foreground"
                  >
                    <FontAwesomeIcon className="icon" icon={faEyeSlash} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Make Private</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="link"
                    title="Make Public"
                    onClick={() => Archive('Public', id, name, store_id)}
                    className="p-0 text-foreground"
                  >
                    <FontAwesomeIcon className="icon" icon={faEye} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Make Public</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </section>
      );
    },
  },
];
