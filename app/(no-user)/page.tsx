import { ContentfulVideo } from '@/components/sb-ui/ContentfulVideo';
import { client } from '@/lib/contentful';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `SubBase Creator Platform`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
    openGraph: {
      type: 'website',
      url: `https://sub-base.vercel.app/`,
      title: `SubBase Creator Platform`,
      siteName: 'SubBase Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubBase',
      images: [],
      title: `SubBase Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubBase.',
      site: 'SubBase Creator Platform',
    },
  };
}

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
