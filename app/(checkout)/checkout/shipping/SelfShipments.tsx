'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Address, Rate, Shipment, ShippingCarrier } from '@/lib/types';
import Image from 'next/image';
import React from 'react';
import { getSelfShipping } from './actions';

type Props = {
  items: Shipment;
  carriers: ShippingCarrier[];
};

export default function SelfShipment(props: Props) {
  async function getRates() {
    const rates: Rate[] = await getSelfShipping(
      props.items.ship_to as Address,
      props.items.ship_from as Address,
      props.carriers
    );
    // console.log(rates);
  }
  React.useEffect(() => {
    if (props.carriers.length > 0) {
      getRates();
    }
  }, [props.items, props.carriers]);

  return (
    <section className="w-full flex flex-col gap-4">
      <p>
        <b>Package Delivery</b>
      </p>
      <RadioGroup defaultValue="email">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="email" id="email" />
          <Label htmlFor="email">
            Deliver to <b>Shipping Address</b>
          </Label>
        </div>
      </RadioGroup>

      {props.items.items.map((item) => {
        return (
          <section
            className="w-full flex items-center gap-4"
            key={`shipping-item-${item.name}${item.options.join('')}`}
          >
            {item.images.length > 0 && (
              <section className="aspect-square w-[50px] flex justify-center items-center bg-layer-one border rounded overflow-hidden group">
                <Image
                  src={item.images[0]}
                  width="50"
                  height="50"
                  alt={item.name}
                  className="flex w-full"
                />
              </section>
            )}
            <section className="w-full flex-1 flex flex-col">
              <p className="text-sm">
                <b>{item.name}</b>
              </p>
              <p className="text-xs text-muted-foreground">
                {item.options.join(', ')} x {item.quantity}
              </p>
            </section>
          </section>
        );
      })}
    </section>
  );
}
