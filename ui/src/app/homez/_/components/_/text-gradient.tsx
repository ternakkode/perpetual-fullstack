import { Slot } from "@radix-ui/react-slot";

import { cn } from "@brother-terminal/lib/utils";

export const TextGradient: React.FC<
  React.HTMLAttributes<
    HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement
  > & {
    asChild?: boolean;
  }
> = ({ asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "p";
  return (
    <Comp
      {...props}
      className={cn(props.className, "bg-clip-text")}
      style={{ WebkitTextFillColor: "transparent" }}
    />
  );
};
