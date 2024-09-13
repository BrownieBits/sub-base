'use client';

import { db } from '@/lib/firebase';
import { Address, Item, Shipments, ShippingCarrier } from '@/lib/types';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import React from 'react';
import DigitalShipment from './DigitalShipments';
import PrintfulShipment from './PrintfulShipments';
import SelfShipment from './SelfShipments';
import { getCarriers } from './actions';

type Items = {
  [key: string]: Item[];
};

type Props = {
  ship_to: Address;
  items: Items;
};

export default function ShippingSelect(props: Props) {
  const [shipments, setShipments] = React.useState<Shipments | null>(null);
  const [carriers, setCarriers] = React.useState<ShippingCarrier[]>([]);

  async function createShipments() {
    const ships: Shipments = {};

    Object.keys(props.items).map(async (item) => {
      props.items[item].map(async (product) => {
        if (product.vendor === 'digital') {
          if (ships.hasOwnProperty('digital')) {
            ships['digital'].items.push(product);
          } else {
            ships['digital'] = {
              items: [product],
              ship_from: null,
              ship_to: props.ship_to.email!,
            };
          }
        } else if (product.vendor === 'self') {
          if (ships.hasOwnProperty(product.ship_from!)) {
            ships[product.ship_from!].items.push(product);
          } else {
            ships[product.ship_from!] = {
              items: [product],
              ship_from: null,
              ship_to: props.ship_to,
            };
          }
        }
      });
    });

    let needCarriers: boolean = false;
    await Promise.all(
      Object.keys(ships).map(async (item) => {
        if (item !== 'digital' && item !== 'printful') {
          const addressRef: DocumentReference = doc(db, 'addresses', item);
          const addressDoc: DocumentData = await getDoc(addressRef);
          ships[item].ship_from = {
            id: addressDoc.id,
            address_line1: addressDoc.data().address_line1,
            address_line2: addressDoc.data().address_line2,
            address_line3: addressDoc.data().address_line3,
            address_residential_indicator:
              addressDoc.data().address_residential_indicator,
            city_locality: addressDoc.data().city_locality,
            company_name: addressDoc.data().company_name,
            country_code: addressDoc.data().country_code,
            email: addressDoc.data().email,
            name: addressDoc.data().name,
            phone: addressDoc.data().phone,
            postal_code: addressDoc.data().postal_code,
            state_province: addressDoc.data().state_province,
          };
          needCarriers = true;
        }
      })
    );

    if (needCarriers) {
      const response = await getCarriers();
      const carriers: ShippingCarrier[] = response.carriers.map(
        (carrier: any) => {
          return {
            name: carrier.nickname,
            carrier_id: carrier.carrier_id,
          };
        }
      );
      setCarriers(carriers);
    }
    setShipments(ships);
  }

  React.useEffect(() => {
    if (
      props.items !== null &&
      Object.keys(props.items).length > 0 &&
      props.ship_to !== null
    ) {
      createShipments();
    }
  }, [props.items, props.ship_to]);

  /*
    bring in ship to address...

    bring in items... 

    cycle through items and put them into shipments.
        all digital downloads together... those are free.
        group all self sold items by ship from address.
        group all printful together
  */
  if (shipments === null) {
    return (
      <section className="w-full flex flex-col gap-4 border rounded bg-layer-one drop-shadow p-8">
        <h3>Shipping</h3>
        <p>
          <FontAwesomeIcon className="icon" icon={faSpinner} spin /> Loading
          Shipping Prices
        </p>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col gap-4 border rounded bg-layer-one drop-shadow p-8">
      <h3>Shipping</h3>
      {shipments.hasOwnProperty('digital') && (
        <>
          <DigitalShipment items={shipments['digital']} />
        </>
      )}
      {shipments.hasOwnProperty('printful') && (
        <>
          <PrintfulShipment items={shipments['printful']} />
        </>
      )}
      {Object.keys(shipments).map((shipment) => {
        if (shipment === 'digital' || shipment === 'printful') {
          return <></>;
        } else {
          return (
            <SelfShipment
              items={shipments[shipment]}
              key={`shipment-${shipment}`}
              carriers={carriers}
            />
          );
        }
      })}
    </section>
  );
}
