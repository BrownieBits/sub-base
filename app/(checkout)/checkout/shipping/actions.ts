'use server';

import { Address, Rate, ShippingCarrier } from '@/lib/types';

export async function getSelfShipping(
  ship_to: Address,
  ship_from: Address,
  carriers: ShippingCarrier[]
) {
  'use server';
  const carrier_ids = carriers.map((carrier) => {
    return carrier.carrier_id;
  });
  const result = await fetch('https://api.shipengine.com/v1/rates/estimate', {
    body: JSON.stringify({
      carrier_ids: carrier_ids,

      from_country_code: ship_from.country_code,
      from_postal_code: ship_from.postal_code,
      from_city_locality: ship_from.city_locality,
      from_state_province: ship_from.state_province,

      to_country_code: ship_to.country_code,
      to_postal_code: ship_to.postal_code,
      to_city_locality: ship_to.city_locality,
      to_state_province: ship_to.state_province,

      weight: {
        value: 0,
        unit: 'pound',
      },
      dimensions: {
        unit: 'inch',
        length: 0,
        width: 0,
        height: 0,
      },
      confirmation: 'none',
      address_residential_indicator: ship_to.address_residential_indicator,
      ship_date: new Date(),
    }),
    headers: {
      'API-Key': process.env.USPS_API_KEY!,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  const resultJSON = await result.json();
  console.log(resultJSON);
  const rates: Rate[] = resultJSON.map((rate: any) => {
    if (rate.shipping_amount !== null) {
      return {
        carrier_name: rate.carrier_friendly_name,
        carrier_id: rate.carrier_id,
        delivery_days: rate.delivery_days,
        estimated_delivery_date: new Date(rate.estimated_delivery_date),
        rate:
          parseFloat(rate.confirmation_amount.amount) +
          parseFloat(rate.insurance_amount.amount) +
          parseFloat(rate.requested_comparison_amount.amount) +
          parseFloat(rate.shipping_amount.amount),
        service_code: rate.service_code,
        service_type: rate.service_type,
      };
    }
  });
  return rates;
}

export async function getCarriers() {
  'use server';
  const result = await fetch('https://api.shipengine.com/v1/carriers', {
    headers: {
      'API-Key': process.env.USPS_API_KEY!,
      'Content-Type': 'application/json',
    },
  });
  const resultJSON = await result.json();
  return resultJSON;
}
