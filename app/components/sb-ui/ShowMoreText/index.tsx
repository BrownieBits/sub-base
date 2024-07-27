'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const ShowMoreText = (props: {
  text: string;
  howManyToShow: number;
}) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <p className="pt-[5px] text-sm">
      {showMore || props.text.length < props.howManyToShow
        ? props.text
        : `${props.text.substring(0, props.howManyToShow)}...`}
      {props.text.length < props.howManyToShow ? (
        <></>
      ) : (
        <Button
          variant="link"
          className="text-muted-foreground p-[0] px-4 h-auto"
          onClick={() => setShowMore(!showMore)}
          asChild
        >
          <span>{showMore ? 'Show Less' : `Show More`}</span>
        </Button>
      )}
    </p>
  );
};
