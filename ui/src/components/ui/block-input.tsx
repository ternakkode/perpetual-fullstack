"use client";

import React from "react";

import { cn } from "@brother-terminal/lib/utils";

interface InputLabelProps extends React.ComponentProps<"div"> {
  addons?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

export const BlockInput = React.forwardRef<HTMLInputElement, InputLabelProps>(
  ({ addons, children, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border p-3 flex flex-col gap-1.5 bg-white-4 focus-within:bg-primary-base focus-within:border-primary transition-colors",
          props.className
        )}
        {...props}
      >
        <header className="flex items-center justify-between">
          <p className="text-sm text-white-48">{label}</p>
          {addons}
        </header>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    );
  }
);
BlockInput.displayName = "BlockInput";
