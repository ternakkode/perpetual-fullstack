import { BentoCard } from "./bento-card";
import { BentoHeader } from "./bento-header";
import { ResponsivePicture } from "../_/responsive-picture";

import ThousandPairsDesktop from "../../assets/thousand-pairs-desktop.png";
import ThousandPairsMobile from "../../assets/thousand-pairs-mobile.png";
import ThousandPairsTablet from "../../assets/thousand-pairs-tablet.png";

export const ThousandOfPairsBlock = () => {
  return (
    <BentoCard
      className="flex flex-col justify-between"
      decoration={<GlowEffect />}
    >
      <BentoHeader
        title="Thousands of pairs"
        message="Access unlimited trading combinations with any token pair. From blue-chip cryptocurrencies to trending meme coins - everything on a single platform."
      />
      <figure className="mt-4 md:mt-0 md:mx-10 lg:mx-[82px]">
        <ResponsivePicture
          alt="Thousands of pairs"
          source={{
            desktop: {
              height: 375,
              src: ThousandPairsDesktop,
            },
            mobile: {
              height: 240,
              src: ThousandPairsMobile,
            },
            tablet: {
              height: 375,
              src: ThousandPairsTablet,
            },
          }}
        />
      </figure>
    </BentoCard>
  );
};

const GlowEffect = () => {
  return (
    <>
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none md:hidden"
        viewBox="0 0 335 328"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11499_37551)">
          <circle
            cx="167.5"
            cy="420"
            r="120"
            fill="#2FB7A5"
            fillOpacity="0.8"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_11499_37551"
            x="-252.5"
            y="0"
            width="840"
            height="840"
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
              stdDeviation="150"
              result="effect1_foregroundBlur_11499_37551"
            />
          </filter>
        </defs>
      </svg>
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block lg:hidden"
        viewBox="0 0 440 276"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11446_43048)">
          <circle cx="220" cy="420" r="120" fill="#2FB7A5" fillOpacity="0.8" />
        </g>
        <defs>
          <filter
            id="filter0_f_11446_43048"
            x="-200"
            y="0"
            width="840"
            height="840"
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
              stdDeviation="150"
              result="effect1_foregroundBlur_11446_43048"
            />
          </filter>
        </defs>
      </svg>
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden lg:block opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition"
        viewBox="0 0 584 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11124_17051)">
          <circle cx="292" cy="420" r="120" fill="#2FB7A5" fillOpacity="0.8" />
        </g>
        <defs>
          <filter
            id="filter0_f_11124_17051"
            x="-128"
            y="0"
            width="840"
            height="840"
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
              stdDeviation="150"
              result="effect1_foregroundBlur_11124_17051"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};
