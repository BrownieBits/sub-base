import { client } from '@/lib/contentful';
import { ContentfulVideo } from '@/components/amaze-ui/ContentfulVideo';
import { ContentfulImageTiles } from '@/components/amaze-ui/ContentfulImageTiles';
import Link from 'next/link';
import ContentfulImage from '@/components/amaze-ui/ConentfulImage';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dashboard',
  };
}

export default async function Overview() {
  const data = await client.getEntries({
    content_type: 'page',
    'fields.title': 'Dashboard Overview',
  });
  const items = data.items[0]?.fields.pageItems;
  return (
    <>
      {items.map((item: any, i: number) => {
        if (item.sys.contentType.sys.id === 'videoBlock') {
          return (
            <ContentfulVideo
              alt={item.title}
              src={`https:${item.fields.video.fields.file.url}`}
              maxWidth={item.fields.maxWidth}
              key={item.sys.id}
            />
          );
        } else if (item.sys.contentType.sys.id === 'imageTiles') {
          return <ContentfulImageTiles id={item.sys.id} key={item.sys.id} />;
        } else if (item.sys.contentType.sys.id === 'heroBanner') {
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
