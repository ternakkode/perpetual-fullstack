import Link from "next/link";

import { Logo } from "@brother-terminal/components/ui/logo";

import { LaunchAppButton } from "./_/launch-app-button";
// import { MenuButton } from "./_/menu-button";
// import { links } from "./_/_links";

export const Header = () => {
  return (
    <header className="container mx-auto relative z-[1] w-full flex items-center justify-between px-4 py-3 md:px-14 md:py-10">
      <Link aria-label="Back to Home" className="-translate-x-4" href="/">
        <Logo className="w-[90px] md:w-[112px] invert" />
      </Link>
      {/* <nav className="hidden md:flex items-center justify-center gap-10 flex-1">
        {[...links].splice(1).map((link) => (
          <Link
            key={link.href}
            className="text-md text-white hover:text-primary transition-colors"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav> */}
      <div className="flex items-center gap-2">
        <LaunchAppButton />
        {/* <MenuButton /> */}
      </div>
    </header>
  );
};
