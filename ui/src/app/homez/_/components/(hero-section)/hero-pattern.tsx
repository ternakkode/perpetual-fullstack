"use client";

import { motion } from "motion/react";

export const HeroPattern = () => {
  return (
    <>
      <MobilePattern />
      <TabletPattern />
      <DesktopPattern />
    </>
  );
};

const MobilePattern = () => {
  return (
    <svg
      className="absolute inset-x-0 top-0 w-full md:hidden"
      viewBox="0 0 375 536"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="190.65"
        y1="-6.61615"
        x2="190.649"
        y2="535.479"
        stroke="url(#paint0_linear_11475_43462)"
        strokeOpacity="0.1"
        strokeWidth="0.523763"
      />
      <line
        x1="234.618"
        y1="-6.73083"
        x2="491.773"
        y2="520.515"
        stroke="url(#paint1_linear_11475_43462)"
        strokeOpacity="0.1"
        strokeWidth="0.523763"
      />
      <line
        y1="-0.261882"
        x2="586.615"
        y2="-0.261882"
        transform="matrix(0.438371 -0.898794 -0.898794 -0.438371 -94.467 486.034)"
        stroke="url(#paint2_linear_11475_43462)"
        strokeOpacity="0.1"
        strokeWidth="0.523763"
      />
      <motion.line
        y1="-0.261882"
        x2="94.2774"
        y2="-0.261882"
        transform="matrix(0.438371 -0.898794 -0.898794 -0.438371 66.7112 155.927)"
        stroke="url(#paint3_linear_11475_43462)"
        strokeWidth="0.523763"
        initial={{
          strokeDasharray: 94.2774,
          strokeDashoffset: 94.2774,
        }}
        animate={{
          strokeDashoffset: [94.2774, -94.2774],
        }}
        transition={{
          duration: 5,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        x1="325.078"
        y1="-6.83326"
        x2="608.189"
        y2="184.128"
        stroke="url(#paint4_linear_11475_43462)"
        strokeOpacity="0.1"
        strokeWidth="0.523763"
      />
      <line
        y1="-0.261882"
        x2="341.494"
        y2="-0.261882"
        transform="matrix(0.829038 -0.559193 -0.559193 -0.829038 -219.202 178.229)"
        stroke="url(#paint5_linear_11475_43462)"
        strokeOpacity="0.1"
        strokeWidth="0.523763"
      />
      <motion.line
        y1="-0.261882"
        x2="29.3307"
        y2="-0.261882"
        transform="matrix(0.829038 -0.559193 -0.559193 -0.829038 3.37646 28.0873)"
        stroke="url(#paint6_linear_11475_43462)"
        strokeWidth="0.523763"
        initial={{
          strokeDasharray: 29.3307,
          strokeDashoffset: 29.3307,
        }}
        animate={{
          strokeDashoffset: [29.3307, -29.3307],
        }}
        transition={{
          duration: 5,
          delay: 1,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        x1="278.672"
        y1="-6.80121"
        x2="590.513"
        y2="305.039"
        stroke="url(#paint7_linear_11475_43462)"
        strokeOpacity="0.1"
        strokeWidth="0.523763"
      />
      <motion.line
        x1="285.175"
        y1="-0.298643"
        x2="329.618"
        y2="44.1441"
        stroke="url(#paint8_linear_11475_43462)"
        strokeWidth="0.523763"
        initial={{
          strokeDasharray: 329.618,
          strokeDashoffset: 329.618,
        }}
        animate={{
          strokeDashoffset: [-329.618, 329.618],
        }}
        transition={{
          delay: 0.4,
          duration: 10,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        y1="-0.261882"
        x2="441.009"
        y2="-0.261882"
        transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 -209.707 304.46)"
        stroke="url(#paint9_linear_11475_43462)"
        strokeOpacity="0.1"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="6.01241"
        x2="567.467"
        y2="6.01241"
        stroke="url(#paint10_linear_11475_43462)"
        strokeOpacity="0.09"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="14.3374"
        x2="567.467"
        y2="14.3374"
        stroke="url(#paint11_linear_11475_43462)"
        strokeOpacity="0.09"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="23.558"
        x2="567.467"
        y2="23.558"
        stroke="url(#paint12_linear_11475_43462)"
        strokeOpacity="0.08"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="34.1212"
        x2="567.467"
        y2="34.1212"
        stroke="url(#paint13_linear_11475_43462)"
        strokeOpacity="0.08"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="46.8327"
        x2="567.467"
        y2="46.8327"
        stroke="url(#paint14_linear_11475_43462)"
        strokeOpacity="0.07"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="61.5139"
        x2="567.467"
        y2="61.5139"
        stroke="url(#paint15_linear_11475_43462)"
        strokeOpacity="0.07"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="79.0595"
        x2="567.467"
        y2="79.0595"
        stroke="url(#paint16_linear_11475_43462)"
        strokeOpacity="0.06"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="100.186"
        x2="567.467"
        y2="100.186"
        stroke="url(#paint17_linear_11475_43462)"
        strokeOpacity="0.05"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="126.952"
        x2="567.467"
        y2="126.952"
        stroke="url(#paint18_linear_11475_43462)"
        strokeOpacity="0.04"
        strokeWidth="0.523763"
      />
      <line
        x1="-186.753"
        y1="160.074"
        x2="567.467"
        y2="160.074"
        stroke="url(#paint19_linear_11475_43462)"
        strokeOpacity="0.03"
        strokeWidth="0.523763"
      />
      <line
        x1="-190.98"
        y1="206.576"
        x2="563.24"
        y2="206.576"
        stroke="url(#paint20_linear_11475_43462)"
        strokeOpacity="0.02"
        strokeWidth="0.523763"
      />
      <line
        x1="-190.98"
        y1="275.98"
        x2="563.24"
        y2="275.98"
        stroke="url(#paint21_linear_11475_43462)"
        strokeOpacity="0.01"
        strokeWidth="0.523763"
      />
      <g filter="url(#filter0_f_11475_43462)">
        <circle
          cx="189.572"
          cy="-52.2643"
          r="104.753"
          fill="#2FB7A5"
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_11475_43462"
          x="-229.439"
          y="-471.275"
          width="838.021"
          height="838.021"
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
            stdDeviation="157.129"
            result="effect1_foregroundBlur_11475_43462"
          />
        </filter>
        <linearGradient
          id="paint0_linear_11475_43462"
          x1="190.388"
          y1="-6.61615"
          x2="190.388"
          y2="509.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.811088" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_11475_43462"
          x1="234.383"
          y1="-6.61603"
          x2="479.162"
          y2="495.256"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.814388" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_11475_43462"
          x1="0"
          y1="0"
          x2="558.384"
          y2="-5.46974e-05"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.172022" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_11475_43462"
          x1="93.7522"
          y1="-0.4619"
          x2="6.92843"
          y2="-0.2169"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0.8" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_11475_43462"
          x1="324.931"
          y1="-6.61615"
          x2="594.417"
          y2="175.155"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_11475_43462"
          x1="0"
          y1="0"
          x2="325.059"
          y2="-1.85364e-05"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_11475_43462"
          x1="29.1674"
          y1="-0.4619"
          x2="2.15532"
          y2="-0.438186"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0.6" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_11475_43462"
          x1="278.487"
          y1="-6.61603"
          x2="575.32"
          y2="290.217"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_11475_43462"
          x1="329.512"
          y1="43.7551"
          x2="285.77"
          y2="0.20606"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_11475_43462"
          x1="0"
          y1="0"
          x2="419.785"
          y2="-3.09139e-05"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_11475_43462"
          x1="-186.753"
          y1="6.27429"
          x2="567.467"
          y2="6.27429"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.09" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.09" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_11475_43462"
          x1="-186.753"
          y1="14.5993"
          x2="567.467"
          y2="14.5993"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.09" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.09" />
        </linearGradient>
        <linearGradient
          id="paint12_linear_11475_43462"
          x1="-186.753"
          y1="23.8199"
          x2="567.467"
          y2="23.8199"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.08" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient
          id="paint13_linear_11475_43462"
          x1="-186.753"
          y1="34.3831"
          x2="567.467"
          y2="34.3831"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.08" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient
          id="paint14_linear_11475_43462"
          x1="-186.753"
          y1="47.0946"
          x2="567.467"
          y2="47.0946"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.07" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint15_linear_11475_43462"
          x1="-186.753"
          y1="61.7758"
          x2="567.467"
          y2="61.7758"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.07" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint16_linear_11475_43462"
          x1="-186.753"
          y1="79.3214"
          x2="567.467"
          y2="79.3214"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.06" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient
          id="paint17_linear_11475_43462"
          x1="-186.753"
          y1="100.448"
          x2="567.467"
          y2="100.448"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.05" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient
          id="paint18_linear_11475_43462"
          x1="-186.753"
          y1="127.214"
          x2="567.467"
          y2="127.214"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.04" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient
          id="paint19_linear_11475_43462"
          x1="-186.753"
          y1="160.336"
          x2="567.467"
          y2="160.336"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.03" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient
          id="paint20_linear_11475_43462"
          x1="-190.98"
          y1="206.838"
          x2="563.24"
          y2="206.838"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.02" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient
          id="paint21_linear_11475_43462"
          x1="-190.98"
          y1="276.242"
          x2="563.24"
          y2="276.242"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const TabletPattern = () => {
  return (
    <svg
      className="absolute inset-x-0 top-0 w-full hidden md:block lg:hidden"
      viewBox="0 0 1024 1023"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="513.559"
        y1="-12.632"
        x2="513.558"
        y2="1022.37"
        stroke="url(#paint0_linear_11446_42759)"
        strokeOpacity="0.1"
      />
      <line
        x1="597.506"
        y1="-12.8509"
        x2="1088.48"
        y2="993.798"
        stroke="url(#paint1_linear_11446_42759)"
        strokeOpacity="0.1"
      />
      <line
        y1="-0.5"
        x2="1120"
        y2="-0.5"
        transform="matrix(0.438371 -0.898794 -0.898794 -0.438371 -30.8027 927.965)"
        stroke="url(#paint2_linear_11446_42759)"
        strokeOpacity="0.1"
      />
      <motion.line
        y1="-0.5"
        x2="180"
        y2="-0.5"
        transform="matrix(0.438371 -0.898794 -0.898794 -0.438371 276.928 297.705)"
        stroke="url(#paint3_linear_11446_42759)"
        initial={{
          strokeDasharray: 180,
          strokeDashoffset: 180,
        }}
        animate={{
          strokeDashoffset: [180, -180],
        }}
        transition={{
          delay: 0.4,
          duration: 10,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        x1="770.217"
        y1="-13.0464"
        x2="1310.75"
        y2="351.547"
        stroke="url(#paint4_linear_11446_42759)"
        strokeOpacity="0.1"
      />
      <motion.line
        x1="919.545"
        y1="87.6414"
        x2="985.868"
        y2="132.377"
        stroke="url(#paint5_linear_11446_42759)"
        initial={{
          strokeDasharray: 985.868,
          strokeDashoffset: 985.868,
        }}
        animate={{
          strokeDashoffset: [-985.868, 985.868],
        }}
        transition={{
          delay: 0.4,
          duration: 20,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        y1="-0.5"
        x2="652"
        y2="-0.5"
        transform="matrix(0.829038 -0.559193 -0.559193 -0.829038 -268.955 340.286)"
        stroke="url(#paint6_linear_11446_42759)"
        strokeOpacity="0.1"
      />
      <motion.line
        y1="-0.5"
        x2="56"
        y2="-0.5"
        transform="matrix(0.829038 -0.559193 -0.559193 -0.829038 156.006 53.626)"
        stroke="url(#paint7_linear_11446_42759)"
        initial={{
          strokeDasharray: 56,
          strokeDashoffset: 56,
        }}
        animate={{
          strokeDashoffset: [56, -56],
        }}
        transition={{
          delay: 0.4,
          duration: 10,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        x1="681.617"
        y1="-12.9853"
        x2="1277"
        y2="582.399"
        stroke="url(#paint8_linear_11446_42759)"
        strokeOpacity="0.1"
      />
      <motion.line
        x1="694.033"
        y1="-0.570167"
        x2="778.886"
        y2="84.2826"
        stroke="url(#paint9_linear_11446_42759)"
        initial={{
          strokeDasharray: 778.886,
          strokeDashoffset: 778.886,
        }}
        animate={{
          strokeDashoffset: [-778.886, 778.886],
        }}
        transition={{
          delay: 0.4,
          duration: 10,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        y1="-0.5"
        x2="842"
        y2="-0.5"
        transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 -250.826 581.294)"
        stroke="url(#paint10_linear_11446_42759)"
        strokeOpacity="0.1"
      />
      <line
        x1="-207"
        y1="11.4793"
        x2="1233"
        y2="11.4793"
        stroke="url(#paint11_linear_11446_42759)"
        strokeOpacity="0.09"
      />
      <line
        x1="-207"
        y1="27.3738"
        x2="1233"
        y2="27.3738"
        stroke="url(#paint12_linear_11446_42759)"
        strokeOpacity="0.09"
      />
      <line
        x1="-207"
        y1="44.9783"
        x2="1233"
        y2="44.9783"
        stroke="url(#paint13_linear_11446_42759)"
        strokeOpacity="0.08"
      />
      <line
        x1="-207"
        y1="65.1463"
        x2="1233"
        y2="65.1463"
        stroke="url(#paint14_linear_11446_42759)"
        strokeOpacity="0.08"
      />
      <line
        x1="-207"
        y1="89.4158"
        x2="1233"
        y2="89.4158"
        stroke="url(#paint15_linear_11446_42759)"
        strokeOpacity="0.07"
      />
      <line
        x1="-207"
        y1="117.446"
        x2="1233"
        y2="117.446"
        stroke="url(#paint16_linear_11446_42759)"
        strokeOpacity="0.07"
      />
      <line
        x1="-207"
        y1="150.945"
        x2="1233"
        y2="150.945"
        stroke="url(#paint17_linear_11446_42759)"
        strokeOpacity="0.06"
      />
      <line
        x1="-207"
        y1="191.281"
        x2="1233"
        y2="191.281"
        stroke="url(#paint18_linear_11446_42759)"
        strokeOpacity="0.05"
      />
      <line
        x1="-207"
        y1="242.385"
        x2="1233"
        y2="242.385"
        stroke="url(#paint19_linear_11446_42759)"
        strokeOpacity="0.04"
      />
      <line
        x1="-207"
        y1="305.623"
        x2="1233"
        y2="305.623"
        stroke="url(#paint20_linear_11446_42759)"
        strokeOpacity="0.03"
      />
      <line
        x1="-215.07"
        y1="394.408"
        x2="1224.93"
        y2="394.408"
        stroke="url(#paint21_linear_11446_42759)"
        strokeOpacity="0.02"
      />
      <line
        x1="-215.07"
        y1="526.918"
        x2="1224.93"
        y2="526.918"
        stroke="url(#paint22_linear_11446_42759)"
        strokeOpacity="0.01"
      />
      <g filter="url(#filter0_f_11446_42759)">
        <circle
          cx="511.5"
          cy="-99.7861"
          r="200"
          fill="#2FB7A5"
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_11446_42759"
          x="-288.5"
          y="-899.786"
          width="1600"
          height="1600"
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
            result="effect1_foregroundBlur_11446_42759"
          />
        </filter>
        <linearGradient
          id="paint0_linear_11446_42759"
          x1="513.059"
          y1="-12.632"
          x2="513.059"
          y2="972.558"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.811088" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_11446_42759"
          x1="597.057"
          y1="-12.6317"
          x2="1064.4"
          y2="945.572"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.814388" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_11446_42759"
          x1="0"
          y1="0"
          x2="1066.1"
          y2="-0.000199387"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.172022" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_11446_42759"
          x1="178.997"
          y1="-0.4619"
          x2="13.2317"
          y2="0.431173"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0.8" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_11446_42759"
          x1="769.938"
          y1="-12.6318"
          x2="1284.46"
          y2="334.416"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_11446_42759"
          x1="985.477"
          y1="132.159"
          x2="920.522"
          y2="88.1873"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_11446_42759"
          x1="0"
          y1="0"
          x2="620.622"
          y2="-6.75702e-05"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_11446_42759"
          x1="55.688"
          y1="-0.4619"
          x2="4.11516"
          y2="-0.375457"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0.6" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_11446_42759"
          x1="681.264"
          y1="-12.6317"
          x2="1247.99"
          y2="554.099"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_11446_42759"
          x1="778.386"
          y1="83.8369"
          x2="694.706"
          y2="0.858876"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_11446_42759"
          x1="0"
          y1="0"
          x2="801.479"
          y2="-0.00011269"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_11446_42759"
          x1="-207"
          y1="11.9793"
          x2="1233"
          y2="11.9793"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.09" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.09" />
        </linearGradient>
        <linearGradient
          id="paint12_linear_11446_42759"
          x1="-207"
          y1="27.8738"
          x2="1233"
          y2="27.8738"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.09" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.09" />
        </linearGradient>
        <linearGradient
          id="paint13_linear_11446_42759"
          x1="-207"
          y1="45.4783"
          x2="1233"
          y2="45.4783"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.08" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient
          id="paint14_linear_11446_42759"
          x1="-207"
          y1="65.6463"
          x2="1233"
          y2="65.6463"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.08" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient
          id="paint15_linear_11446_42759"
          x1="-207"
          y1="89.9158"
          x2="1233"
          y2="89.9158"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.07" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint16_linear_11446_42759"
          x1="-207"
          y1="117.946"
          x2="1233"
          y2="117.946"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.07" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint17_linear_11446_42759"
          x1="-207"
          y1="151.445"
          x2="1233"
          y2="151.445"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.06" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient
          id="paint18_linear_11446_42759"
          x1="-207"
          y1="191.781"
          x2="1233"
          y2="191.781"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.05" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient
          id="paint19_linear_11446_42759"
          x1="-207"
          y1="242.885"
          x2="1233"
          y2="242.885"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.04" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient
          id="paint20_linear_11446_42759"
          x1="-207"
          y1="306.123"
          x2="1233"
          y2="306.123"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.03" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient
          id="paint21_linear_11446_42759"
          x1="-215.07"
          y1="394.908"
          x2="1224.93"
          y2="394.908"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.02" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient
          id="paint22_linear_11446_42759"
          x1="-215.07"
          y1="527.418"
          x2="1224.93"
          y2="527.418"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const DesktopPattern = () => {
  return (
    <svg
      className="absolute inset-x-0 top-0 w-full hidden lg:block"
      viewBox="0 0 1440 1023"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="721.559"
        y1="-12.632"
        x2="721.558"
        y2="1022.37"
        stroke="url(#paint0_linear_11035_38756)"
        strokeOpacity="0.1"
      />
      <line
        x1="805.506"
        y1="-12.8509"
        x2="1296.48"
        y2="993.798"
        stroke="url(#paint1_linear_11035_38756)"
        strokeOpacity="0.1"
      />
      <line
        y1="-0.5"
        x2="1120"
        y2="-0.5"
        transform="matrix(0.438371 -0.898794 -0.898794 -0.438371 177.197 927.965)"
        stroke="url(#paint2_linear_11035_38756)"
        strokeOpacity="0.1"
      />
      <motion.line
        y1="-0.5"
        x2="180"
        y2="-0.5"
        transform="matrix(0.438371 -0.898794 -0.898794 -0.438371 484.928 297.705)"
        stroke="url(#paint3_linear_11035_38756)"
        initial={{
          strokeDasharray: 180,
          strokeDashoffset: 180,
        }}
        animate={{
          strokeDashoffset: [180, -180],
        }}
        transition={{
          delay: 0.2,
          duration: 10,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        x1="978.217"
        y1="-13.0464"
        x2="1518.75"
        y2="351.547"
        stroke="url(#paint4_linear_11035_38756)"
        strokeOpacity="0.1"
      />
      <motion.line
        x1="1127.54"
        y1="87.6414"
        x2="1193.87"
        y2="132.377"
        stroke="url(#paint5_linear_11035_38756)"
        initial={{
          strokeDasharray: 1193.87,
          strokeDashoffset: 1193.87,
        }}
        animate={{
          strokeDashoffset: [-1193.87, 1193.87],
        }}
        transition={{
          delay: 0.4,
          duration: 4,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        y1="-0.5"
        x2="652"
        y2="-0.5"
        transform="matrix(0.829038 -0.559193 -0.559193 -0.829038 -60.9551 340.286)"
        stroke="url(#paint6_linear_11035_38756)"
        strokeOpacity="0.1"
      />
      <motion.line
        y1="-0.5"
        x2="56"
        y2="-0.5"
        transform="matrix(0.829038 -0.559193 -0.559193 -0.829038 364.006 53.626)"
        stroke="url(#paint7_linear_11035_38756)"
        initial={{
          strokeDasharray: 56,
          strokeDashoffset: 56,
        }}
        animate={{
          strokeDashoffset: [56, -56],
        }}
        transition={{
          delay: 0.8,
          duration: 8,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        x1="889.617"
        y1="-12.9853"
        x2="1485"
        y2="582.399"
        stroke="url(#paint8_linear_11035_38756)"
        strokeOpacity="0.1"
      />
      <motion.line
        x1="902.033"
        y1="-0.570167"
        x2="986.886"
        y2="84.2826"
        stroke="url(#paint9_linear_11035_38756)"
        initial={{
          strokeDasharray: 986.886,
          strokeDashoffset: 986.886,
        }}
        animate={{
          strokeDashoffset: [-986.886, 986.886],
        }}
        transition={{
          delay: 0.6,
          duration: 4,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <line
        y1="-0.5"
        x2="842"
        y2="-0.5"
        transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 -42.8262 581.294)"
        stroke="url(#paint10_linear_11035_38756)"
        strokeOpacity="0.1"
      />
      <line
        x1="1"
        y1="11.4793"
        x2="1441"
        y2="11.4793"
        stroke="url(#paint11_linear_11035_38756)"
        strokeOpacity="0.09"
      />
      <line
        x1="1"
        y1="27.3738"
        x2="1441"
        y2="27.3738"
        stroke="url(#paint12_linear_11035_38756)"
        strokeOpacity="0.09"
      />
      <line
        x1="1"
        y1="44.9783"
        x2="1441"
        y2="44.9783"
        stroke="url(#paint13_linear_11035_38756)"
        strokeOpacity="0.08"
      />
      <line
        x1="1"
        y1="65.1463"
        x2="1441"
        y2="65.1463"
        stroke="url(#paint14_linear_11035_38756)"
        strokeOpacity="0.08"
      />
      <line
        x1="1"
        y1="89.4158"
        x2="1441"
        y2="89.4158"
        stroke="url(#paint15_linear_11035_38756)"
        strokeOpacity="0.07"
      />
      <line
        x1="1"
        y1="117.446"
        x2="1441"
        y2="117.446"
        stroke="url(#paint16_linear_11035_38756)"
        strokeOpacity="0.07"
      />
      <line
        x1="1"
        y1="150.945"
        x2="1441"
        y2="150.945"
        stroke="url(#paint17_linear_11035_38756)"
        strokeOpacity="0.06"
      />
      <line
        x1="1"
        y1="191.281"
        x2="1441"
        y2="191.281"
        stroke="url(#paint18_linear_11035_38756)"
        strokeOpacity="0.05"
      />
      <line
        x1="1"
        y1="242.385"
        x2="1441"
        y2="242.385"
        stroke="url(#paint19_linear_11035_38756)"
        strokeOpacity="0.04"
      />
      <line
        x1="1"
        y1="305.623"
        x2="1441"
        y2="305.623"
        stroke="url(#paint20_linear_11035_38756)"
        strokeOpacity="0.03"
      />
      <line
        x1="-7.07031"
        y1="394.408"
        x2="1432.93"
        y2="394.408"
        stroke="url(#paint21_linear_11035_38756)"
        strokeOpacity="0.02"
      />
      <line
        x1="-7.07031"
        y1="526.918"
        x2="1432.93"
        y2="526.918"
        stroke="url(#paint22_linear_11035_38756)"
        strokeOpacity="0.01"
      />
      <g filter="url(#filter0_f_11035_38756)">
        <circle
          cx="719.5"
          cy="-99.7861"
          r="200"
          fill="#2FB7A5"
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_11035_38756"
          x="-80.5"
          y="-899.786"
          width="1600"
          height="1600"
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
            result="effect1_foregroundBlur_11035_38756"
          />
        </filter>
        <linearGradient
          id="paint0_linear_11035_38756"
          x1="721.059"
          y1="-12.632"
          x2="721.059"
          y2="972.558"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.811088" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_11035_38756"
          x1="805.057"
          y1="-12.6317"
          x2="1272.4"
          y2="945.572"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.814388" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_11035_38756"
          x1="0"
          y1="0"
          x2="1066.1"
          y2="-0.000199387"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.172022" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_11035_38756"
          x1="178.997"
          y1="-0.4619"
          x2="13.2317"
          y2="0.431173"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0.8" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_11035_38756"
          x1="977.938"
          y1="-12.6318"
          x2="1492.46"
          y2="334.416"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_11035_38756"
          x1="1193.48"
          y1="132.159"
          x2="1128.52"
          y2="88.1873"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_11035_38756"
          x1="0"
          y1="0"
          x2="620.622"
          y2="-6.75702e-05"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_11035_38756"
          x1="55.688"
          y1="-0.4619"
          x2="4.11516"
          y2="-0.375457"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0.6" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_11035_38756"
          x1="889.264"
          y1="-12.6317"
          x2="1455.99"
          y2="554.099"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_11035_38756"
          x1="986.386"
          y1="83.8369"
          x2="902.706"
          y2="0.858876"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2FB7A5" stopOpacity="0" />
          <stop offset="1" stopColor="#2FB7A5" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_11035_38756"
          x1="0"
          y1="0"
          x2="801.479"
          y2="-0.00011269"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_11035_38756"
          x1="1"
          y1="11.9793"
          x2="1441"
          y2="11.9793"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.09" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.09" />
        </linearGradient>
        <linearGradient
          id="paint12_linear_11035_38756"
          x1="1"
          y1="27.8738"
          x2="1441"
          y2="27.8738"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.09" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.09" />
        </linearGradient>
        <linearGradient
          id="paint13_linear_11035_38756"
          x1="1"
          y1="45.4783"
          x2="1441"
          y2="45.4783"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.08" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient
          id="paint14_linear_11035_38756"
          x1="1"
          y1="65.6463"
          x2="1441"
          y2="65.6463"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.08" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient
          id="paint15_linear_11035_38756"
          x1="1"
          y1="89.9158"
          x2="1441"
          y2="89.9158"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.07" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint16_linear_11035_38756"
          x1="1"
          y1="117.946"
          x2="1441"
          y2="117.946"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.07" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint17_linear_11035_38756"
          x1="1"
          y1="151.445"
          x2="1441"
          y2="151.445"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.06" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient
          id="paint18_linear_11035_38756"
          x1="1"
          y1="191.781"
          x2="1441"
          y2="191.781"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.05" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient
          id="paint19_linear_11035_38756"
          x1="1"
          y1="242.885"
          x2="1441"
          y2="242.885"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.04" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient
          id="paint20_linear_11035_38756"
          x1="1"
          y1="306.123"
          x2="1441"
          y2="306.123"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.03" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient
          id="paint21_linear_11035_38756"
          x1="-7.07031"
          y1="394.908"
          x2="1432.93"
          y2="394.908"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.02" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient
          id="paint22_linear_11035_38756"
          x1="-7.07031"
          y1="527.418"
          x2="1432.93"
          y2="527.418"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.50013" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
