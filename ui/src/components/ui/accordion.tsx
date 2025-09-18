"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus as MinusIcon, Plus as PlusIcon } from "@untitled-ui/icons-react";

import { cn } from "@brother-terminal/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "relative rounded-xl border overflow-hidden transition-all",
      "border-white-8 bg-white-4",
      "data-[state=open]:border-primary data-[state=open]:bg-primary-base",
      "[&[data-state=open]>.overlay]:opacity-100 [&[data-state=open]>.overlay]:animate-fade-in",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex-1 flex items-center justify-between gap-4 py-6 px-8 text-lg font-medium text-left",
        "[&_svg]:size-5 [&_svg]:absolute [&_svg]:inset-0 [&_svg]:shrink-0 [&_svg]:transition-all [&_svg]:duration-200",
        "[&[data-state=closed]_svg]:text-white-48 [&[data-state=open]_svg]:text-primary",
        "[&[data-state=closed]_svg.plus]:rotate-0",
        "[&[data-state=open]_svg.plus]:rotate-90 [&[data-state=open]_svg.plus]:opacity-0",
        "[&[data-state=closed]_svg.minus]:-rotate-90 [&[data-state=closed]_svg.minus]:opacity-0",
        "[&[data-state=open]_svg.minus]:rotate-0",
        className
      )}
      {...props}
    >
      {children}
      <span className="relative shrink-0 size-5">
        <PlusIcon className="plus" />
        <MinusIcon className="minus" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "relative z-[1] transition-[height] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    )}
    {...props}
  >
    <div className={cn("px-8 pb-6 text-md text-white-64", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
