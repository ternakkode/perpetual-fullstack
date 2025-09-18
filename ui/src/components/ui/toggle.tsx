"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@brother-terminal/lib/utils";

const toggleVariants = cva(
  [
    "flex items-center w-auto h-full rounded-md p-1.5 gap-1.5",
    "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "bg-transparent text-white-48 transition-colors",
    "data-[state=on]:pointer-events-none",
    "data-[state=off]:hover:bg-white-4",
    "data-[state=on]:bg-white-16 data-[state=on]:text-white",
    "[&[data-state=off]_svg]:fill-white-32 [&[data-state=on]_svg]:fill-white",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: { default: null },
      size: { default: null },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
