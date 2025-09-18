export const FaqGradient = () => {
  return (
    <>
      <Mobile />
      <Tablet />
      <Desktop />
    </>
  );
};

const Desktop = () => {
  return (
    <svg
      className="absolute w-[250px] right-0 pointer-events-none hidden lg:block"
      viewBox="0 0 772 1629"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_11102_20199)">
        <ellipse
          cx="806.675"
          cy="814.703"
          rx="123"
          ry="269.877"
          transform="rotate(43.3371 806.675 814.703)"
          fill="#2FB7A5"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_11102_20199"
          x="0.940186"
          y="0.977539"
          width="1611.47"
          height="1627.45"
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
            result="effect1_foregroundBlur_11102_20199"
          />
        </filter>
      </defs>
    </svg>
  );
};

const Tablet = () => {
  return (
    <svg
      className="absolute w-[250px] right-0 -translate-y-1/4 pointer-events-none hidden md:block lg:hidden"
      viewBox="0 0 772 1629"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_11446_43441)">
        <ellipse
          cx="806.675"
          cy="814.703"
          rx="123"
          ry="269.877"
          transform="rotate(43.3371 806.675 814.703)"
          fill="#2FB7A5"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_11446_43441"
          x="0.940186"
          y="0.977539"
          width="1611.47"
          height="1627.45"
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
            result="effect1_foregroundBlur_11446_43441"
          />
        </filter>
      </defs>
    </svg>
  );
};

const Mobile = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full -translate-y-[40%] pointer-events-none md:hidden"
      viewBox="0 0 375 1629"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_11475_44321)">
        <ellipse
          cx="529.675"
          cy="814.703"
          rx="123"
          ry="269.877"
          transform="rotate(43.3371 529.675 814.703)"
          fill="#2FB7A5"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_11475_44321"
          x="-276.06"
          y="0.977539"
          width="1611.47"
          height="1627.45"
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
            result="effect1_foregroundBlur_11475_44321"
          />
        </filter>
      </defs>
    </svg>
  );
};
