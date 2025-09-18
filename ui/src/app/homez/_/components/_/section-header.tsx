import { cn } from "@brother-terminal/lib/utils";

export const SectionHeader: React.FC<
  Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
    title: React.ReactNode;
    message: React.ReactNode;
  }
> = ({ message, title, ...props }) => {
  return (
    <header {...props} className={cn("flex flex-col gap-4", props.className)}>
      <h2 className="text-h4 md:text-h3 font-semibold md:font-bold text-center">
        {title}
      </h2>
      <p className="text-md md:text-lg text-white-64 text-center">{message}</p>
    </header>
  );
};
