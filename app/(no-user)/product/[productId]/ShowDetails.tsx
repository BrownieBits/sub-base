'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import {
  faBinoculars,
  faClose,
  faGlobe,
  faInfoCircle,
  faStore,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Timestamp } from 'firebase/firestore';
import React from 'react';

export const ShowDetails = (props: {
  text: string;
  howManyToShow: number;
  store_name: string;
  product_id: string;
  // location: string;
  created_at: Timestamp;
  view_count: number;
  like_count: number;
}) => {
  const timestamp = new Date(
    props.created_at.seconds * 1000 + props.created_at.nanoseconds / 1000000
  );
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <section className="w-full p-4 border rounded bg-layer-one mt-8">
        <h4>Product Details</h4>
        <p className="pt-[5px] text-sm text-muted-foreground whitespace-pre-wrap">
          {props.text.length < props.howManyToShow
            ? props.text.replaceAll('\\n', '\n')
            : `${props.text.replaceAll('\\n', '\n').substring(0, props.howManyToShow)}...`}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-foreground p-[0] px-4 h-auto hover:no-underline"
                asChild
              >
                <span>...more</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  <h3>Product Details</h3>
                </DialogTitle>
                <DialogDescription className="flex flex-col">
                  <span className="text-foreground pb-4 whitespace-pre-wrap">
                    {props.text.replaceAll('\\n', '\n')}
                  </span>

                  <span className="w-full flex justify-start gap-0 text-foreground pb-4">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faGlobe}
                    />
                    htttps://{process.env.NEXT_PUBLIC_BASE_URL}/product/
                    {props.product_id}
                  </span>
                  <span className="w-full flex justify-start gap-0 text-foreground pb-4">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faStore}
                    />
                    htttps://{process.env.NEXT_PUBLIC_BASE_URL}/store/
                    {props.store_name}
                  </span>
                  <span className="text-foreground pb-4">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faThumbsUp}
                    />
                    {props.like_count} like
                    {props.like_count > 1 ? 's' : ''}
                  </span>
                  <span className="text-foreground pb-4">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faBinoculars}
                    />
                    {props.view_count} view{props.view_count > 1 ? 's' : ''}
                  </span>
                  <span className="text-foreground pb-4">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faInfoCircle}
                    />
                    Created{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(timestamp)}
                  </span>
                  {/* <span className="text-foreground pb-8">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faGlobeAmericas}
                    />
                    {
                      country_list.filter(
                        (country) => country.value === props.location
                      )[0].name
                    }
                  </span> */}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </p>
      </section>
    );
  }

  return (
    <section className="w-full p-4 border rounded bg-layer-one mt-8">
      <h4>Product Details</h4>
      <p className="pt-[5px] text-sm text-muted-foreground whitespace-pre-wrap">
        {props.text.length < props.howManyToShow
          ? props.text.replaceAll('\\n', '\n')
          : `${props.text.replaceAll('\\n', '\n').substring(0, props.howManyToShow)}...`}

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger>
            <Button
              variant="link"
              className="text-foreground p-[0] px-4 h-auto hover:no-underline"
              asChild
            >
              <span>...more</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="w-full max-w-[2428px] mx-auto">
              <DrawerTitle className="flex justify-between">
                <h3>Product Details</h3>
                <DrawerClose>
                  <Button variant="outline">
                    <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
                  </Button>
                </DrawerClose>
              </DrawerTitle>
              <DrawerDescription className="w-full flex flex-col items-start text-left">
                <span className="text-foreground pb-4 whitespace-pre-wrap">
                  {props.text.replaceAll('\\n', '\n')}
                </span>
                <span className="w-full flex justify-start gap-0 text-foreground pb-4">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faGlobe}
                  />
                  htttps://{process.env.NEXT_PUBLIC_BASE_URL}/product/
                  {props.product_id}
                </span>
                <span className="w-full flex justify-start gap-0 text-foreground pb-4">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faStore}
                  />
                  htttps://{process.env.NEXT_PUBLIC_BASE_URL}/store/
                  {props.store_name}
                </span>
                <span className="text-foreground pb-4">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faThumbsUp}
                  />
                  {props.like_count} like
                  {props.like_count > 1 ? 's' : ''}
                </span>
                <span className="text-foreground pb-4">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faBinoculars}
                  />
                  {props.view_count} view{props.view_count > 1 ? 's' : ''}
                </span>
                <span className="text-foreground pb-4">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faInfoCircle}
                  />
                  Created{' '}
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(timestamp)}
                </span>
                {/* <span className="text-foreground pb-8">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faGlobeAmericas}
                    />
                    {
                      country_list.filter(
                        (country) => country.value === props.location
                      )[0].name
                    }
                  </span> */}
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </p>
    </section>
  );
};
