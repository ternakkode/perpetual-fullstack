"use client";

import { Button } from "@brother-terminal/components/ui/button";
import { Wallet01 } from "@untitled-ui/icons-react";
import { cn } from "@brother-terminal/lib/utils";
import type { Side } from "./trade-direction-selector";

interface OrderSubmitButtonProps {
  side: Side;
  isConnected: boolean;
  isAgentWalletReady: boolean;
  agentWalletLoading: boolean;
  isSubmittingOrder: boolean;
  orderSizeValid: boolean;
  orderSize: string;
  onConnectWallet: () => void;
  onEnableTrading: () => void;
  onSubmitOrder: () => void;
}

export function OrderSubmitButton({
  side,
  isConnected,
  isAgentWalletReady,
  agentWalletLoading,
  isSubmittingOrder,
  orderSizeValid,
  orderSize,
  onConnectWallet,
  onEnableTrading,
  onSubmitOrder
}: OrderSubmitButtonProps) {
  return (
    <div style={{ marginTop: "100px" }}>
      <Button
        className={cn(
          "w-full h-11 sm:h-9 text-sm font-medium",
          isConnected && isAgentWalletReady
            ? side === "buy"
              ? "bg-emerald-500 hover:bg-emerald-600 border-transparent"
              : "bg-red-500 hover:bg-red-600 text-white border-transparent"
            : isConnected && !isAgentWalletReady
            ? "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent"
            : ""
        )}
        disabled={
          (isConnected && isAgentWalletReady && (!orderSizeValid || !orderSize || parseFloat(orderSize) <= 0)) ||
          agentWalletLoading || isSubmittingOrder
        }
        onClick={() => {
          if (!isConnected) {
            onConnectWallet();
          } else if (!isAgentWalletReady) {
            onEnableTrading();
          } else {
            onSubmitOrder();
          }
        }}
      >
        {!isConnected ? (
          <span className="inline-flex items-center gap-2">
            <Wallet01 className="size-4" /> Connect Wallet
          </span>
        ) : !isAgentWalletReady ? (
          agentWalletLoading ? (
            <span className="inline-flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full"></div>
              Loading...
            </span>
          ) : (
            "Enable Trading"
          )
        ) : isSubmittingOrder ? (
          <span className="inline-flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full"></div>
            Submitting...
          </span>
        ) : (
          side === "buy" ? "Place Buy Order" : "Place Sell Order"
        )}
      </Button>
    </div>
  );
}