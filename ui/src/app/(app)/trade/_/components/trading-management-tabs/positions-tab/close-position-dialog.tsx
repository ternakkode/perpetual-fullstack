"use client";

import { InfoCircle, XClose } from "@untitled-ui/icons-react";
import { useState } from "react";

import { Button } from "@brother-terminal/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@brother-terminal/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@brother-terminal/components/ui/drawer";
import { Token } from "@brother-terminal/components/ui/token";
import { useMediaQuery } from "@brother-terminal/hooks/use-media-query";

import { PositionData } from "../../../interfaces/positions";
import { formatPrice } from "../../../utils/price-utils";

interface ClosePositionDialogProps {
  children: React.ReactNode;
  position: PositionData;
}

export const ClosePositionDialog = ({
  children,
  position,
}: ClosePositionDialogProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center">
              <InfoCircle className="size-4 mr-1.5" />
              Confirm Close Position
            </DialogTitle>
            <DialogDescription className="sr-only" />
          </DialogHeader>
          <ClosePosition position={position} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Close Position</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-auto pb-10">
        <DrawerHeader>
          <div className="relative">
            <button
              aria-label="Close Drawer"
              className="absolute left-0 top-1/2 -translate-y-1/2"
            >
              <InfoCircle className="size-5 text-white-48" />
            </button>
            <DrawerTitle className="text-center">
              Confirm Close Position
            </DrawerTitle>
            <DrawerDescription className="sr-only" />
            <DrawerClose
              asChild
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <button aria-label="Close Drawer">
                <XClose className="size-5 text-white-48" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-4">
          <ClosePosition position={position} />
          <div className="flex flex-col gap-2 mt-4">
            <DrawerClose asChild>
              <Button>Close Position</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const ClosePosition = ({ position }: { position: PositionData }) => {
  return (
    <div className="bg-white-4 flex flex-col gap-3 p-4 rounded-lg text-md font-medium">
      <div className="flex items-center justify-between">
        <p className="text-white-48">Asset</p>
        <Token
          className="font-medium"
          pairs={[
            ...position.assets.base.map((asset) => asset.token),
            ...position.assets.quote.map((asset) => asset.token),
          ]}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-white-48">Size</p>
        <div className={position.size > 0 ? "text-primary" : "text-danger"}>
          {position.size > 0 ? "+" : "-"}
          {position.size}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-white-48">Value</p>
        {formatPrice(position.value, {
          style: "currency",
          currencyDisplay: "symbol",
        })}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-white-48">PnL</p>
        <div className="flex items-center gap-1.5">
          {formatPrice(position.pnl.value, {
            style: "currency",
            currencyDisplay: "symbol",
          })}
          <p
            className={
              position.pnl.percentage > 0 ? "text-primary" : "text-danger"
            }
          >
            ({position.pnl.percentage}%)
          </p>
        </div>
      </div>
    </div>
  );
};
