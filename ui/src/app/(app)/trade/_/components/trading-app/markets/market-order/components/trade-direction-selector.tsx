"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@brother-terminal/components/ui/toggle-group";
import { cn } from "@brother-terminal/lib/utils";

export type Side = "buy" | "sell";

interface TradeDirectionSelectorProps {
  side: Side;
  setSide: (side: Side) => void;
}

export function TradeDirectionSelector({ side, setSide }: TradeDirectionSelectorProps) {
  return (
    <div className="flex items-center">
      <ToggleGroup
        type="single"
        value={side}
        onValueChange={(v) => v && setSide(v as Side)}
        className="w-full h-11 sm:h-10"
      >
        <ToggleGroupItem
          value="buy"
          className={cn(
            "flex-1 h-9 sm:h-8 justify-center text-sm font-medium",
            "data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
          )}
        >
          Buy / Long
        </ToggleGroupItem>
        <ToggleGroupItem
          value="sell"
          className={cn(
            "flex-1 h-9 sm:h-8 justify-center text-sm font-medium",
            "data-[state=on]:bg-red-500 data-[state=on]:text-white"
          )}
        >
          Sell / Short
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}