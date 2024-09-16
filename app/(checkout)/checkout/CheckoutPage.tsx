'use client';

import { Logo } from '@/components/sb-ui/Logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { db } from '@/lib/firebase';
import { Address, Item, Promotion, RemovedProduct } from '@/lib/types';
import { faCircle as faCircleRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faCircle,
  faCircleCheck,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import React from 'react';
import LoginForm from './LoginForm';
import RemovedItemsDialogue from './RemovedItemsDialogue';
import CheckoutSummary from './Summary';
import AddressForm from './address/AddressForm';
import EditAddress from './address/EditAddress';
import ShippingSelect from './shipping/ShippingForm';

type Items = {
  [key: string]: Item[];
};
type Promotions = {
  [key: string]: Promotion;
};
type Props = {
  items: Items;
  promotions: Promotions;
  removed_items: RemovedProduct[];
  address: Address | undefined;
  user_id?: string;
  cart_id: string;
  country: string;
  city: string;
  region: string;
  ip: string;
};

export default function CheckoutPage(props: Props) {
  const [itemsTotal, setItemsTotal] = React.useState<number>(0);
  const [serviceTotal, setServiceTotal] = React.useState<number>(0);
  const [cartTotal, setCartTotal] = React.useState<number>(0);
  const [discountsTotal, setDiscountsTotal] = React.useState<number>(0);
  const [shippingTotal, setShippingTotal] = React.useState<number>(0);
  const [taxesTotal, setTaxesTotal] = React.useState<number>(0);
  const [removedItems, setRemovedItems] = React.useState<RemovedProduct[]>([]);
  const [step, setStep] = React.useState<string>('address');
  const [userID, setUserID] = React.useState<string>('');
  const [address, setAddress] = React.useState<Address | null>(null);

  async function selectAddress(address: Address) {
    const cartDocRef: DocumentReference = doc(db, `carts`, props.cart_id);
    const cartDoc = await getDoc(cartDocRef);
    if (cartDoc.exists()) {
      await updateDoc(cartDocRef, {
        email: address.email,
        address: address,
        updated_at: Timestamp.fromDate(new Date()),
      });
    } else {
      await setDoc(cartDocRef, {
        email: address.email,
        address: address,
        created_at: Timestamp.fromDate(new Date()),
        updated_at: Timestamp.fromDate(new Date()),
      });
    }

    setAddress(address);
    setStep('shipping');
  }

  React.useEffect(() => {
    let item_total = 0;
    let service_total = 0;
    let discounts_total = 0;

    Object.keys(props.items).map((store) => {
      let store_total = 0;
      props.items[store].map((item) => {
        if (item.compare_at > 0 && item.compare_at < item.price) {
          store_total += parseFloat(item.compare_at.toString()) * item.quantity;
          item_total += parseFloat(item.compare_at.toString()) * item.quantity;
          service_total +=
            parseFloat(item.compare_at.toString()) *
            item.quantity *
            parseFloat(item.service_percent.toString());
        } else {
          store_total += parseFloat(item.price.toString()) * item.quantity;
          item_total += parseFloat(item.price.toString()) * item.quantity;
          service_total +=
            parseFloat(item.price.toString()) *
            item.quantity *
            parseFloat(item.service_percent.toString());
        }
      });
      if (props.promotions.hasOwnProperty(store)) {
        const expiration = props.promotions[store].expiration_date as Timestamp;
        let expiration_good = true;
        if (expiration !== null) {
          const expiration_date = new Date(expiration.seconds * 1000);
          const today = new Date();
          if (today.getTime() > expiration_date.getTime()) {
            expiration_good = false;
          }
        }
        let minimum_good = true;
        if (
          props.promotions[store].minimum_order_value > 0 &&
          props.promotions[store].minimum_order_value > store_total
        ) {
          minimum_good = false;
        }
        if (minimum_good && expiration_good) {
          if (props.promotions[store].type === 'Flat Amount') {
            discounts_total += props.promotions[store].amount;
          } else if (props.promotions[store].type === 'Percentage') {
            const discount_amount =
              store_total * (props.promotions[store].amount / 100);
            discounts_total += discount_amount;
          }
        }
      }
    });

    setDiscountsTotal(discounts_total);
    setItemsTotal(item_total);
    setServiceTotal(service_total);
    setCartTotal(item_total + service_total - discounts_total);
  }, [props.items, props.promotions]);
  React.useEffect(() => {
    setRemovedItems(props.removed_items);
  }, [props.removed_items]);
  React.useEffect(() => {
    if (props.user_id !== null && props.user_id !== undefined) {
      setUserID(props.user_id);
    }
  }, [props.user_id]);
  React.useEffect(() => {
    if (props.address !== null && props.address !== undefined) {
      setAddress(props.address);
      setStep('shipping');
    }
  }, [props.address]);

  return (
    <>
      <section className="mx-auto w-full max-w-[1200px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <section className="jusitfy-center flex flex-col items-center gap-2 md:flex-row md:justify-start">
            <section className="w-[40px] md:w-[120px]">
              <Logo url="/" />
            </section>
            <p className="md:text-md text-xs">Secure Checkout</p>
          </section>
          {userID !== '' && (
            <section className="flex w-[200px] items-center gap-2 md:w-[350px] xl:w-[400px]">
              <aside className="jusitify-center flex flex-col items-center gap-2">
                <>
                  {step !== 'address' && step !== 'edit_address' ? (
                    <p className="text-md text-success md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircleCheck} />
                    </p>
                  ) : (
                    <p className="text-md md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircle} />
                    </p>
                  )}
                </>
                <>
                  {step !== 'address' && step !== 'edit_address' ? (
                    <p className="text-xs text-success">Address</p>
                  ) : (
                    <p className="text-xs">Address</p>
                  )}
                </>
              </aside>
              <aside className="w-auto flex-1">
                <Separator />
              </aside>
              <aside className="jusitify-center flex flex-col items-center gap-2">
                <>
                  {(step === 'address' || step === 'edit_address') && (
                    <p className="text-md text-muted-foreground md:text-xl">
                      <FontAwesomeIcon
                        className="icon"
                        icon={faCircleRegular}
                      />
                    </p>
                  )}
                  {step === 'shipping' && (
                    <p className="text-md text-foreground md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircle} />
                    </p>
                  )}
                  {step === 'payment' && (
                    <p className="text-md text-success md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircleCheck} />
                    </p>
                  )}
                </>
                <>
                  {(step === 'address' || step === 'edit_address') && (
                    <p className="text-xs text-muted-foreground">Shipping</p>
                  )}
                  {step === 'shipping' && (
                    <p className="text-xs text-foreground">Shipping</p>
                  )}
                  {step === 'payment' && (
                    <p className="text-xs text-success">Shipping</p>
                  )}
                </>
              </aside>
              <aside className="w-auto flex-1">
                <Separator />
              </aside>
              <aside className="jusitify-center flex flex-col items-center gap-2">
                <>
                  {(step === 'address' ||
                    step === 'edit_address' ||
                    step === 'shipping') && (
                    <p className="text-md text-muted-foreground md:text-xl">
                      <FontAwesomeIcon
                        className="icon"
                        icon={faCircleRegular}
                      />
                    </p>
                  )}
                  {step === 'payment' && (
                    <p className="text-md text-foreground md:text-xl">
                      <FontAwesomeIcon className="icon" icon={faCircle} />
                    </p>
                  )}
                </>
                <>
                  {(step === 'address' || step === 'shipping') && (
                    <p className="text-xs text-muted-foreground">Payment</p>
                  )}
                  {step === 'payment' && (
                    <p className="text-xs text-foreground">Payment</p>
                  )}
                </>
              </aside>
            </section>
          )}
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[1200px]">
        <section className="flex w-full flex-col-reverse gap-4 px-4 py-4 md:flex-row">
          <aside className="flex w-full flex-1 flex-col gap-4">
            {userID !== '' && (
              <>
                {address === null && step !== 'edit_address' && (
                  <AddressForm user_id={userID} selectAddress={selectAddress} />
                )}
                {address !== null && step !== 'edit_address' && (
                  <section className="flex w-full flex-col gap-4 rounded border bg-layer-one p-4 drop-shadow">
                    <section className="flex items-start justify-between gap-4">
                      <h4>Shipping Address</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="outline"
                              onClick={() => setStep('edit_address')}
                            >
                              <p>
                                <FontAwesomeIcon
                                  className="icon"
                                  icon={faPencil}
                                />
                              </p>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </section>
                    <section className="flex flex-col gap-1">
                      <p>{address.email}</p>
                      <p>{address.name}</p>
                      <p>{address.address_line1}</p>
                      {address.address_line2 && <p>{address.address_line2}</p>}
                      <p>
                        {address.city_locality}, {address.state_province}{' '}
                        {address.postal_code}
                      </p>
                      {address.phone && <p>{address.phone}</p>}
                    </section>
                  </section>
                )}
                {step === 'edit_address' && (
                  <EditAddress
                    address={address!}
                    selectAddress={selectAddress}
                  />
                )}
                {address !== null && step === 'shipping' && (
                  <ShippingSelect items={props.items} ship_to={address} />
                )}
              </>
            )}
          </aside>
          <CheckoutSummary
            items={props.items}
            items_total={itemsTotal}
            discount_total={discountsTotal}
            shipping_total={shippingTotal}
            service_total={serviceTotal}
            taxes_total={taxesTotal}
            cart_total={cartTotal}
          />
        </section>
      </section>
      {userID === '' && (
        <LoginForm
          user_id={userID}
          country={props.country}
          city={props.city}
          region={props.region}
          ip={props.ip}
          setUserID={setUserID}
        />
      )}
      {userID !== '' && <RemovedItemsDialogue removedItems={removedItems} />}
    </>
  );
}
