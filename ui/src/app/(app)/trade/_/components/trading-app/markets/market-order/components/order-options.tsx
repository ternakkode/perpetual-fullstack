"use client";

import { Button } from "@brother-terminal/components/ui/button";
import { Input } from "@brother-terminal/components/ui/input";
import { cn } from "@brother-terminal/lib/utils";

interface OrderOptionsProps {
  reduceOnly: boolean;
  setReduceOnly: (reduceOnly: boolean) => void;
  useTpsl: boolean;
  setUseTpsl: (useTpsl: boolean) => void;
  tpPrice: string;
  setTpPrice: (price: string) => void;
  tpGain: string;
  setTpGain: (gain: string) => void;
  slPrice: string;
  setSlPrice: (price: string) => void;
  slLoss: string;
  setSlLoss: (loss: string) => void;
}

export function OrderOptions({
  reduceOnly,
  setReduceOnly,
  useTpsl,
  setUseTpsl,
  tpPrice,
  setTpPrice,
  tpGain,
  setTpGain,
  slPrice,
  setSlPrice,
  slLoss,
  setSlLoss
}: OrderOptionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs">Reduce Only</div>
        <Button
          variant={reduceOnly ? "default" : "secondary"}
          size="sm"
          className={cn(
            "h-6 px-2 text-xs",
            reduceOnly ? "bg-primary text-background" : ""
          )}
          onClick={() => setReduceOnly(!reduceOnly)}
        >
          {reduceOnly ? "On" : "Off"}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs">Take Profit / Stop Loss</div>
        <Button
          variant={useTpsl ? "default" : "secondary"}
          size="sm"
          className={cn("h-6 px-2 text-xs", useTpsl ? "bg-primary text-background" : "")}
          onClick={() => setUseTpsl(!useTpsl)}
        >
          {useTpsl ? "On" : "Off"}
        </Button>
      </div>

      {useTpsl && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wide text-white-48">
                TP Price
              </div>
              <Input
                inputMode="decimal"
                value={tpPrice}
                onChange={(e) => setTpPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wide text-white-48">
                Gain %
              </div>
              <Input
                inputMode="decimal"
                value={tpGain}
                onChange={(e) => setTpGain(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="h-7 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wide text-white-48">
                SL Price
              </div>
              <Input
                inputMode="decimal"
                value={slPrice}
                onChange={(e) => setSlPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wide text-white-48">
                Loss %
              </div>
              <Input
                inputMode="decimal"
                value={slLoss}
                onChange={(e) => setSlLoss(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="h-7 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}