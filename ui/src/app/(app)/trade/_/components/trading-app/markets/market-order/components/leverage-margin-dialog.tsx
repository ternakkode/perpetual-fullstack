"use client";

import { Button } from "@brother-terminal/components/ui/button";
import { Input } from "@brother-terminal/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@brother-terminal/components/ui/dialog";
import { useUserSelectionStore } from "@/store/useUserSelectionStore";

export type MarginMode = "cross" | "isolated";

interface LeverageMarginDialogProps {
  leverage: string;
  setLeverage: (leverage: string) => void;
  marginMode: MarginMode;
  setMarginMode: (mode: MarginMode) => void;
  leverageDialogOpen: boolean;
  setLeverageDialogOpen: (open: boolean) => void;
  isUpdatingLeverage: boolean;
  getMaxLeverage: () => number;
  handleLeverageUpdate: () => Promise<void>;
  isConnected: boolean;
}

export function LeverageMarginDialog({
  leverage,
  setLeverage,
  marginMode,
  setMarginMode,
  leverageDialogOpen,
  setLeverageDialogOpen,
  isUpdatingLeverage,
  getMaxLeverage,
  handleLeverageUpdate,
  isConnected
}: LeverageMarginDialogProps) {
  const { selectedAsset } = useUserSelectionStore();

  return (
    <Dialog open={leverageDialogOpen} onOpenChange={setLeverageDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="h-10 sm:h-9 px-3 rounded-lg text-sm font-medium border border-white-8 bg-white-4 hover:bg-white-8 w-full"
        >
          {leverage}x • {marginMode === "cross" ? "Cross" : "Isolated"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Leverage & Margin Settings</DialogTitle>
          <div className="text-sm text-white-64">
            Max leverage for {selectedAsset?.name}: {getMaxLeverage() || 20}x
          </div>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Margin Mode Selection */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-white-96">Margin Mode</div>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setMarginMode("cross")}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  marginMode === "cross"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white-8 hover:border-white-16"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    marginMode === "cross" ? "border-blue-500" : "border-white-32"
                  }`}>
                    {marginMode === "cross" && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="font-medium">Cross Margin</span>
                </div>
                <p className="text-xs text-white-64 leading-relaxed">
                  All cross positions share the same cross margin as collateral. In the event of liquidation, your cross margin balance and any remaining open positions under assets in this mode may be forfeited.
                </p>
              </button>
              
              <button
                type="button"
                onClick={() => setMarginMode("isolated")}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  marginMode === "isolated"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white-8 hover:border-white-16"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    marginMode === "isolated" ? "border-blue-500" : "border-white-32"
                  }`}>
                    {marginMode === "isolated" && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="font-medium">Isolated Margin</span>
                </div>
                <p className="text-xs text-white-64 leading-relaxed">
                  Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of an isolated position reaches 100%, the position will be liquidated. Margin can be added or removed to individual positions in this mode.
                </p>
              </button>
            </div>
          </div>

          {/* Leverage Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white-96">Leverage</span>
              <span className="text-sm font-medium">{leverage}x</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-white-8 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${(parseInt(leverage) / (getMaxLeverage() || 20)) * 100}%` }}
                />
              </div>
              <input
                type="range"
                min="1"
                max={getMaxLeverage()}
                step="1"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max={getMaxLeverage()}
                value={leverage}
                onChange={(e) => {
                  const maxLev = getMaxLeverage();
                  const val = Math.max(1, Math.min(maxLev!, parseInt(e.target.value) || 1));
                  setLeverage(String(val));
                }}
                className="flex-1 h-9"
              />
              <Button
                onClick={handleLeverageUpdate}
                disabled={!selectedAsset || !isConnected || isUpdatingLeverage}
                className="h-9 px-6"
              >
                {isUpdatingLeverage ? (
                  <>
                    <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}