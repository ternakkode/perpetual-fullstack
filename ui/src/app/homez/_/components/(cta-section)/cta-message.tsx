import Link from "next/link";

import { Button } from "../_/button";

export const CtaMessage = () => {
  return (
    <article className="absolute z-[1] inset-0 flex flex-col items-center justify-center gap-8 md:gap-10 px-4 md:px-0">
      <section className="flex flex-col items-center justify-center gap-5 px-6 md:px-0">
        <header className="flex flex-col items-center justify-center gap-3">
          <h1 className="font-extrabold text-h4 md:text-h1 text-center">
            PAIR TRADING <br /> DONE RIGHT
          </h1>
          <p className="text-md md:text-xl text-center text-white-72">
            Trade Crypto Pairs Instantly, <br /> Without Limits
          </p>
        </header>
      </section>
      <Button
        asChild
        className="w-full md:w-auto py-3 px-6 text-lg"
        variant="light"
      >
        <Link href="/exchange">Start Trading</Link>
      </Button>
    </article>
  );
};
