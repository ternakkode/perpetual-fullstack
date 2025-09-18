import Image from "next/image";

import { cn } from "@brother-terminal/lib/utils";

import Icon from "../../../public/logo/icon.png";

export const Logo: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ ...props }) => {
  return (
    <Image
      alt="Logo"
      className={cn("relative inline-block", props.className)}
      priority
      src={Icon}
    />
  );
};
