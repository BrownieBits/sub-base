import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetClose } from '@/components/ui/sheet';
import { client } from '@/lib/contentful';
import { cn } from '@/lib/utils';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { MenuItems } from './MenuItems';

const subMenu = [
  {
    name: 'About',
    link: '/about',
  },
  {
    name: 'Press',
    link: '/press',
  },
  {
    name: 'Blog',
    link: '/blog',
  },
  {
    name: 'Contact',
    link: '/contact',
  },
  {
    name: 'Terms of Service',
    link: '/terms-of-service',
  },
  {
    name: 'Privacy Policy',
    link: '/privacy-policy',
  },
];
export const DashboardSideNav = async ({
  menu,
  inSheet,
}: {
  menu: string;
  inSheet: boolean;
}) => {
  const { isEnabled } = draftMode();
  // const currentClient = isEnabled ? previewClient : client;
  const currentClient = client;
  const data = await currentClient.getEntries({
    content_type: 'creatorMenu',
    'fields.title': menu,
  });
  const items = data.items[0]?.fields.menuBlocks;
  return (
    <ScrollArea className="flex h-full flex-col rounded-md">
      {items.map((item: any, i: number) => {
        return (
          <MenuItems
            id={item.sys.id}
            inSheet={inSheet}
            key={`menu-item-${i}`}
          />
        );
      })}
      <section className={`flex flex-wrap items-center gap-x-2 gap-y-4 p-4`}>
        {subMenu.map((link, index) => {
          if (inSheet) {
            return (
              <SheetClose asChild key={link.name}>
                <Link
                  href={link.link}
                  className={cn(
                    'px-0 py-0 text-xs text-foreground',
                    index !== subMenu.length - 1 &&
                      "after:pl-2 after:content-['|']"
                  )}
                  aria-label={link.name}
                >
                  {link.name}
                </Link>
              </SheetClose>
            );
          }
          return (
            <Link
              href={link.link}
              className={cn(
                'px-0 py-0 text-xs text-foreground',
                index !== subMenu.length - 1 && "after:pl-2 after:content-['|']"
              )}
              aria-label={link.name}
              key={link.name}
            >
              {link.name}
            </Link>
          );
        })}
      </section>
    </ScrollArea>
  );
};
