"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";

import { Button } from "@brother-terminal/components/ui/button";
import { useToaster } from "@brother-terminal/components/ui/sonner";
import { Skeleton } from "@brother-terminal/components/ui/skeleton";
import { PositionType } from "../../../../interfaces/trading";

export const PlaceOrderButton = ({
  positionType,
  onOrderPlaced,
}: {
  positionType: PositionType;
  onOrderPlaced: () => void;
}) => {
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toaster = useToaster();

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const placeOrderHandler = useCallback(() => {
    setIsLoading(true);
    sleep(2000).then(() => {
      onOrderPlaced();
      setIsLoading(false);
      toaster.success("SOL bought at average price $132.81");
    });
  }, [toaster, onOrderPlaced]);

  if (!isConnected) return null;
  return (
    <Button
      disabled={isLoading}
      onClick={placeOrderHandler}
      variant={positionType === "long" ? "default" : "destructive"}
    >
      Place Order
      {isLoading && (
        <motion.div
          className="ml-2 w-4 h-4 border-2 border-transparent border-t-current rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
    </Button>
  );
};
