'use server';
import { client } from '@/lib/contentful';
import Link from 'next/link';
import ContentfulImage from '../ConentfulImage';

export const ContentfulImageTiles = async (props: any) => {
  const data = await client.getEntry(props.id);
  return (
    <div
      className="flex items-center justify-center mx-auto my-0 py-0 px-4"
      style={{ maxWidth: data.fields.maxWidth }}
    >
      <div id={data.fields.slug}>
        <h1 className="py-8">{data.fields.title}</h1>
        <div className="columns-2 md:columns-3 gap-4">
          {data.fields.images.map((image: any, i: number) => (
            <Link
              href={image.fields.url}
              className="flex flex-col mb-8 break-inside-avoid"
              key={i}
            >
              <ContentfulImage
                alt={image.fields.title}
                src={`https:${image.fields.image.fields.file.url}`}
                width={image.fields.image.fields.file.details.image.width}
                height={image.fields.image.fields.file.details.image.height}
                className="flex w-full mb-[5px]"
              />
              <div>{image.fields.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
