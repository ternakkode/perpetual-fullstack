export const PlatformGradient = () => {
  return (
    <>
      <Tablet />
      <Desktop />
    </>
  );
};

const Desktop = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden lg:block -translate-x-1/4 -translate-y-1/4"
      viewBox="0 0 772 1629"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_11166_56368)">
        <ellipse
          cx="-34.3249"
          cy="814.703"
          rx="123"
          ry="269.877"
          transform="rotate(43.3371 -34.3249 814.703)"
          fill="#2FB7A5"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_11166_56368"
          x="-840.06"
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
            result="effect1_foregroundBlur_11166_56368"
          />
        </filter>
      </defs>
    </svg>
  );
};

const Tablet = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block lg:hidden -translate-x-1/4 -translate-y-1/4"
      viewBox="0 0 646 1629"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_11446_43096)">
        <ellipse
          cx="-160.325"
          cy="814.703"
          rx="123"
          ry="269.877"
          transform="rotate(43.3371 -160.325 814.703)"
          fill="#2FB7A5"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_11446_43096"
          x="-966.06"
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
            result="effect1_foregroundBlur_11446_43096"
          />
        </filter>
      </defs>
    </svg>
  );
};
