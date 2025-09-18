import { cn } from "@brother-terminal/lib/utils";

export const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative rounded-full bg-[#193E3E] overflow-hidden">
      <div className={cn("opacity-0 pointer-events-none", className)}>
        {children}
      </div>

      <div className="absolute inset-0 w-full h-full rounded-full bg-[linear-gradient(259.02deg,_rgba(255,_255,_255,_0.12)_4.09%,_rgba(255,_255,_255,_0)_25.61%,_rgba(255,_255,_255,_0)_84.13%,_rgba(255,_255,_255,_0.12)_99.25%)]" />

      <div
        className={cn(
          "absolute inset-px w-full h-full rounded-full bg-[#193E3E]",
          className
        )}
      >
        {children}
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
