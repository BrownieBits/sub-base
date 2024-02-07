'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { DocumentData } from 'firebase/firestore';
import React from 'react';

const AvatarVariants = cva('text-white', {
  variants: {
    size: {
      default: 'h-[75px] w-[75px]',
      sm: 'h-[32px] w-[32px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export default function ShowAvatar(props: {
  data: DocumentData;
  size?: 'sm' | undefined;
}) {
  let css = 'text-white';
  console.log(props.size);
  if (props.size === undefined) {
    css += ' h-[75px] w-[75px]';
  } else {
    css += ' h-[32px] w-[32px]';
  }
  return (
    <Avatar className={css}>
      <AvatarImage src={props.data.logo!} alt={props.data.display_name!} />
      <AvatarFallback>
        {props.data.display_name?.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
