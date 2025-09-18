"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@brother-terminal/components/ui/dialog";
import { Token } from "@brother-terminal/components/ui/token";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@brother-terminal/components/ui/tooltip";
import { useMediaQuery } from "@brother-terminal/hooks/use-media-query";

interface AssetsTooltipProps {
  children: React.ReactNode;
  position: {
    assets: {
      base: Array<{ token: string }>;
      quote: Array<{ token: string }>;
    };
  };
}

export const AssetsTooltip = ({ children, position }: AssetsTooltipProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Content = () => {
    return (
      <div className="md:w-[200px] flex flex-col gap-1.5 text-sm">
        <div className="flex-1 grid grid-cols-3">
          <p className="text-white-48">Asset</p>
          <p className="text-white-48 text-right">Current</p>
          <p className="text-white-48 text-right">Initial</p>
        </div>
        <div className="grid grid-cols-3">
          <Token
            className="text-sm"
            pairs={position.assets.base.map((asset) => asset.token)}
            size="!size-4"
          />
          <p className="text-right">60%</p>
          <p className="text-right">(50%)</p>
        </div>
        <div className="grid grid-cols-3">
          <Token
            className="text-sm"
            pairs={position.assets.quote.map((asset) => asset.token)}
            size="!size-4"
          />
          <p className="text-right">60%</p>
          <p className="text-right">(50%)</p>
        </div>
      </div>
    );
  };

  if (isDesktop) {
    return (
      <TooltipProvider>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent side="bottom">
            {Content()}
            <TooltipArrow className="fill-tooltips" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assets</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        {Content()}
      </DialogContent>
    </Dialog>
  );
};
