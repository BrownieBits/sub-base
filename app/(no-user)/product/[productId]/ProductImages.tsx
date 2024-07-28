'use client';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React from 'react';

export default function ProductImages(props: { images: string[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [mainImage, setMainImage] = React.useState('');

  React.useEffect(() => {
    if (props.images.length >= 0) {
      setMainImage(props.images[0]);
    }
  }, [props.images]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (mainImage === '') {
    return <></>;
  }
  return (
    <section className="w-full flex-1">
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {props.images.map((image) => {
            return (
              <CarouselItem key={image}>
                <section
                  className="aspect-square flex justify-center items-center border bg-layer-one rounded overflow-hidden"
                  key={image}
                >
                  <Image
                    src={image}
                    alt="Product Image"
                    width="100"
                    height="100"
                    className="cursor-pointer"
                    onClick={() => setMainImage(image)}
                  />
                </section>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {props.images.length > 1 && (
          <div className="hidden md:flex justify-center items-center mt-4 gap-4 ">
            <Button
              variant="outline"
              asChild
              onClick={() => api && api.scrollPrev()}
            >
              <p>
                <FontAwesomeIcon className="icon" icon={faAngleLeft} />
              </p>
            </Button>
            {props.images.map((image, index) => (
              <section
                className={`cursor-pointer w-12 aspect-square flex justify-center items-center border bg-layer-one rounded overflow-hidden ${
                  index + 1 === current ? 'border-primary border-2' : ''
                }`}
                key={`sub-image-${index}`}
              >
                <Image
                  src={image}
                  alt="Product Image"
                  width="32"
                  height="32"
                  className="w-full"
                  onClick={() => api && api.scrollTo(index)}
                />
              </section>
            ))}
            <Button
              variant="outline"
              asChild
              onClick={() => api && api.scrollNext()}
            >
              <p>
                <FontAwesomeIcon className="icon" icon={faAngleRight} />
              </p>
            </Button>
          </div>
        )}
      </Carousel>
    </section>
  );
}
