import { cn } from "@brother-terminal/lib/utils";

export const BentoHeader = ({
  children,
  className,
  message,
  title,
}: {
  children?: React.ReactNode;
  className?: string;
  message: string;
  title: string;
}) => {
  return (
    <header
      className={cn(
        "flex flex-col items-start gap-3 md:gap-4 p-6 md:p-10",
        className
      )}
    >
      {children}
      <h3 className="text-h6 md:text-h5 lg:text-h4 font-semibold">{title}</h3>
      <p className="text-md lg:text-lg text-white-64">{message}</p>
    </header>
  );
};
