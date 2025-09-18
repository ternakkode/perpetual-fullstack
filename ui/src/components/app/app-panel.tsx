import { forwardRef } from "react";

import { cn } from "@brother-terminal/lib/utils";

export const AppPanel = forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
    render: React.ReactNode;
  }
>(({ render, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "w-full bg-card border border-border px-3 py-5 rounded-lg shadow-sm",
        props.className
      )}
    >
      {render}
    </div>
  );
});
AppPanel.displayName = "AppPanel";
