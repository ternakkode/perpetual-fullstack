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
import { useMediaQuery } from "@brother-terminal/hooks/use-media-query";
import { BlockInput } from "@brother-terminal/components/ui/block-input";
import { NumericInput } from "../../core/numeric-input";

export const WithdrawUSDCButton = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Withdraw USDC</Button>
        </DialogTrigger>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center">
              Withdraw USDC
            </DialogTitle>
            <DialogDescription className="sr-only" />
          </DialogHeader>
          <WithdrawForm />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Withdraw</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Withdraw USDC</Button>
      </DrawerTrigger>
      <DrawerContent className="h-auto pb-10">
        <DrawerHeader>
          <div className="relative">
            <DrawerTitle className="text-center">Withdraw USDC</DrawerTitle>
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
          <WithdrawForm />
          <div className="flex flex-col gap-2 mt-4">
            <DrawerClose asChild>
              <Button>Withdraw</Button>
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

const WithdrawForm = () => {
  return (
    <div className="flex flex-col gap-3">
      <BlockInput
        label="Amount"
        addons={
          <span className="text-white-48">
            Available: <span className="text-white font-medium">909.56</span>{" "}
            USDC
          </span>
        }
      >
        <NumericInput
          className="flex-1 !text-md"
          opts={{ digits: 2, rightAlign: false }}
          placeholder="Enter Amount"
        />
        <button className="text-primary font-medium md:text-xs">MAX</button>
      </BlockInput>
      <BlockInput label="Destination Address">
        <input
          className="placeholder:text-white-32 text-md outline-none bg-transparent"
          placeholder="Enter Arbitrum Address"
        />
      </BlockInput>
      <p className="flex items-center gap-1 text-white-48 text-xs">
        <InfoCircle className="size-3" />
        Withdrawals should arrive within 5 minutes.
      </p>
    </div>
  );
};
