import { HeroBanner } from '@/components/sb-ui/HeroBanner';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Analytics`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/analytics/`,
      title: `Analytics`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      title: `Analytics`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubBase Creator Platform',
    },
  };
}

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
