'use client';

import { Button } from '@/components/ui/button';
import { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import Image from 'next/image';
import React from 'react';

type Props = {
  index: number;
  image: ProductImage;
  draggableSnapshot: DraggableStateSnapshot;
  draggableProvided: DraggableProvided;
  removeProductImage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
};

export default function DraggableImage(props: Props) {
  return (
    <section
      className={cn(
        'aspect-square cursor-pointer border rounded overflow-hidden relative group',
        {
          'bg-layer-two': !props.draggableSnapshot.isDragging,
          'bg-layer-three left-auto top-auto':
            props.draggableSnapshot.isDragging,
        }
      )}
      {...props.draggableProvided.draggableProps}
      {...props.draggableProvided.dragHandleProps}
      ref={props.draggableProvided.innerRef}
    >
      <Button
        variant="destructive"
        size="sm"
        onClick={(e) => {
          props.removeProductImage(e, props.index);
        }}
        className="absolute top-0 right-0 hidden group-hover:block"
      >
        <p>
          <FontAwesomeIcon className="icon" icon={faTrash} />
        </p>
      </Button>

      <section className="h-full flex items-center">
        <Image
          src={props.image.image}
          alt={props.image.id.toString()}
          width={300}
          height={300}
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </section>
    </section>
  );
}
