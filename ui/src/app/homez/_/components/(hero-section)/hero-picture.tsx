/* eslint-disable jsx-a11y/alt-text */
import Image, { type ImageProps, getImageProps } from "next/image";

import AppMockupDesktop from "../../assets/app-mockup-desktop.png";
import AppMockupMobile from "../../assets/app-mockup-mobile.png";
import AppMockupTablet from "../../assets/app-mockup-tablet.png";

import Bitcoin from "../../assets/bitcoin.png";
import Etherium from "../../assets/etherium.png";

export const HeroPicture = () => {
  const common: Omit<ImageProps, "src"> = {
    alt: "Brother Terminal - Exchange",
    className: "rounded-lg",
    draggable: false,
    sizes: "100vw",
  };

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    height: 720,
    quality: 100,
    src: AppMockupDesktop,
    width: 1440,
  });

  const {
    props: { srcSet: tablet },
  } = getImageProps({
    ...common,
    height: 720,
    quality: 100,
    src: AppMockupTablet,
    width: 1024,
  });

  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    height: 700,
    quality: 100,
    src: AppMockupMobile,
    width: 375,
  });

  return (
    <>
      <BitcoinSprite />
      <figure className="container mx-auto px-4 md:px-8 lg:px-[68px] relative z-[1]">
        <div className="relative z-[1] border-4 border-white-8 rounded-xl">
          <picture>
            <source media="(min-width: 1439px)" srcSet={desktop} />
            <source media="(min-width: 1023px)" srcSet={tablet} />
            <source media="(min-width: 374px)" srcSet={mobile} />
            <img
              {...rest}
              style={{ width: "100%", height: "auto", ...rest.style }}
            />
          </picture>
        </div>
      </figure>
      <EtheriumSprite />
    </>
  );
};

const BitcoinSprite = () => {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block">
      <svg
        className="absolute left-0 top-0 w-[460px]"
        viewBox="0 0 500 505"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11055_14360)">
          <path
            d="M104.853 160.71C187.802 173.72 406.134 298.212 320.4 327.834C213.232 364.862 30.3807 192.734 0.107361 203.242C-28.3379 213.115 -113.98 277.767 -119.699 328.293C-119.848 331.678 -119.879 334.636 -119.848 337.084C-119.826 337.337 -119.802 337.589 -119.775 337.842C-118.66 348.391 -119.726 346.55 -119.848 337.084C-120.096 334.212 -120.037 331.277 -119.699 328.293C-117.613 280.808 -92.4748 149.195 104.853 160.71Z"
            fill="#47CAC1"
            fillOpacity="0.4"
          />
        </g>
        <g filter="url(#filter1_f_11055_14360)">
          <ellipse
            cx="218.215"
            cy="283.597"
            rx="82.8731"
            ry="28.0885"
            transform="rotate(31.8561 218.215 283.597)"
            fill="#BEFBF7"
            fillOpacity="0.6"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_11055_14360"
            x="-280"
            y="0"
            width="780"
            height="505"
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
              stdDeviation="80"
              result="effect1_foregroundBlur_11055_14360"
            />
          </filter>
          <filter
            id="filter1_f_11055_14360"
            x="46.2659"
            y="133.765"
            width="343.898"
            height="299.665"
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
              stdDeviation="50"
              result="effect1_foregroundBlur_11055_14360"
            />
          </filter>
        </defs>
      </svg>

      <Image
        alt="Bitcoin"
        className="absolute left-0 top-0 translate-y-[55%] rotate-[-25deg] mix-blend-luminosity"
        src={Bitcoin}
        width={360}
        height={360}
      />
    </div>
  );
};

const EtheriumSprite = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute hidden md:block right-0 top-0 translate-y-3/4"
        width="305"
        height="377"
        viewBox="0 0 305 377"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_11055_14359)">
          <path
            d="M129.456 248.781C88.0945 226.068 193.426 130.612 233.444 120.637C361.677 108.744 351.422 267.438 341.814 256.455C322.509 234.387 298.583 161.306 283.978 153.249C269.373 145.192 181.158 277.173 129.456 248.781Z"
            fill="#47CAC1"
            fillOpacity="0.4"
          />
        </g>
        <g filter="url(#filter1_f_11055_14359)">
          <ellipse
            cx="164.276"
            cy="199.6"
            rx="59.1446"
            ry="20.3668"
            transform="rotate(143.7 164.276 199.6)"
            fill="#BEFBF7"
            fillOpacity="0.6"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_11055_14359"
            x="0"
            y="0"
            width="467"
            height="377"
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
              stdDeviation="60"
              result="effect1_foregroundBlur_11055_14359"
            />
          </filter>
          <filter
            id="filter1_f_11055_14359"
            x="35.0969"
            y="80.9203"
            width="258.359"
            height="237.36"
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
              stdDeviation="40"
              result="effect1_foregroundBlur_11055_14359"
            />
          </filter>
        </defs>
      </svg>
      <Image
        alt="Bitcoin"
        className="absolute hidden md:block right-[5%] top-0 translate-y-[80%] rotate-[18deg] mix-blend-luminosity"
        src={Etherium}
        width={280}
        height={280}
      />
    </div>
  );
};
