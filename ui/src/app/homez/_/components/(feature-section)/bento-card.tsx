import { cn } from "@brother-terminal/lib/utils";

export const BentoCard = ({
  children,
  className,
  decoration,
}: {
  children: React.ReactNode;
  className?: string;
  decoration?: React.ReactNode;
}) => {
  return (
    <div className="group relative rounded-2xl bg-[#FFFFFF0F] overflow-hidden">
      <div className={cn("opacity-0 pointer-events-none", className)}>
        {children}
      </div>
      <div className="absolute inset-0 w-full h-full rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_50.5%,rgba(255,255,255,0.12)_100%)]" />
      <div
        className={cn("absolute inset-px rounded-2xl bg-[#1D282C]", className)}
      >
        {children}
      </div>
      {decoration}
    </div>
  );
};
