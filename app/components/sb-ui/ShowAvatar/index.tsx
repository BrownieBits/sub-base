'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

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

export const ShowAvatar = (props: {
  name: string;
  url: string;
  size?: 'sm' | 'md' | 'lg' | undefined;
}) => {
  return (
    <Avatar
      className={cn('bg-foreground text-background', {
        'h-[45px] w-[45px] md:h-[75px] md:w-[75px]': props.size === undefined,
        'h-[75px] w-[75px] md:h-[100px] md:w-[100px]': props.size === 'lg',
        'h-[32px] w-[32px] md:h-[50px] md:w-[50px]': props.size === 'md',
        'h-[32px] w-[32px]': props.size === 'sm',
      })}
    >
      <AvatarImage src={props.url} alt={props.name} />
      <AvatarFallback>{props.name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
