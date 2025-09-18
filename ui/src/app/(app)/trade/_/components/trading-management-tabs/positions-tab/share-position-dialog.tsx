"use client";

import {
  Download01 as DownloadIcon,
  Send03 as SendIcon,
  XClose,
} from "@untitled-ui/icons-react";
import { useMemo, useRef, useState } from "react";
import { useToImage } from "@brother-terminal/hooks/use-to-image";

import { Button } from "@brother-terminal/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { TextGradient } from "@/app/homez/_/components/_/text-gradient";
import { Token } from "@brother-terminal/components/ui/token";
import { cn, formatPriceToOptimalDecimals } from "@brother-terminal/lib/utils";
import { useMediaQuery } from "@brother-terminal/hooks/use-media-query";

import { PositionData } from "../../../interfaces/positions";

interface SharePositionDialogProps {
  position: PositionData;
  trigger: React.ReactNode;
}

export const SharePositionDialog = ({
  position,
  trigger,
}: SharePositionDialogProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{trigger}</DialogTrigger>
        <DialogContent className="md:w-[720px] lg:w-[1000px] md:max-w-none">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
            <DialogDescription className="sr-only" />
          </DialogHeader>
          <SharePosition position={position} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{trigger}</DrawerTrigger>
      <DrawerContent className="h-auto pb-10">
        <DrawerHeader>
          <div className="relative">
            <DrawerTitle className="text-center">Share</DrawerTitle>
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
          <SharePosition position={position} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const SharePosition = ({ position }: { position: PositionData }) => {
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const isShort = useMemo(() => position.size < 0, [position.size]);
  const isNegative = useMemo(
    () => position.pnl.percentage < 0,
    [position.pnl.percentage]
  );

  const imageToDownload = isNegative
    ? "/pnl-down-image.png"
    : "/pnl-up-image.png";

  const [state, generateImage, ref] = useToImage({
    quality: 0.8,
    format: "png",
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.download = "position-share.png";
      link.href = data;
      link.click();
    },
  });

  const handleShareNow = () => {
    const message = messageRef.current?.value || "";
    const encodedMessage = encodeURIComponent(message);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="grid lg:grid-cols-[680px_1fr] gap-4 md:gap-5">
      <figure
        ref={ref}
        className="relative lg:w-[680px] lg:h-[420px] rounded-lg border overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Share"
          className="w-full h-full object-cover"
          src={imageToDownload}
        />
        <div className="z-10 absolute left-1/2 top-14 md:top-28 -translate-x-1/2">
          <div className="flex flex-col gap-3 md:gap-10">
            <div className="flex flex-col gap-1.5 md:gap-3">
              <div className="flex flex-col gap-2.5 md:gap-5">
                <div
                  className={cn(
                    "w-auto h-3 md:h-6 self-center flex items-center justify-center px-1 md:px-2 rounded",
                    isNegative ? "bg-danger" : "bg-primary"
                  )}
                >
                  <p className={cn(
                    "text-[6px] md:text-sm font-medium uppercase",
                    isNegative ? "text-white" : "text-primary-foreground"
                  )}>
                    {isShort ? "Short" : "Long"} 3x
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1.5 md:gap-3">
                  <Token
                    className="text-xs md:text-xl font-medium"
                    pairs={position.assets.base.map((asset) => asset.token)}
                    size="!size-3 md:!size-6"
                  />
                  <p className="text-xs md:text-xl font-medium uppercase">/</p>
                  <Token
                    className="text-xs md:text-xl font-medium"
                    pairs={position.assets.quote.map((asset) => asset.token)}
                    size="!size-3 md:!size-6"
                  />
                </div>
              </div>
              <TextGradient
                className={cn(
                  "text-center text-h6 md:text-h2 font-bold",
                  isNegative
                    ? "bg-[linear-gradient(92.96deg,#FFB7BD_6.46%,#FF6875_105.04%)]"
                    : "bg-[linear-gradient(92.96deg,#96DCD3_6.46%,#2CCBB6_105.04%)]"
                )}
              >
                {position.pnl.percentage.toFixed(2)}%
              </TextGradient>
            </div>
            <div className="flex gap-4 justify-center">
              <div className="flex flex-col gap-px md:gap-0.5 text-center">
                <p className="text-[8px] md:text-sm text-white-48">
                  Entry Price
                </p>
                <p className="text-xs md:text-md font-medium">
                  {formatPriceToOptimalDecimals(position.entry_price)}
                </p>
              </div>
              <div className="flex flex-col gap-px md:gap-0.5 text-center">
                <p className="text-[8px] md:text-sm text-white-48">
                  Mark Price
                </p>
                <p className="text-xs md:text-md font-medium">
                  {formatPriceToOptimalDecimals(position.market_price)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-white-8 h-3 md:h-6 flex items-center justify-center">
          <p
            className={cn(
              "text-[6px] md:text-sm",
              isNegative ? "text-danger" : "text-primary"
            )}
          >
            brother-terminal.xyz
          </p>
        </div>
      </figure>
      <div className="flex flex-col md:flex-row lg:flex-col gap-4">
        <div className="w-full md:max-w-[400px] lg:max-w-none min-h-[140px] flex flex-col rounded-lg border p-3 gap-1.5 bg-white-4">
          <label className="text-sm text-white-48" htmlFor="message">
            Your Message
          </label>
          <textarea
            ref={messageRef}
            className="text-md font-medium outline-none bg-transparent flex-1 resize-none"
            defaultValue={`Just ${
              position.pnl.value > 0 ? "made" : "lost"
            } ${Math.abs(position.pnl.percentage).toFixed(2)}% on my ${[
              ...position.assets.base,
              ...position.assets.quote,
            ].join(
              "/"
            )} position with @BrotherTerminal! Trade exotic pairs powered by @HyperliquidX and track your performance in real-time. Join me at brother-terminal.xyz 🚀`}
            name="message"
          />
        </div>
        <div className="md:flex-1 flex flex-row md:flex-col gap-2">
          <Button
            className="flex-1 md:flex-initial"
            disabled={state.isLoading}
            variant="outline"
            onClick={generateImage}
          >
            <DownloadIcon className="size-4" />
            Save Image
          </Button>
          <Button
            className="flex-1 md:flex-initial"
            disabled={state.isLoading}
            variant="outline"
            onClick={handleShareNow}
          >
            <SendIcon className="size-4" />
            Share Now
          </Button>
        </div>
      </div>
    </div>
  );
};
