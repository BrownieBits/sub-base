import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function Analytics() {
  // const [date, setDate] = React.useState<DateRange | undefined>({
  //   from: subDays(new Date(), 7),
  //   to: new Date(),
  // });
  // const disabledDays = [
  //   { from: addDays(new Date(), 1), to: addDays(new Date(), 3650) },
  // ];

  return (
    <section>
      <section className="w-full max-w-[2428px] mx-auto">
        <section className="flex w-full justify-between items-center px-4 py-4 gap-4">
          <h1>Analytics</h1>
          <div className={cn('grid gap-2')}>
            {/* <Popover>
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
            </Popover> */}
          </div>
        </section>
        <HeroBanner page_slug="creator-analytics" />
      </section>
      <Separator />
      <section className="w-full max-w-[2428px] mx-auto"></section>
    </section>
  );
}
