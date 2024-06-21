import Head from 'next/head';
import { client } from '@/lib/contentful';
import { ContentfulVideo } from '@/components/amaze-ui/ContentfulVideo';
import { ContentfulImageTiles } from '@/components/amaze-ui/ContentfulImageTiles';

export default async function Home() {
  const data = await client.getEntries({
    content_type: 'page',
    'fields.title': 'Home Page',
  });
  const items = data.items[0].fields.pageItems;
  return (
    <main>
      {items.map((item: any, i: number) => {
        if (item.sys.contentType.sys.id === 'videoBlock') {
          return (
            <ContentfulVideo
              alt={item.title}
              src={`https:${item.fields.video.fields.file.url}`}
              maxWidth={item.fields.maxWidth}
              key={`contentful-video-${i}`}
            />
          );
        } else if (item.sys.contentType.sys.id === 'imageTiles') {
          return (
            <></>
            // <ContentfulImageTiles id={item.sys.id} key={`image-tiles-${i}`} />
          );
        }
        return <></>;
      })}
    </main>
  );
}
