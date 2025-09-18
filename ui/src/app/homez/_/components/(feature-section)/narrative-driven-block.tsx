import { BentoCard } from "./bento-card";
import { BentoHeader } from "./bento-header";
import { ResponsivePicture } from "../_/responsive-picture";

import NarrativeDrivenDesktop from "../../assets/narrative-driven-desktop.png";
import NarrativeDrivenMobile from "../../assets/narrative-driven-mobile.png";
import NarrativeDrivenTablet from "../../assets/narrative-driven-tablet.png";

export const NarrativeDrivenBlock = () => {
  return (
    <BentoCard
      className="flex flex-col md:flex-col-reverse justify-between"
      decoration={<GlowEffect />}
    >
      <BentoHeader
        className="md:-mt-4"
        title="Relative Strategies"
        message="Use relative strategies with our pair statistics to profit from the market's movements."
      />
      <figure className="mt-4 md:mt-0 md:mr-8 lg:mr-14">
        <ResponsivePicture
          alt="Relative Strategies"
          source={{
            desktop: {
              height: 375,
              src: NarrativeDrivenDesktop,
            },
            mobile: {
              height: 240,
              src: NarrativeDrivenMobile,
            },
            tablet: {
              height: 375,
              src: NarrativeDrivenTablet,
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
        viewBox="0 0 335 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11499_37538)">
          <circle cx="321" cy="400" r="120" fill="#2FB7A5" />
        </g>
        <defs>
          <filter
            id="filter0_f_11499_37538"
            x="-199"
            y="-120"
            width="1040"
            height="1040"
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
              stdDeviation="200"
              result="effect1_foregroundBlur_11499_37538"
            />
          </filter>
        </defs>
      </svg>
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block lg:hidden"
        viewBox="0 0 440 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11446_43035)">
          <circle cx="-13" cy="-19" r="120" fill="#2FB7A5" />
        </g>
        <defs>
          <filter
            id="filter0_f_11446_43035"
            x="-533"
            y="-539"
            width="1040"
            height="1040"
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
              stdDeviation="200"
              result="effect1_foregroundBlur_11446_43035"
            />
          </filter>
        </defs>
      </svg>
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden lg:block opacity-0 group-hover:opacity-100 -translate-y-10 group-hover:translate-y-0 transition"
        viewBox="0 0 507 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11124_17049)">
          <circle cx="-13" cy="-19" r="120" fill="#2FB7A5" />
        </g>
        <defs>
          <filter
            id="filter0_f_11124_17049"
            x="-533"
            y="-539"
            width="1040"
            height="1040"
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
              stdDeviation="200"
              result="effect1_foregroundBlur_11124_17049"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};
