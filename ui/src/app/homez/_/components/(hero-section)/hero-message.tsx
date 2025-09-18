import Link from "next/link";

import { Button } from "../_/button";
import { TextGradient } from "../_/text-gradient";

export const HeroMessage = () => {
  return (
    <article className="container mx-auto flex flex-col items-center justify-center gap-8 md:gap-10 px-4 md:px-0">
      <section className="flex flex-col items-center justify-center gap-5 px-6 md:px-0">
        <NumberOneTradingPlatformBadge />
        <header className="flex flex-col items-center justify-center gap-3">
          <h1 className="font-extrabold text-h4 md:text-h1 text-center">
            PAIR TRADING <br /> DONE RIGHT
          </h1>
          <p className="text-md md:text-xl text-center text-white-64">
            Trade Crypto Pairs Instantly, <br /> Without Limits
          </p>
        </header>
      </section>
      <Button asChild className="w-full md:w-auto py-3 px-6 text-lg">
        <Link href="/exchange">Start Trading</Link>
      </Button>
    </article>
  );
};

const NumberOneTradingPlatformBadge = () => {
  return (
    <div className="relative w-auto h-8 rounded-full bg-[#193E3E]">
      <span className="w-full h-full flex items-center gap-2 py-1.5 pl-1 pr-8 opacity-0 pointer-events-none not-sr-only">
        <span className="shrink-0">✦</span>
        <span className="text-md font-medium shrink-0">
          POWERED BY HYPERLIQUID
        </span>
      </span>

      <div className="absolute inset-0 w-full h-full rounded-full bg-[linear-gradient(259.02deg,_rgba(255,_255,_255,_0.12)_4.09%,_rgba(255,_255,_255,_0)_25.61%,_rgba(255,_255,_255,_0)_84.13%,_rgba(255,_255,_255,_0.12)_99.25%)]" />

      <div className="absolute inset-px rounded-full bg-[#193E3E]">
        <div className="w-full h-full flex items-center gap-2 py-1.5 px-4 pl-1">
          <span className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full bg-white-8">
            <TextGradient
              asChild
              className="bg-[linear-gradient(217.53deg,#8DD9CF_22.49%,rgba(141,217,207,0)_138%)]"
            >
              <span>✦</span>
            </TextGradient>
          </span>
          <TextGradient
            asChild
            className="bg-[linear-gradient(92.96deg,#96DCD3_6.46%,#2CCBB6_105.04%)]"
          >
            <span className="text-md font-medium shrink-0">
              POWERED BY HYPERLIQUID
            </span>
          </TextGradient>
        </div>
      </div>

      <svg
        className="absolute left-1/2 -translate-x-1/2 bottom-0 z-[1]"
        width="180"
        height="32"
        viewBox="0 0 180 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11475_43502)">
          <ellipse cx="90" cy="48" rx="40" ry="20" fill="#5AD1C2" />
        </g>
        <defs>
          <filter
            id="filter0_f_11475_43502"
            x="0"
            y="-22"
            width="180"
            height="140"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="25"
              result="effect1_foregroundBlur_11475_43502"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
