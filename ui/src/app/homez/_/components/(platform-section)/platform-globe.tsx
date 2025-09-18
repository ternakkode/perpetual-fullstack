export const PlatformGlobe = () => {
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
      className="hidden lg:block"
      viewBox="0 0 1440 1140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_11166_56370)">
        <line
          y1="569.5"
          x2="1440"
          y2="569.5"
          stroke="url(#paint0_linear_11166_56370)"
        />
        <line
          x1="714.5"
          y1="-30"
          x2="714.5"
          y2="1170"
          stroke="url(#paint1_linear_11166_56370)"
        />
        <path
          d="M913.5 570C913.5 735.647 891.119 885.591 854.947 994.106C836.86 1048.37 815.335 1092.24 791.456 1122.54C767.574 1152.84 741.395 1169.5 714 1169.5C686.605 1169.5 660.426 1152.84 636.544 1122.54C612.665 1092.24 591.14 1048.37 573.053 994.106C536.881 885.591 514.5 735.647 514.5 570C514.5 404.353 536.881 254.409 573.053 145.894C591.14 91.6338 612.665 47.7595 636.544 17.4605C660.426 -12.8442 686.605 -29.5 714 -29.5C741.395 -29.5 767.574 -12.8442 791.456 17.4605C815.335 47.7595 836.86 91.6338 854.947 145.894C891.119 254.409 913.5 404.353 913.5 570Z"
          stroke="url(#paint2_linear_11166_56370)"
        />
        <path
          d="M1113.5 570C1113.5 735.6 1068.75 885.501 996.427 993.987C924.101 1102.48 824.238 1169.5 714 1169.5C603.762 1169.5 503.899 1102.48 431.573 993.987C359.249 885.501 314.5 735.6 314.5 570C314.5 404.4 359.249 254.499 431.573 146.013C503.899 37.524 603.762 -29.5 714 -29.5C824.238 -29.5 924.101 37.524 996.427 146.013C1068.75 254.499 1113.5 404.4 1113.5 570Z"
          stroke="url(#paint3_linear_11166_56370)"
        />
        <circle
          cx="714"
          cy="570"
          r="599.5"
          stroke="url(#paint4_linear_11166_56370)"
        />
        <path
          d="M1519.5 571C1519.5 736.493 1430.06 886.356 1285.39 994.864C1140.71 1103.37 940.816 1170.5 720 1170.5C499.184 1170.5 299.292 1103.37 154.615 994.864C9.93777 886.356 -79.5 736.493 -79.5 571C-79.5 405.507 9.93777 255.644 154.615 147.136C299.292 38.6282 499.184 -28.5 720 -28.5C940.816 -28.5 1140.71 38.6282 1285.39 147.136C1430.06 255.644 1519.5 405.507 1519.5 571Z"
          stroke="url(#paint5_linear_11166_56370)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_11166_56370"
          x1="0"
          y1="570.5"
          x2="1440"
          y2="570.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.04" />
          <stop offset="0.495" stopColor="white" stopOpacity="0.2" />
          <stop offset="1" stopColor="white" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_11166_56370"
          x1="714"
          y1="-35"
          x2="714"
          y2="1177"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.515" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_11166_56370"
          x1="714"
          y1="-35.5"
          x2="714"
          y2="1174"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_11166_56370"
          x1="714"
          y1="-35.5"
          x2="714"
          y2="1174"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_11166_56370"
          x1="714"
          y1="-35.5"
          x2="714"
          y2="1174"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_11166_56370"
          x1="720"
          y1="-34.5"
          x2="720"
          y2="1175"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_11166_56370">
          <rect width="1440" height="1140" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Tablet = () => {
  return (
    <svg
      className="hidden md:block lg:hidden"
      viewBox="0 0 1024 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_11446_43085)">
        <line
          x1="-208"
          y1="539.5"
          x2="1232"
          y2="539.5"
          stroke="url(#paint0_linear_11446_43085)"
        />
        <line
          x1="506.5"
          y1="-60"
          x2="506.5"
          y2="1140"
          stroke="url(#paint1_linear_11446_43085)"
        />
        <path
          d="M705.5 540C705.5 705.647 683.119 855.591 646.947 964.106C628.86 1018.37 607.335 1062.24 583.456 1092.54C559.574 1122.84 533.395 1139.5 506 1139.5C478.605 1139.5 452.426 1122.84 428.544 1092.54C404.665 1062.24 383.14 1018.37 365.053 964.106C328.881 855.591 306.5 705.647 306.5 540C306.5 374.353 328.881 224.409 365.053 115.894C383.14 61.6338 404.665 17.7595 428.544 -12.5395C452.426 -42.8442 478.605 -59.5 506 -59.5C533.395 -59.5 559.574 -42.8442 583.456 -12.5395C607.335 17.7595 628.86 61.6338 646.947 115.894C683.119 224.409 705.5 374.353 705.5 540Z"
          stroke="url(#paint2_linear_11446_43085)"
        />
        <path
          d="M905.5 540C905.5 705.6 860.751 855.501 788.427 963.987C716.101 1072.48 616.238 1139.5 506 1139.5C395.762 1139.5 295.899 1072.48 223.573 963.987C151.249 855.501 106.5 705.6 106.5 540C106.5 374.4 151.249 224.499 223.573 116.013C295.899 7.52403 395.762 -59.5 506 -59.5C616.238 -59.5 716.101 7.52403 788.427 116.013C860.751 224.499 905.5 374.4 905.5 540Z"
          stroke="url(#paint3_linear_11446_43085)"
        />
        <circle
          cx="506"
          cy="540"
          r="599.5"
          stroke="url(#paint4_linear_11446_43085)"
        />
        <path
          d="M1311.5 541C1311.5 706.493 1222.06 856.356 1077.39 964.864C932.708 1073.37 732.816 1140.5 512 1140.5C291.184 1140.5 91.2915 1073.37 -53.3854 964.864C-198.062 856.356 -287.5 706.493 -287.5 541C-287.5 375.507 -198.062 225.644 -53.3854 117.136C91.2915 8.6282 291.184 -58.5 512 -58.5C732.816 -58.5 932.708 8.6282 1077.39 117.136C1222.06 225.644 1311.5 375.507 1311.5 541Z"
          stroke="url(#paint5_linear_11446_43085)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_11446_43085"
          x1="-208"
          y1="540.5"
          x2="1232"
          y2="540.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.04" />
          <stop offset="0.495" stopColor="white" stopOpacity="0.2" />
          <stop offset="1" stopColor="white" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_11446_43085"
          x1="506"
          y1="-65"
          x2="506"
          y2="1147"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.515" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_11446_43085"
          x1="506"
          y1="-65.5"
          x2="506"
          y2="1144"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_11446_43085"
          x1="506"
          y1="-65.5"
          x2="506"
          y2="1144"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_11446_43085"
          x1="506"
          y1="-65.5"
          x2="506"
          y2="1144"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_11446_43085"
          x1="512"
          y1="-64.5"
          x2="512"
          y2="1145"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_11446_43085">
          <rect width="1024" height="1080" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Mobile = () => {
  return (
    <svg
      className="md:hidden"
      viewBox="0 0 375 578"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_11475_43965)">
        <line
          x1="-198.319"
          y1="288.732"
          x2="572.348"
          y2="288.732"
          stroke="url(#paint0_linear_11475_43965)"
          strokeWidth="0.535185"
        />
        <line
          x1="184.071"
          y1="-32.1111"
          x2="184.071"
          y2="610.111"
          stroke="url(#paint1_linear_11475_43965)"
          strokeWidth="0.535185"
        />
        <path
          d="M290.573 289C290.573 377.652 278.595 457.9 259.236 515.975C249.557 545.015 238.036 568.495 225.257 584.711C212.475 600.93 198.465 609.844 183.804 609.844C169.142 609.844 155.132 600.93 142.35 584.711C129.571 568.495 118.051 545.015 108.371 515.975C89.0123 457.9 77.0342 377.652 77.0342 289C77.0342 200.348 89.0123 120.101 108.371 62.0248C118.051 32.9855 129.571 9.50464 142.35 -6.71095C155.132 -22.9296 169.142 -31.8435 183.804 -31.8435C198.465 -31.8435 212.475 -22.9296 225.257 -6.71095C238.036 9.50464 249.557 32.9855 259.236 62.0248C278.595 120.101 290.573 200.348 290.573 289Z"
          stroke="url(#paint2_linear_11475_43965)"
          strokeWidth="0.535185"
        />
        <path
          d="M397.61 289C397.61 377.627 373.661 457.851 334.954 515.911C296.246 573.973 242.801 609.844 183.804 609.844C124.806 609.844 71.3611 573.973 32.6532 515.911C-6.05342 457.851 -30.0027 377.627 -30.0027 289C-30.0027 200.373 -6.05342 120.149 32.6532 62.0886C71.3611 4.02678 124.806 -31.8435 183.804 -31.8435C242.801 -31.8435 296.246 4.02678 334.954 62.0886C373.661 120.149 397.61 200.373 397.61 289Z"
          stroke="url(#paint3_linear_11475_43965)"
          strokeWidth="0.535185"
        />
        <circle
          cx="183.804"
          cy="289"
          r="320.844"
          stroke="url(#paint4_linear_11475_43965)"
          strokeWidth="0.535185"
        />
        <path
          d="M614.895 289.535C614.895 378.104 567.03 458.309 489.601 516.381C412.172 574.453 305.192 610.379 187.015 610.379C68.8373 610.379 -38.1421 574.453 -115.571 516.381C-193 458.309 -240.866 378.104 -240.866 289.535C-240.866 200.966 -193 120.761 -115.571 62.6894C-38.1421 4.61769 68.8373 -31.3083 187.015 -31.3083C305.192 -31.3083 412.172 4.61769 489.601 62.6894C567.03 120.761 614.895 200.966 614.895 289.535Z"
          stroke="url(#paint5_linear_11475_43965)"
          strokeWidth="0.535185"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_11475_43965"
          x1="-198.319"
          y1="289.5"
          x2="572.348"
          y2="289.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.04" />
          <stop offset="0.495" stopColor="white" stopOpacity="0.2" />
          <stop offset="1" stopColor="white" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_11475_43965"
          x1="183.804"
          y1="-34.787"
          x2="183.804"
          y2="613.857"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.515" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_11475_43965"
          x1="183.804"
          y1="-35.0546"
          x2="183.804"
          y2="612.252"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_11475_43965"
          x1="183.804"
          y1="-35.0546"
          x2="183.804"
          y2="612.252"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_11475_43965"
          x1="183.804"
          y1="-35.0546"
          x2="183.804"
          y2="612.252"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_11475_43965"
          x1="187.015"
          y1="-34.5194"
          x2="187.015"
          y2="612.787"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.47" stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_11475_43965">
          <rect
            width="548.03"
            height="578"
            fill="white"
            transform="translate(-87)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
