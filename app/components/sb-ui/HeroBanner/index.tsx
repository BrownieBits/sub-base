'use server';
import { client } from '@/lib/contentful';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import ContentfulImage from '../ConentfulImage';

export const HeroBanner = async (props: { page_slug: string }) => {
  const { isEnabled } = draftMode();
  // const currentClient = isEnabled ? previewClient : client;
  const currentClient = client;
  const data = await currentClient.getEntries({
    content_type: 'banners',
    'fields.slug': `${props.page_slug}`,
  });
  return (
    <>
      {data.items.length === 0 ? (
        <></>
      ) : (
        <div className="flex justify-center w-full pb-8 px-4">
          <Link
            href={data.items[0].fields.url}
            className="w-full rounded-lg overflow-hidden"
            style={{ maxWidth: data.items[0].fields.maxWidth }}
          >
            <ContentfulImage
              alt={data.items[0].fields.desktopBanner.fields.title}
              src={`https:${data.items[0].fields.desktopBanner.fields.file.url}`}
              width={
                data.items[0].fields.desktopBanner.fields.file.details.image
                  .width
              }
              height={
                data.items[0].fields.desktopBanner.fields.file.details.image
                  .height
              }
              mobSrc={`https:${data.items[0].fields.mobileBanner.fields.file.url}`}
              mobWidth={
                data.items[0].fields.mobileBanner.fields.file.details.image
                  .width
              }
              mobHeight={
                data.items[0].fields.mobileBanner.fields.file.details.image
                  .height
              }
              hasDesktop={data.items[0].fields.desktopBanner ? true : false}
              hasMobile={data.items[0].fields.mobileBanner ? true : false}
            />
          </Link>
        </div>
      )}
    </>
  );
};
