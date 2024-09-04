export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-y-auto overflow-x-hidden">
      <main className="flex min-h-svh w-full">
        <section className="w-full flex">{children}</section>
      </main>
    </section>
  );
}
