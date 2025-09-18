"use client";

import { forwardRef } from "react";

import { cn } from "@brother-terminal/lib/utils";

interface ForwardRefComponent<T, P = unknown>
  extends React.ForwardRefExoticComponent<P & React.RefAttributes<T>> {
  Item: typeof AppListItem;
}

export const AppList = forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ ...props }, ref) => {
  return (
    <ul
      ref={ref}
      {...props}
      className={cn("flex flex-col gap-1.5", props.className)}
    />
  );
}) as ForwardRefComponent<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>;
AppList.displayName = "AppList";

type AppListItemProps = React.HTMLAttributes<HTMLLIElement> & {
  highlight?: boolean;
  label: string;
  value: string;
};

const AppListItem = forwardRef<HTMLLIElement, AppListItemProps>(
  function AppListItem({ highlight, label, value, ...props }, ref) {
    return (
      <li
        ref={ref}
        {...props}
        className={cn(
          "flex items-center justify-between",
          highlight &&
            (parseFloat(value.replace(/[^\d.-]/g, "")) > 0
              ? "text-primary"
              : "text-danger"),
          props.className
        )}
      >
        <p className="text-white-48">{label}</p>
        <div>{value}</div>
      </li>
    );
  }
) as ForwardRefComponent<HTMLLIElement, AppListItemProps>;
AppListItem.displayName = "AppListItem";

AppList.Item = AppListItem;
