import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

import { cn } from "@brother-terminal/lib/utils";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    variant?: "default" | "light";
  }
>(({ asChild = false, className, variant = "default", ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "flex items-center justify-center rounded-lg border py-2.5 px-4 font-medium text-sm text-background hover:opacity-80 transition-opacity",
        variant === "default" ? "border-white/20" : "border-white/80",
        className
      )}
      style={{
        background:
          variant === "default"
            ? "radial-gradient(47.5% 62.53% at 29.71% 8.75%, #97E1D7 0%, #2AA292 100%)"
            : "radial-gradient(47.5% 62.53% at 29.71% 8.75%, #EEF8F7 0%, #CBEEEA 100%)",
      }}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
