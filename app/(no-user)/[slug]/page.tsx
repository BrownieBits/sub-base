import { client, previewClient } from '@/lib/contentful';
import { notFound, redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { draftMode } from 'next/headers';
import { ContentfulVideo } from '@/components/amaze-ui/ContentfulVideo';
import { ContentfulImageTiles } from '@/components/amaze-ui/ContentfulImageTiles';

type Props = {
  params: { id: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { isEnabled } = draftMode();
  const currentClient = isEnabled ? previewClient : client;

  // fetch data
  const data = await currentClient.getEntries({
    content_type: 'page',
    'fields.url': `/${params.slug}`,
  });

  const page = data.items[0]?.fields || 'Error';

  return {
    title: page.title,
  };
}

export default async function Recipe({ params }: { params: { slug: string } }) {
  const { isEnabled } = draftMode();
  const currentClient = isEnabled ? previewClient : client;
  const data = await currentClient.getEntries({
    content_type: 'page',
    'fields.url': `/${params.slug}`,
  });
  if (data.items.length === 0) {
    notFound();
  }
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
              key={i}
            />
          );
        } else if (item.sys.contentType.sys.id === 'imageTiles') {
          return <ContentfulImageTiles id={item.sys.id} key={i} />;
        }
        return <></>;
      })}
    </>
  );
}
