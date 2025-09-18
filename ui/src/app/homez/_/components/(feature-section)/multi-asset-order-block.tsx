import { Badge } from "../_/badge";
import { BentoCard } from "./bento-card";
import { BentoHeader } from "./bento-header";
import { ResponsivePicture } from "../_/responsive-picture";
import { TextGradient } from "../_/text-gradient";

import KeyFeaturesDesktop from "../../assets/key-features-desktop.png";
import KeyFeaturesMobile from "../../assets/key-features-mobile.png";
import KeyFeaturesTablet from "../../assets/key-features-tablet.png";

export const MultiAssetOrderBlock = () => {
  return (
    <BentoCard className="md:flex justify-between" decoration={<GlowEffect />}>
      <BentoHeader
        className="md:flex-1 md:pl-16 md:pr-[60px] lg:px-[72px] md:justify-center"
        title="Multi-Asset Trading with Custom Weights"
        message="Trade crypto pairs using multiple assets with adjustable weights, enabling more flexible and efficient trading strategies."
      >
        <Badge className="py-1.5 px-3 uppercase mb-1">
          <TextGradient className="whitespace-nowrap text-sm font-medium pr-0.5 bg-[linear-gradient(92.96deg,#96DCD3_6.46%,#2CCBB6_105.04%)]">
            Key Features
          </TextGradient>
        </Badge>
      </BentoHeader>
      <figure className="md:-mr-16 lg:mr-0">
        <ResponsivePicture
          alt="Key Features"
          className="!h-[250px] md:!h-[400px] lg:!h-[440px]"
          source={{
            desktop: {
              height: 440,
              src: KeyFeaturesDesktop,
            },
            mobile: {
              height: 250,
              src: KeyFeaturesMobile,
            },
            tablet: {
              height: 400,
              src: KeyFeaturesTablet,
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
        viewBox="0 0 335 492"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11512_35489)">
          <circle cx="168" cy="615" r="160" fill="#2FB7A5" fillOpacity="0.6" />
        </g>
        <defs>
          <filter
            id="filter0_f_11512_35489"
            x="-592"
            y="-145"
            width="1520"
            height="1520"
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
              stdDeviation="300"
              result="effect1_foregroundBlur_11512_35489"
            />
          </filter>
        </defs>
      </svg>
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block lg:hidden"
        viewBox="0 0 911 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11446_42854)">
          <circle cx="600" cy="505" r="160" fill="#2FB7A5" fillOpacity="0.6" />
        </g>
        <defs>
          <filter
            id="filter0_f_11446_42854"
            x="-160"
            y="-255"
            width="1520"
            height="1520"
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
              stdDeviation="300"
              result="effect1_foregroundBlur_11446_42854"
            />
          </filter>
        </defs>
      </svg>
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden lg:block opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition"
        viewBox="0 0 1200 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11124_16990)">
          <circle cx="600" cy="505" r="160" fill="#2FB7A5" fillOpacity="0.6" />
        </g>
        <defs>
          <filter
            id="filter0_f_11124_16990"
            x="-160"
            y="-255"
            width="1520"
            height="1520"
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
              stdDeviation="300"
              result="effect1_foregroundBlur_11124_16990"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};
