import Link from 'next/link';
import { Button } from '../../ui/button';

export const NoPromotions = () => {
  return (
    <section className="flex flex-col w-full justify-start items-center p-[30px]">
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        className="fill-primary mb-[30px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M118.75 6.25L110.875 23.4375L93.75 31.25L110.875 39.125L118.75 56.25L126.562 39.125L143.75 31.25L126.562 23.4375M56.25 25L40.625 59.375L6.25 75L40.625 90.625L56.25 125L71.875 90.625L106.25 75L71.875 59.375M118.75 93.75L110.875 110.875L93.75 118.75L110.875 126.562L118.75 143.75L126.562 126.562L143.75 118.75L126.562 110.875" />
      </svg>
      <h3 className="mb-[15px]">
        Create your first promotion and sell to the world!
      </h3>
      <p className="mb-[30px]">
        Simple copy about creating promotions and making money
      </p>
      <Button asChild variant="outline">
        <Link href="/dashboard/promotions/new" aria-label="Create Promotion">
          <i className="mr-2 h-4 w-4 fa-solid fa-circle-plus text-primary"></i>
          Create Promotion
        </Link>
      </Button>
    </section>
  );
};
