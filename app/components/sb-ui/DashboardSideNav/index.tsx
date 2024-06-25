import Link from 'next/link';
import { client, previewClient } from '@/lib/contentful';
import { draftMode } from 'next/headers';
import { MenuItems } from './MenuItems';
import { Button } from '../../ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const DashboardSideNav = async ({ menu }: { menu: string }) => {
  const { isEnabled } = draftMode();
  // const currentClient = isEnabled ? previewClient : client;
  const currentClient = client;
  const data = await currentClient.getEntries({
    content_type: 'creatorMenu',
    'fields.title': menu,
  });
  const items = data.items[0]?.fields.menuBlocks;
  return (
    <ScrollArea className="flex flex-col h-full rounded-md">
      {items.map((item: any, i: number) => {
        return <MenuItems id={item.sys.id} key={`menu-item-${i}`} />;
      })}
      <section className={`flex flex-wrap items-center gap-x-[5px] p-[15px]`}>
        <Button
          asChild
          variant="link"
          className="text-xs text-foreground px-0 py-0 after:content-['|'] after:pl-[5px]"
        >
          <Link href="/sign-in" aria-label="Spring by Amaze">
            About
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className="text-xs text-foreground px-0 py-0 after:content-['|'] after:pl-[5px]"
        >
          <Link href="/sign-in" aria-label="Spring by Amaze">
            Press
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className="text-xs text-foreground px-0 py-0 after:content-['|'] after:pl-[5px]"
        >
          <Link href="/sign-in" aria-label="Spring by Amaze">
            Blog
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className="text-xs text-foreground px-0 py-0 after:content-['|'] after:pl-[5px]"
        >
          <Link href="/sign-in" aria-label="Spring by Amaze">
            Contact
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className="text-xs text-foreground px-0 py-0 after:content-['|'] after:pl-[5px]"
        >
          <Link href="/sign-in" aria-label="Spring by Amaze">
            Terms of Service
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className="text-xs text-foreground px-0 py-0"
        >
          <Link href="/sign-in" aria-label="Spring by Amaze">
            Privacy Policy
          </Link>
        </Button>
      </section>
    </ScrollArea>
  );
};
