'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { DocumentData } from 'firebase/firestore';
import React from 'react';

const AvatarVariants = cva('text-foreground', {
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
  name: string;
  url: string;
  size?: 'sm' | undefined;
}) {
  let css = 'bg-foreground text-background';
  if (props.size === undefined) {
    css += ' h-[45px] w-[45px] md:h-[75px] md:w-[75px]';
  } else {
    css += ' h-[32px] w-[32px]';
  }
  return (
    <Avatar className={css}>
      <AvatarImage src={props.url} alt={props.name} />
      <AvatarFallback>{props.name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
