import Link from "next/link";

import { Logo } from "@brother-terminal/components/ui/logo";

export const FooterLogo = () => {
  return (
    <div className="flex-1 flex justify-start">
      <Link href="/">
        <Logo className="w-[112px] h-10" />
      </Link>
    </div>
  );
};
