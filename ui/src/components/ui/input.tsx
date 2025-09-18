import * as React from "react";

import { cn } from "@brother-terminal/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full h-10 rounded-lg py-3 px-4 text-lg md:text-md placeholder:text-white-32",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline-none dark:focus-visible:border-primary dark:focus-visible:bg-primary-base",
          "border dark:border-white-8 dark:bg-white-4",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
