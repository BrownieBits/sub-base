'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ProductImages(props: { images: string[] }) {
  const [mainImage, setMainImage] = React.useState('');

  React.useEffect;

  React.useEffect(() => {
    if (props.images.length >= 0) {
      setMainImage(props.images[0]);
    }
  }, [props.images]);

  if (mainImage === '') {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-[15px] w-full">
      <Image
        src={mainImage}
        alt="ProductImage"
        width="500"
        height="500"
        className="flex w-full rounded-lg overflow-hidden"
      />
      {props.images.length > 0 ? (
        <div className="flex justify-center items-center gap-[15px]">
          {props.images.map((image) => {
            return (
              <Image
                src={image}
                alt="ProductImage"
                width="100"
                height="100"
                className="w-[50px] md:w-[100px] rounded-lg overflow-hidden cursor-pointer"
                key={image}
                onClick={() => setMainImage(image)}
              />
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
