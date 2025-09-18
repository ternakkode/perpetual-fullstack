"use client";

import { Wallet02 } from "@untitled-ui/icons-react";

import { LeverageInformation } from "./leverage-information";

export const AvailableBalanceInformation = () => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-1 text-white-48">
        <Wallet02 className="size-3" />
        <p>Available Balance</p>
      </div>
      <div className="flex items-center gap-1">
        <p>
          <span className="font-medium">99,464</span>{" "}
          <span className="text-white-48">USDC</span>{" "}
          <span className="text-primary">3x</span>
        </p>
        <LeverageInformation />
      </div>
    </div>
  );
};
