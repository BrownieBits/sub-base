import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  faCloudArrowDown,
  faImagePortrait,
  faPrint,
  faSquarePlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export const AddProductButton = (props: {
  copy: string;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
  className?: string | '';
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button asChild variant={props.variant} className={props.className}>
          <div>
            <FontAwesomeIcon
              className="icon mr-2 h-4 w-4"
              icon={faSquarePlus}
            />
            {props.copy}
          </div>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full flex justify-between">
            <AlertDialogTitle>Choose product type to add</AlertDialogTitle>
            <AlertDialogCancel asChild>
              <FontAwesomeIcon className="icon h-4 w-4" icon={faXmark} />
            </AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <section className="w-full flex gap-[30px] pt-[30px]">
              <Button variant="outline" className="flex-1 h-auto" asChild>
                <Link href="/" className="flex flex-col items-center group">
                  <FontAwesomeIcon
                    className="icon pb-[5px] text-6xl group-hover:text-primary"
                    icon={faCloudArrowDown}
                  />
                  <p className="text-xs group-hover:text-foreground">
                    <b>Digital Product</b>
                  </p>
                </Link>
              </Button>
              <Button variant="outline" className="flex-1 h-auto" asChild>
                <Link href="/" className="flex flex-col items-center group">
                  <FontAwesomeIcon
                    className="icon pb-[5px] text-6xl group-hover:text-primary"
                    icon={faPrint}
                  />
                  <p className="text-xs group-hover:text-foreground">
                    <b>POD Product</b>
                  </p>
                </Link>
              </Button>
              <Button variant="outline" className="flex-1 h-auto" asChild>
                <Link href="/" className="flex flex-col items-center group">
                  <FontAwesomeIcon
                    className="icon pb-[5px] text-6xl group-hover:text-primary"
                    icon={faImagePortrait}
                  />
                  <p className="text-xs group-hover:text-foreground">
                    <b>My Own Product</b>
                  </p>
                </Link>
              </Button>
            </section>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
