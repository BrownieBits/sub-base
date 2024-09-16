export default async function NoUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-y-auto overflow-x-hidden">
      <main className="width-full flex min-h-svh">
        <section className="flex flex-1 p-8">{children}</section>
      </main>
    </section>
  );
}
