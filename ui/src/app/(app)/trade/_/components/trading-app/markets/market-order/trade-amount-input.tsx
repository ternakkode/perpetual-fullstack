"use client";

import { InfoCircle } from "@untitled-ui/icons-react";
import { useCallback, useState } from "react";

import { formatPrice } from "../../../../utils/price-utils";

import { NumericInput } from "../../core/numeric-input";

interface TradeAmountControls {
  assetNames: string[];
  coinWithInterestCap: string[];
  minimumLimit: number;
  percentage: number;
  userBalance: number;
}

interface TradeAmountInputProps extends TradeAmountControls {
  size: number;
  onSizeChanged: (size: number) => void;
}

export const TradeAmountInput = ({
  assetNames,
  coinWithInterestCap,
  minimumLimit,
  percentage,
  size,
  userBalance,
  onSizeChanged,
}: TradeAmountInputProps) => {
  const [errorType, setErrorType] = useState<ErrorType | undefined>();

  const changeSizeHandler = useCallback(
    (value: number) => {
      let error: ErrorType | undefined;

      if (coinWithInterestCap.length > 0) error = "interestCap";
      else if (value < minimumLimit) error = "belowMinimum";

      setErrorType(error);
      onSizeChanged(value);
    },
    [coinWithInterestCap.length, minimumLimit, onSizeChanged]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between p-3 rounded-lg bg-white-4 border">
        <p className="text-white-48">Size</p>
        <div className="flex items-center gap-1.5">
          <NumericInput
            className="!text-md font-medium"
            defaultValue={size}
            mask="currency"
            opts={{ digits: 0, prefix: undefined }}
            onChange={changeSizeHandler}
            placeholder="0.00"
          />
          <div className="px-1.5 py-1 rounded-md bg-white-4">USDC</div>
        </div>
      </div>
      {errorType && (
        <ErrorMessage
          assetNames={assetNames}
          coinWithInterestCap={coinWithInterestCap}
          minimumLimit={minimumLimit}
          percentage={percentage}
          type={errorType}
          userBalance={userBalance}
        />
      )}
    </div>
  );
};

type ErrorType =
  | "interestCap"
  | "belowMinimum"
  | "belowPercentage"
  | "abovePercentage"
  | "aboveBalance";

interface ErrorMessageProps extends Partial<TradeAmountControls> {
  type: ErrorType;
}

const ErrorMessage = ({
  type,
  assetNames = [],
  coinWithInterestCap = [],
  minimumLimit = 0,
  percentage = 0,
  userBalance = 0,
}: ErrorMessageProps) => {
  const errorMessages: Record<ErrorType, string> = {
    interestCap: `${coinWithInterestCap.join(
      ", "
    )} has reached its open interest maximum. Please select a different asset.`,
    belowMinimum: `The order size for asset ${assetNames.join(
      ", "
    )} is below the minimum limit of ${formatPrice(
      minimumLimit
    )} for this asset.`,
    belowPercentage: `Total weights allocation is ${percentage}%. Please ensure the weights add up to 100%.`,
    abovePercentage: `Total weights allocation is ${percentage}%. Please ensure the weights add up to 100%.`,
    aboveBalance: `The order size exceeds your maximum trading capacity of ${formatPrice(
      userBalance * 3
    )}.`,
  };

  return (
    <div className="flex items-start gap-1 p-3 rounded-lg bg-danger-base text-danger">
      <InfoCircle className="shrink-0 size-3 translate-y-0.5" />
      <p>{errorMessages[type]}</p>
    </div>
  );
};
