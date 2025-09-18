"use client";

import { useAccount } from "wagmi";

import { AppLoginButton } from "@brother-terminal/components/app/app-login-button";

import { DepositUSDCButton } from "../deposit-usdc-button";
import { WithdrawUSDCButton } from "../withdraw-usdc-button";
import { Skeleton } from "@brother-terminal/components/ui/skeleton";

export const MarketOrderActions = () => {
  const { isConnected } = useAccount();

  if (!isConnected) return <AppLoginButton>Connect</AppLoginButton>;
  return (
    <div className="flex flex-col gap-2">
      <DepositUSDCButton />
      <WithdrawUSDCButton />
    </div>
  );
};
