"use client";

import { InfoCircle } from "@untitled-ui/icons-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@brother-terminal/components/ui/dialog";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@brother-terminal/components/ui/tooltip";
import { useMediaQuery } from "@brother-terminal/hooks/use-media-query";

export const LeverageInformation = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Content = () => (
    <p className="text-white-72 md:text-white">
      The leverage is set to <span className="text-primary">3x</span> by default
      and cannot be changed, but this is displayed for your reference.
    </p>
  );

  if (isDesktop) {
    return (
      <TooltipProvider>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger>
            <InfoCircle className="size-3 text-white-48" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[200px]" side="left">
            {Content()}
            <TooltipArrow className="fill-tooltips" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <InfoCircle className="size-3 text-white-48" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leverage</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        {Content()}
      </DialogContent>
    </Dialog>
  );
};
