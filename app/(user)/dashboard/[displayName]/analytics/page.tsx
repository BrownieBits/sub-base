'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { subDays, addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

export default function Analytics({
  params,
}: {
  params: { displayName: string };
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const disabledDays = [
    { from: addDays(new Date(), 1), to: addDays(new Date(), 3650) },
  ];

  return (
    <section>
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
                <FontAwesomeIcon className="icon mr-[10px]" icon={faCalendar} />
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
    </section>
  );
}
