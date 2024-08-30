'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { analytics, db } from '@/lib/firebase';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  addDays,
  endOfMonth,
  endOfYear,
  format,
  isValid,
  parse,
  startOfMonth,
  startOfYear,
  subDays,
} from 'date-fns';

import { logEvent } from 'firebase/analytics';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { AnalyticsLoading } from './AnalyticsLoading';
import { DatePicker } from './DatePicker';
import { AOVChart } from './charts/AOVChart';
import { AbandonedCartsChart } from './charts/AbandonedCartChart';
import { CitiesReachedChart } from './charts/CitiesReachedChart';
import { ConversionRateChart } from './charts/ConversionRateChart';
import { ProductLikesChart } from './charts/ProductLikesChart';
import { ProductViewsChart } from './charts/ProductViewsChart';
import { StoreSubscriptionChart } from './charts/StoreSubscriptionsChart';
import { StoreViewsChart } from './charts/StoreViewsChart';
import { TopProductsChart } from './charts/TopProductChart';
import { TotalOrdersChart } from './charts/TotalOrdersChart';
import { TotalRevenueChart } from './charts/TotalRevenueChart';
import { Analytic } from './types';

type Props = {
  user_id: string;
  default_store: string;
};

export default function AnalyticsPage(props: Props) {
  const [selected, setSelected] = React.useState<string>('');
  const start_date = useSearchParams().get('start');
  const end_date = useSearchParams().get('end');
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Analytic[] | null>(null);

  async function changeDates(selectedRange: string) {
    const today = new Date();
    switch (selectedRange) {
      case 'today':
        setDate({ to: today, from: today });
        setSelected(`Today: ${format(today, 'LLL dd')}`);
        break;
      case 'yesterday':
        setDate({ to: subDays(today, 1), from: subDays(today, 1) });
        setSelected(`Yesterday: ${format(subDays(today, 1), 'LLL dd')}`);
        break;
      case 'last_7':
        setDate({ to: today, from: subDays(today, 7) });
        setSelected(
          `Last 7 Days: ${format(subDays(today, 7), 'LLL dd')}-${format(today, 'LLL dd')}`
        );
        break;
      case 'last_30':
        setDate({ to: today, from: subDays(today, 30) });
        setSelected(
          `Last 30 Days: ${format(subDays(today, 30), 'LLL dd')}-${format(today, 'LLL dd')}`
        );
        break;
      case 'this_month':
        setDate({ to: endOfMonth(today), from: startOfMonth(today) });
        setSelected(`This Month`);
        break;
      case 'this_year':
        setDate({ to: endOfYear(today), from: startOfYear(today) });
        setSelected(`This Year`);
        break;
      case 'last_year':
        setDate({
          to: endOfYear(subDays(today, 365)),
          from: startOfYear(subDays(today, 365)),
        });
        setSelected(`Last Year`);
        break;
      case 'all_time':
        setDate({ to: today, from: new Date('01/01/2024') });
        setSelected(`All Time`);
        break;
      default:
        break;
    }
  }

  async function setCustom(range: DateRange | undefined) {
    setDate({ to: range?.to, from: range?.from });
    setSelected(`Custom`);
    setOpen(false);
  }

  React.useEffect(() => {
    if (analytics !== null) {
      logEvent(analytics, 'page_view', {
        title: 'Analytics - SubBase Creator Platform',
      });
    }
    const today = new Date();
    let from = subDays(new Date(), 7);
    let to = today;

    if (start_date === null && end_date === null) {
      setSelected(
        `Last 7 Days: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
      );
      setDate({ from: from, to: to });
    } else {
      let parsed_start: Date | string | null = start_date;
      let parsed_end: Date | string | null = end_date;
      if (start_date !== null) {
        parsed_start = parse(start_date!, 'MM/dd/yyyy', new Date());
      }
      if (end_date !== null) {
        parsed_end = parse(end_date!, 'MM/dd/yyyy', new Date());
      }

      if (!isValid(parsed_start) && !isValid(parsed_end)) {
        setSelected(
          `Last 7 Days: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
        );
        setDate({ from: from, to: to });
      }
      if (isValid(parsed_start) && isValid(parsed_end)) {
        from = new Date(parsed_start!);
        to = new Date(parsed_end!);
        if (from > to) {
          from = subDays(to, 7);
        }
        setSelected(
          `Custom: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
        );
        setDate({ from: from, to: to });
      } else {
        if (isValid(parsed_start)) {
          from = new Date(parsed_start!);
          to = addDays(from, 7);
          setSelected(
            `Custom: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
          );
          setDate({ from: from, to: to });
        }
        if (isValid(parsed_end)) {
          to = new Date(parsed_end!);
          from = subDays(to, 7);
          setSelected(
            `Custom: ${format(from, 'LLL dd')}-${format(to, 'LLL dd')}`
          );
          setDate({ from: from, to: to });
        }
      }
    }
  }, []);
  React.useEffect(() => {
    const getItems = async () => {
      const itemsRef: CollectionReference = collection(
        db,
        'stores',
        props.default_store,
        'analytics'
      );
      const itemsQuery = query(
        itemsRef,
        where('created_at', '>=', Timestamp.fromDate(date?.from!)),
        where('created_at', '<', Timestamp.fromDate(date?.to!))
      );
      const itemsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(itemsQuery);

      const analyticsData: Analytic[] = itemsData.docs.map((doc) => {
        return {
          city: doc.data().city,
          country: doc.data().country,
          ip: doc.data().ip,
          options: doc.data().options,
          product_id: doc.data().product_id,
          quantity: doc.data().quantity,
          region: doc.data().region,
          type: doc.data().type,
          user_id: doc.data().user_id,
          store_id: doc.data().store_id,
          created_at: doc.data().created_at,
        };
      });
      analyticsData.slice(0);
      setData(analyticsData);
    };
    if (date?.from != undefined && date?.to !== undefined) {
      getItems();
    }
  }, [date]);

  if (selected === '' || date === undefined) {
    return (
      <>
        <section className="w-full max-w-[2428px] mx-auto">
          <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
            <h1>Analytics</h1>
          </section>
        </section>
        <Separator />
        <section className="w-full max-w-[2428px] mx-auto">
          <AnalyticsLoading />
        </section>
      </>
    );
  }

  return (
    <>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Analytics</h1>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" onClick={() => setOpen(true)}>
                {selected}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[250px]">
              <DropdownMenuItem asChild className="focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full hover:no-underline px-2 py-1"
                  onClick={() => changeDates('today')}
                >
                  <section className="w-full flex justify-between">
                    <p>Today</p>
                    {selected.includes('Today:') && (
                      <FontAwesomeIcon className="icon " icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className=" focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full hover:no-underline px-2 py-1"
                  onClick={() => changeDates('yesterday')}
                >
                  <section className="w-full flex justify-between">
                    <p>Yesterday</p>
                    {selected.includes('Yesterday:') && (
                      <FontAwesomeIcon className="icon " icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className=" focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full hover:no-underline px-2 py-1"
                  onClick={() => changeDates('last_7')}
                >
                  <section className="w-full flex justify-between">
                    <p>Last 7 Days</p>
                    {selected.includes('Last 7 Days:') && (
                      <FontAwesomeIcon className="icon " icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className=" focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full hover:no-underline px-2 py-1"
                  onClick={() => changeDates('last_30')}
                >
                  <section className="w-full flex justify-between">
                    <p>Last 30 Days</p>
                    {selected.includes('Last 30 Days:') && (
                      <FontAwesomeIcon className="icon " icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className=" focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full hover:no-underline px-2 py-1"
                  onClick={() => changeDates('this_month')}
                >
                  <section className="w-full flex justify-between">
                    <p>This Month</p>
                    {selected.includes('This Month') && (
                      <FontAwesomeIcon className="icon " icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className=" focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full hover:no-underline px-2 py-1"
                  onClick={() => changeDates('this_year')}
                >
                  <section className="w-full flex justify-between">
                    <p>This Year</p>
                    {selected.includes('This Year') && (
                      <FontAwesomeIcon className="icon " icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className=" focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full hover:no-underline px-2 py-1"
                  onClick={() => changeDates('last_year')}
                >
                  <section className="w-full flex justify-between">
                    <p>Last Year</p>
                    {selected.includes('Last Year') && (
                      <FontAwesomeIcon className="icon " icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className=" focus:bg-layer-two">
                <Button
                  variant="link"
                  className="w-full hover:no-underline px-2 py-1"
                  onClick={() => changeDates('all_time')}
                >
                  <section className="w-full flex justify-between">
                    <p>All Time</p>
                    {selected.includes('All Time') && (
                      <FontAwesomeIcon className="icon " icon={faCheck} />
                    )}
                  </section>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className=" focus:bg-layer-two">
                <DatePicker
                  selected={selected}
                  dates={date}
                  setDates={setCustom}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] flex flex-col gap-8 mx-auto px-4 py-8">
        {data === null || data === undefined ? (
          <AnalyticsLoading />
        ) : (
          <>
            <section className="w-full flex gap-8">
              <TotalOrdersChart data={data} to={date?.to!} from={date?.from!} />
              <TotalRevenueChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
            </section>
            <section className="w-full flex gap-8">
              <ConversionRateChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
              <AOVChart data={data} to={date?.to!} from={date?.from!} />
              <AbandonedCartsChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
            </section>
            <section className="w-full flex gap-8">
              <CitiesReachedChart data={data} />

              <StoreViewsChart data={data} to={date?.to!} from={date?.from!} />

              <StoreSubscriptionChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
            </section>
            <section className="w-full flex gap-8">
              <ProductViewsChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />

              <ProductLikesChart
                data={data}
                to={date?.to!}
                from={date?.from!}
              />
              <TopProductsChart data={data} to={date?.to!} from={date?.from!} />
            </section>
          </>
        )}
      </section>
    </>
  );
}
