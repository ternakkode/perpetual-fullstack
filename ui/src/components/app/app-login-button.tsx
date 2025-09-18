"use client";

import { forwardRef } from "react";

import { Button } from "@brother-terminal/components/ui/button";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const AppLoginButton = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ ...props }, ref) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (isConnected) return null;
  
  return (
    <Button ref={ref} {...props} onClick={openConnectModal}>
      {props.children || "Connect Wallet"}
    </Button>
  );
});
AppLoginButton.displayName = "AppLoginButton";
