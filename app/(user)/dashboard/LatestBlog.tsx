'use client';

import RichText from '@/components/sb-ui/RichText';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/contentful';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const LatestBlog = (props: {}) => {
  const [blog, setBlog] = React.useState<any | null>(null);

  React.useEffect(() => {
    const getLatest = async () => {
      const currentClient = client;

      // fetch data
      const data = await currentClient.getEntries({
        content_type: 'blogPost',
        order: '-sys.createdAt',
        limit: 1,
      });
      setBlog(data.items[0]);
    };
    getLatest();
  }, []);

  if (blog === null) {
    return <></>;
  }

  return (
    <section className="w-full flex flex-col justify-start items-start gap-8 p-8 bg-layer-one border rounded">
      <h3>SubBase News</h3>
      {blog.fields.banner && (
        <Image
          alt={blog.fields.title}
          src={`https:${blog.fields.banner.fields.file.url}`}
          width={blog.fields.banner.fields.file.details.image.width}
          height={blog.fields.banner.fields.file.details.image.height}
          className="flex w-full mb-[5px]"
        />
      )}

      <section className="w-full flex flex-col gap-2">
        <p>
          <b>{blog.fields.title}</b>
        </p>
        <p className="text-sm text-muted-foreground">
          <RichText content={blog.fields.body} summary />
        </p>
      </section>
      <Button
        variant="outline"
        className="bg-layer-one hover:bg-layer-two"
        asChild
      >
        <Link href={`/blog/${blog.fields.slug}`}>Read More</Link>
      </Button>
    </section>
  );
};
