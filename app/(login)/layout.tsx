import { client } from '@/lib/contentful';
import { draftMode } from 'next/headers';

export default async function NoUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = draftMode();
  // const currentClient = isEnabled ? previewClient : client;
  const currentClient = client;
  const data = await currentClient.getEntries({
    content_type: 'banners',
    'fields.slug': `login-banner`,
  });
  return (
    <section className="overflow-y-auto overflow-x-hidden">
      <main className="flex min-h-svh width-full">
        {data.items.length === 0 ? (
          <section className="flex-1 bg-primary p-8 hidden md:flex"></section>
        ) : (
          <section
            className="flex-1 bg-primary p-8 hidden md:flex bg-cover bg-center"
            style={{
              backgroundImage: `url('https:${data.items[0].fields.desktop.fields.file.url}')`,
            }}
          ></section>
        )}
        <section className="flex flex-1 p-8">{children}</section>
      </main>
    </section>
  );
}
