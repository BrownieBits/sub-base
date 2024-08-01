'use client';
import { LikeButton } from '@/components/sb-ui/LikeButton';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { analytics } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { faFlag, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { logEvent } from 'firebase/analytics';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ProductImages from './ProductImages';
import { ShowDetails } from './ShowDetails';
import { options, variants } from './typedef';

const formSchema = z.object({
  quantity: z.union([
    z.coerce
      .number({
        message: 'Quantity must be a number',
      })
      .gt(0, {
        message: 'Quantity must be positive',
      }),
    z.literal(''),
  ]),
  options: z
    .array(
      z.object({
        option: z.string().optional(),
      })
    )
    .optional(),
});

type Props = {
  store_id: string;
  avatar: string | null;
  store_name: string;
  subscription_count: number;
  images: string[];
  product_name: string;
  product_type: string;
  price: number;
  compare_at: number;
  currency: string;
  product_id: string;
  product_description: string;
  like_count: number;
  options: options[];
  variants: variants[];
  created_at: Timestamp;
  view_count: number;
  track_inventory: boolean;
};

export default function ProductDetailPage(props: Props) {
  const [maxQunaitity, setMaxQunaitity] = React.useState<number>();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [price, setPrice] = React.useState<number>(0.0);
  const [compareAt, setCompareAt] = React.useState<number>(0.0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  logEvent(analytics, 'product_viewed', {
    product_id: props.product_id,
  });
  async function verifyOptions() {}

  async function onSubmit() {
    console.log('cool beans');
  }

  async function onOptionChange(event: string, index: number) {
    const newOptionsList = selectedOptions.slice(0);
    newOptionsList[index] = event;
    if (newOptionsList.includes('')) {
      setSelectedOptions(newOptionsList);
      return;
    }
    const selectedVariant = props.variants.filter((variant) => {
      if (variant.name == newOptionsList.join('-')) {
        return variant;
      }
      return;
    });
    if (selectedVariant.length > 0) {
      setPrice(selectedVariant[0].price);
      setCompareAt(selectedVariant[0].compare_at);
      setMaxQunaitity(selectedVariant[0].inventory);
      if (selectedVariant[0].inventory > 0) {
        form.setValue('quantity', 1);
      } else {
        form.setValue('quantity', 0);
      }
    }
    setSelectedOptions(newOptionsList);
  }

  React.useEffect(() => {
    if (props.price) {
      setPrice(props.price);
    }
    if (props.compare_at) {
      setCompareAt(props.compare_at);
    }
    if (props.product_type === 'Digital') {
      setMaxQunaitity(1);
      form.setValue('quantity', 1);
    }
    if (!props.track_inventory) {
      setMaxQunaitity(100);
      form.setValue('quantity', 1);
    }
    let newOptionList = selectedOptions.slice(0);
    newOptionList = props.options.map((option) => '');
    setSelectedOptions(newOptionList);
  }, []);

  return (
    <section className="flex flex-col gap-8 p-4 max-w-[1754px] mx-auto">
      <section key="productInfo" className="flex flex-col md:flex-row gap-8">
        <ProductImages images={props.images} />
        <section className="w-full md:w-[350px] xl:w-[400px] flex flex-col">
          <section className="flex justify-between">
            <section className="flex flex-col items-start gap-1">
              <h1 className="text-xl">{props.product_name}</h1>
              <Link
                href={`/store/${props.store_id}`}
                className="flex gap-4 items-center"
              >
                <p className="text-sm">
                  <b>{props.store_name}</b>{' '}
                  <span className="text-muted-foreground">&bull;</span>{' '}
                  <span className="text-muted-foreground">
                    {props.subscription_count} subscriber
                    {props.subscription_count > 1 ? 's' : ''}
                  </span>
                </p>
              </Link>
              <p className="text-sm text-muted-foreground">
                {props.product_type}
              </p>
            </section>
            <section className="flex flex-col items-end gap-1">
              {compareAt > 0 && price != compareAt ? (
                <>
                  <p className="text-destructive line-through">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: props.currency,
                    }).format(price)}
                  </p>
                  <p className="text-xl">
                    <b>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: props.currency,
                      }).format(compareAt)}
                    </b>
                  </p>
                </>
              ) : (
                <p className="font-bold text-xl">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: props.currency,
                  }).format(price)}
                </p>
              )}
            </section>
          </section>

          <section className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('flex flex-col w-full gap-4 pt-4', {
                  hidden: props.product_type === 'Digital',
                })}
              >
                {props.options.length > 0 && (
                  <section className="flex flex-row md:flex-col w-full gap-4">
                    {props.options.map((option, index) => {
                      return (
                        <div key={`option-${index}`} className="w-full">
                          <FormField
                            control={form.control}
                            name={`options.${index}.option`}
                            render={({ field }) => (
                              <FormItem className="w-full flex1">
                                <FormLabel>{option.name}</FormLabel>
                                <Select
                                  onValueChange={(event) =>
                                    onOptionChange(event, index)
                                  }
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={`Select a ${option.name}`}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {option.options.map((item) => {
                                      return (
                                        <SelectItem value={item} key={item}>
                                          {item}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    })}
                  </section>
                )}
                {maxQunaitity != null && (
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="quantity"
                            type="number"
                            max={maxQunaitity}
                            min={0}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>
          </section>

          {maxQunaitity == 0 ? (
            <Button variant="outline" className="mt-8">
              Sold Out
            </Button>
          ) : (
            <>
              {props.options.length == 0 ||
              (props.options.length > 0 && !selectedOptions.includes('')) ? (
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="mt-8"
                >
                  Add To Cart
                </Button>
              ) : (
                <Button variant="outline" className="mt-8">
                  Select Options
                </Button>
              )}
            </>
          )}

          <div className="flex gap-2 justify-between pt-8">
            <LikeButton
              product={props.product_id}
              like_count={props.like_count}
            />
            <Button variant="outline" asChild>
              <div>
                <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faShare} />
                Share
              </div>
            </Button>
            <Button variant="outline" className="text-foreground">
              <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faFlag} />
              Report
            </Button>
          </div>

          <ShowDetails
            text={props.product_description}
            howManyToShow={100}
            store_name={props.store_id}
            product_id={props.product_id}
            //add ships from
            created_at={props.created_at}
            view_count={props.view_count}
            like_count={props.like_count}
          />
        </section>
      </section>
    </section>
  );
}
