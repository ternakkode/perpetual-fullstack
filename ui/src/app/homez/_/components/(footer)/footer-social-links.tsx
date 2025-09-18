import { cn } from "@brother-terminal/lib/utils";
import Link from "next/link";

export const FooterSocialLinks = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-[11px]", className)}>
      <Link href="https://x.com/brother_terminal">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_11512_36015"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="2"
            y="2"
            width="20"
            height="20"
          >
            <path d="M2 2H22V22H2V2Z" fill="white" />
          </mask>
          <g mask="url(#mask0_11512_36015)">
            <path
              d="M17.75 2.93701H20.8171L14.1171 10.6142L22 21.0627H15.8286L10.9914 14.727L5.46286 21.0627H2.39286L9.55857 12.8484L2 2.93844H8.32857L12.6943 8.72844L17.75 2.93701ZM16.6714 19.2227H18.3714L7.4 4.6813H5.57714L16.6714 19.2227Z"
              fill="#2FB7A5"
            />
          </g>
        </svg>
      </Link>
      <Link href="https://discord.gg/nTKtC2A3EY">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4C14.85 4.29 14.68 4.69 14.55 5.01C12.98 4.78 11.41 4.78 9.87 5.01C9.74 4.69 9.57 4.29 9.42 4C7.91 4.26 6.47 4.71 5.14 5.33C2.36 9.56 1.61 13.68 2 17.87C3.77 19.19 5.49 20 7.18 20.51C7.57 19.97 7.92 19.39 8.22 18.78C7.58 18.54 6.96 18.23 6.38 17.86C6.51 17.76 6.64 17.67 6.76 17.57C10.27 19.22 14.11 19.22 17.57 17.57C17.7 17.67 17.82 17.76 17.95 17.86C17.36 18.23 16.74 18.54 16.11 18.78C16.41 19.39 16.75 19.97 17.15 20.51C18.84 20 20.56 19.19 22.33 17.87C22.79 13.06 21.62 8.98 19.27 5.33ZM8.68 15.42C7.65 15.42 6.79 14.46 6.79 13.27C6.79 12.08 7.62 11.12 8.68 11.12C9.74 11.12 10.6 12.08 10.57 13.27C10.57 14.46 9.74 15.42 8.68 15.42ZM15.65 15.42C14.62 15.42 13.76 14.46 13.76 13.27C13.76 12.08 14.59 11.12 15.65 11.12C16.71 11.12 17.57 12.08 17.54 13.27C17.54 14.46 16.71 15.42 15.65 15.42Z"
            fill="#2FB7A5"
          />
        </svg>
      </Link>
    </div>
  );
};
