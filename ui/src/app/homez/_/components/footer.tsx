import Link from "next/link";

import { Logo } from "@brother-terminal/components/ui/logo";
import { Separator } from "@brother-terminal/components/ui/separator";

import { FooterSocialLinks } from "./(footer)/footer-social-links";

export const Footer = () => {
  return (
    <footer className="container mx-auto flex flex-col gap-8 md:gap-16 py-8 px-4 md:py-20 md:px-14 lg:px-[120px]">
      <div className="flex flex-col md:flex-row md:justify-between gap-8">
        <div className="flex items-center justify-between h-10">
          <Link aria-label="Back to Home" className="-translate-x-4" href="/">
            <Logo className="w-[112px] invert" />
          </Link>
          <FooterSocialLinks className="md:hidden" />
        </div>
        <p className="text-md font-medium text-center">
          Contact:{" "}
          <a 
            href="mailto:help@brother-terminal.xyz" 
            className="underline text-primary hover:text-primary/80 transition-colors"
          >
            help@brother-terminal.xyz
          </a>
        </p>
      </div>
      <div className="flex flex-col gap-6 md:gap-8">
        <Separator />
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0 md:justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-sm text-white-64 text-center">
              Copyright &copy; {new Date().getFullYear()} Brother Terminal. All rights
              reserved
            </p>
            <div className="flex items-center gap-4 text-sm text-white-64">
              <Link href="/privacyPolicy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Use
              </Link>
              <a href="https://brother-terminal.gitbook.io/brother-terminal" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Docs
              </a>
            </div>
          </div>
          <FooterSocialLinks className="hidden md:flex" />
        </div>
      </div>
    </footer>
  );
};
