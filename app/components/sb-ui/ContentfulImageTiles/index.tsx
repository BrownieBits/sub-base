'use server';
import { client } from '@/lib/contentful';
import Link from 'next/link';
import ContentfulImage from '../ConentfulImage';

export const ContentfulImageTiles = async (props: any) => {
  const data = await client.getEntry(props.id);
  return (
    <div
      className="mx-auto my-0 flex items-center justify-center px-4 py-0"
      style={{ maxWidth: data.fields.maxWidth }}
    >
      <div id={data.fields.slug}>
        <h1 className="py-8">{data.fields.title}</h1>
        <div className="columns-2 gap-4 md:columns-3">
          {data.fields.images.map((image: any, i: number) => (
            <Link
              href={image.fields.url}
              className="mb-8 flex break-inside-avoid flex-col"
              key={i}
            >
              <ContentfulImage
                alt={image.fields.title}
                src={`https:${image.fields.image.fields.file.url}`}
                width={image.fields.image.fields.file.details.image.width}
                height={image.fields.image.fields.file.details.image.height}
                className="mb-[5px] flex w-full"
              />
              <div>{image.fields.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
