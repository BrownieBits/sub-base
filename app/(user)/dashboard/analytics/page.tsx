'use client';

import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addDays, format, subDays } from 'date-fns';
import React from 'react';
import { DateRange } from 'react-day-picker';

// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: `Settings - SubBase Creator Platform`,
//     description:
//       'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
//     openGraph: {
//       type: 'website',
//       url: `https://sub-base.vercel.app/dashboard/settings/`,
//       title: `Settings - SubBase Creator Platform`,
//       siteName: 'SubBase Creator Platform',
//       description:
//         'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
//       images: [],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       creator: 'SubBase',
//       images: [],
//       title: `Settings - SubBase Creator Platform`,
//       description:
//         'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
//       site: 'SubBase Creator Platform',
//     },
//   };
// }

export default function Analytics() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const disabledDays = [
    { from: addDays(new Date(), 1), to: addDays(new Date(), 3650) },
  ];

  return (
    <section>
      <section className="w-full max-w-[3096px] mx-auto">
        <section className="flex w-full justify-between items-center px-[15px] py-[30px] gap-[15px]">
          <h1>Analytics</h1>
          <div className={cn('grid gap-2')}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <FontAwesomeIcon
                    className="icon mr-[10px]"
                    icon={faCalendar}
                  />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, yy')}-{''}
                        {format(date.to, 'LLL dd, yy')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, yy')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  disabled={disabledDays}
                />
              </PopoverContent>
            </Popover>
          </div>
        </section>
        <HeroBanner page_slug="creator-analytics" />
      </section>
      <Separator />
      <section className="w-full max-w-[3096px] mx-auto"></section>
    </section>
  );
}
