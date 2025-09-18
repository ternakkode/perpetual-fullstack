import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@brother-terminal/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2.5 w-auto h-auto rounded-lg",
    "font-medium text-sm transition whitespace-nowrap border",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:opacity-80 border-transparent text-primary-foreground",
        destructive:
          "bg-danger hover:opacity-80 border-transparent text-white dark:text-background",
        secondary: "bg-white-4 hover:bg-white-8",
        outline:
          "bg-transparent hover:bg-primary border-primary text-primary hover:text-white dark:hover:text-background",
        ghost: "border-transparent",
      },
      size: {
        default: "py-2.5 px-4 h-9",
        sm: "py-2 px-3 h-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
