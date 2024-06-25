import { client, previewClient } from '@/lib/contentful';
import { redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { draftMode } from 'next/headers';
import { ContentfulVideo } from '@/components/sb-ui/ContentfulVideo';
import { ContentfulImageTiles } from '@/components/sb-ui/ContentfulImageTiles';
import ContentfulImage from '@/components/sb-ui/ConentfulImage';
import Link from 'next/link';

type Props = {
  params: { id: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { isEnabled } = draftMode();
  // const currentClient = isEnabled ? previewClient : client;
  const currentClient = client;

  // fetch data
  const data = await currentClient.getEntries({
    content_type: 'page',
    'fields.url': `/dashboard/${params.slug}`,
  });

  const page = data.items[0]?.fields || 'Error';

  return {
    title: page.title,
  };
}

export default async function BasePage({ params }: Props) {
  const { isEnabled } = draftMode();
  // const currentClient = isEnabled ? previewClient : client;
  const currentClient = client;
  const data = await currentClient.getEntries({
    content_type: 'page',
    'fields.url': `/dashboard/${params.slug}`,
  });
  if (data.items.length === 0) {
    redirect(`/dashboard`);
  }
  const items = data.items[0]?.fields.pageItems;
  return (
    <>
      {items.map((item: any, i: number) => {
        if (item.sys.contentType?.sys.id === 'videoBlock') {
          return (
            <ContentfulVideo
              alt={item.title}
              src={`https:${item.fields.video.fields.file.url}`}
              maxWidth={item.fields.maxWidth}
              key={item.sys.id}
            />
          );
        } else if (item.sys.contentType?.sys.id === 'imageTiles') {
          return <></>;
          // return <ContentfulImageTiles id={item.sys.id} key={item.sys.id} />;
        } else if (item.sys.contentType?.sys.id === 'heroBanner') {
          return (
            <Link
              href={item.fields.url}
              className="heroBanner"
              style={{ maxWidth: item.fields.maxWidth }}
              key={item.sys.id}
            >
              <ContentfulImage
                alt={item.fields.desktopBanner.fields.title}
                src={`https:${item.fields.desktopBanner.fields.file.url}`}
                width={
                  item.fields.desktopBanner.fields.file.details.image.width
                }
                height={
                  item.fields.desktopBanner.fields.file.details.image.height
                }
                mobSrc={`https:${item.fields.mobileBanner.fields.file.url}`}
                mobWidth={
                  item.fields.mobileBanner.fields.file.details.image.width
                }
                mobHeight={
                  item.fields.mobileBanner.fields.file.details.image.height
                }
                hasDesktop={item.fields.desktopBanner ? true : false}
                hasMobile={item.fields.mobileBanner ? true : false}
              />
            </Link>
          );
        }
        return <></>;
      })}
    </>
  );
}
