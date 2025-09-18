import { cn } from "@brother-terminal/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white-4", className)}
      {...props}
    />
  );
}

export { Skeleton };
