'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  format,
} from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Analytic, ChartData, ChartJSON } from '../types';
import { buildDaily, buildHourly, buildMonthly, buildYearly } from './actions';

const chartConfig = {
  data: {
    label: 'Revenue',
    color: 'hsl(var(--primary))',
  },
  label: {
    color: 'hsl(var(--primary-foreground))',
  },
} satisfies ChartConfig;

export const TotalRevenueChart = (props: {
  data: Analytic[];
  from: Date;
  to: Date;
}) => {
  const [revenue, setRevenue] = React.useState<ChartData[] | undefined>(
    undefined
  );
  console.log(props.from, props.to);
  React.useEffect(() => {
    const diffInDays = differenceInCalendarDays(props.to, props.from);
    const diffInMonths = differenceInCalendarMonths(props.to, props.from);
    const diffInYears = differenceInCalendarYears(props.to, props.from);

    let revenueJSON: ChartJSON = buildHourly();

    let dataType = 'hourly';
    if (diffInMonths < 1) {
      revenueJSON = buildDaily(diffInDays + 1, props.from);
      dataType = 'daily';
    } else if (diffInMonths <= 12) {
      revenueJSON = buildMonthly(diffInMonths + 1, props.from);
      dataType = 'monthly';
    } else if (diffInMonths > 12) {
      revenueJSON = buildYearly(diffInYears + 1, props.from);
      dataType = 'yearly';
    }

    props.data.map((doc) => {
      const createdAt = doc.created_at as Timestamp;
      const docDate = new Date(createdAt.seconds * 1000);
      let formattedDate = format(docDate, 'h:00 aaa');
      if (dataType === 'daily') {
        formattedDate = format(docDate, 'LLL dd');
      } else if (dataType === 'monthly') {
        formattedDate = format(docDate, 'LLL');
      } else if (dataType === 'yearly') {
        formattedDate = format(docDate, 'yyyy');
      }
      const city = doc.city;
      const country = doc.country;
      const ip = doc.ip;
      const options = doc.options;
      const product_id = doc.product_id;
      const quantity = doc.quantity;
      const region = doc.region;
      const type = doc.type;
    });

    const revenueData: ChartData[] = [];

    Object.keys(revenueJSON).map((key) => {
      revenueData.push({
        date: key,
        data: revenueJSON[key].length,
      });
    });
    setRevenue(revenueData);
  }, [props.data]);
  if (revenue === undefined) {
    return (
      <Skeleton className="flex-1 min-h-[258px] bg-layer-one border rounded" />
    );
  }
  return (
    <section className="flex-1 flex flex-col gap-4 p-4 bg-layer-one rounded border">
      <p>
        <b>Total Revenue</b>
      </p>
      {revenue.length > 0 ? (
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={revenue}
            margin={{
              left: -10,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
              tickFormatter={(value) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(value);
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="data"
              type="natural"
              fill="var(--color-data)"
              fillOpacity={1.0}
              stroke="var(--color-data)"
            />
          </AreaChart>
        </ChartContainer>
      ) : (
        <section className="flex justify-center items-center w-full h-full min-h-[200px]">
          <p>There was no data found for this date range.</p>
        </section>
      )}
    </section>
  );
};
