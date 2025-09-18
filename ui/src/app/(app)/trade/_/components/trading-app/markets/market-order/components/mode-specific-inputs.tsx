"use client";

import { Button } from "@brother-terminal/components/ui/button";
import { Input } from "@brother-terminal/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@brother-terminal/components/ui/select";
import { DateTimePicker } from "@brother-terminal/components/ui/date-time-picker";
import { TriggerAssetSelector, type TriggerType, type TradingAsset } from "./trigger-asset-selector";

export type { TriggerType, TradingAsset };
import { 
  TrendUp02, 
  Target03, 
  BarChart03, 
  PieChart03 
} from "@untitled-ui/icons-react";
import type { Mode } from "./order-type-selector";

export type TriggerDirection = "MORE_THAN" | "LESS_THAN";

export interface TriggerConfig {
  id: TriggerType;
  name: string;
  description: string;
  icon: React.ReactNode;
  needsAsset: boolean;
  needsValue: boolean;
  needsDirection: boolean;
  comingSoon?: boolean;
}

interface ModeSpecificInputsProps {
  mode: Mode;
  price: number;
  
  // Limit order
  limitPrice: string;
  setLimitPrice: (price: string) => void;
  
  // TWAP
  twapHours: string;
  setTwapHours: (hours: string) => void;
  twapMinutes: string;
  setTwapMinutes: (minutes: string) => void;
  
  // Scale
  scaleStartUSD: string;
  setScaleStartUSD: (start: string) => void;
  scaleEndUSD: string;
  setScaleEndUSD: (end: string) => void;
  scaleTotalOrders: string;
  setScaleTotalOrders: (orders: string) => void;
  scaleSizeSkew: string;
  setScaleSizeSkew: (skew: string) => void;
  
  // Stop orders
  stopPrice: string;
  setStopPrice: (price: string) => void;
  stopLimitPrice: string;
  setStopLimitPrice: (price: string) => void;
  
  // Schedule
  scheduleDate: string;
  setScheduleDate: (date: string) => void;
  scheduleTime: string;
  setScheduleTime: (time: string) => void;
  cronExpression: string;
  setCronExpression: (cron: string) => void;
  
  // Advanced trigger
  triggerType: TriggerType;
  setTriggerType: (type: TriggerType) => void;
  triggerAsset: string | null;
  setTriggerAsset: (asset: string | null) => void;
  triggerValue: number | null;
  setTriggerValue: (value: number | null) => void;
  triggerDirection: TriggerDirection;
  setTriggerDirection: (direction: TriggerDirection) => void;
  selectedTriggerAsset: TradingAsset | undefined;
  currentTriggerValue: number | null;
  formattedCurrentValue: string;
}

const formatPrice = (v: number) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "decimal",
      minimumFractionDigits: v >= 1000 ? 2 : 3,
      maximumFractionDigits: 6,
    }).format(v);
  } catch {
    return String(v);
  }
};

export function ModeSpecificInputs({
  mode,
  price,
  limitPrice,
  setLimitPrice,
  twapHours,
  setTwapHours,
  twapMinutes,
  setTwapMinutes,
  scaleStartUSD,
  setScaleStartUSD,
  scaleEndUSD,
  setScaleEndUSD,
  scaleTotalOrders,
  setScaleTotalOrders,
  scaleSizeSkew,
  setScaleSizeSkew,
  stopPrice,
  setStopPrice,
  stopLimitPrice,
  setStopLimitPrice,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  cronExpression,
  setCronExpression,
  triggerType,
  setTriggerType,
  setTriggerAsset,
  triggerValue,
  setTriggerValue,
  triggerDirection,
  setTriggerDirection,
  selectedTriggerAsset,
  currentTriggerValue,
  formattedCurrentValue
}: ModeSpecificInputsProps) {

  const triggerTypes: TriggerConfig[] = [
    {
      id: 'ASSET_PRICE',
      name: 'Asset Price',
      description: 'Execute when asset price crosses threshold',
      icon: <TrendUp02 className="w-5 h-5" />,
      needsAsset: true,
      needsValue: true,
      needsDirection: true
    },
    {
      id: 'FEAR_GREED_INDEX',
      name: 'Fear & Greed Index',
      description: 'Execute when CMC Fear & Greed Index crosses threshold',
      icon: <Target03 className="w-5 h-5" />,
      needsAsset: false,
      needsValue: true,
      needsDirection: true,
      comingSoon: true
    },
    {
      id: 'ALTCOIN_SEASON_INDEX',
      name: 'Altcoin Season Index',
      description: 'Execute when CMC Altcoin Season Index crosses threshold',
      icon: <BarChart03 className="w-5 h-5" />,
      needsAsset: false,
      needsValue: true,
      needsDirection: true,
      comingSoon: true
    },
    {
      id: 'BITCOIN_DOMINANCE',
      name: 'Bitcoin Dominance',
      description: 'Execute when BTC dominance crosses percentage',
      icon: <PieChart03 className="w-5 h-5" />,
      needsAsset: false,
      needsValue: true,
      needsDirection: true,
      comingSoon: true
    },
    {
      id: 'VOLUME',
      name: 'Volume',
      description: 'Execute when trading volume exceeds threshold',
      icon: <BarChart03 className="w-5 h-5" />,
      needsAsset: true,
      needsValue: true,
      needsDirection: true
    },
    {
      id: 'OPEN_INTEREST',
      name: 'Open Interest',
      description: 'Execute when open interest crosses threshold',
      icon: <PieChart03 className="w-5 h-5" />,
      needsAsset: true,
      needsValue: true,
      needsDirection: true
    },
    {
      id: 'DAY_CHANGE_PERCENTAGE',
      name: 'Daily Change %',
      description: 'Execute when daily price change exceeds percentage',
      icon: <Target03 className="w-5 h-5" />,
      needsAsset: true,
      needsValue: true,
      needsDirection: true
    }
  ];

  const selectedTrigger = triggerTypes.find(t => t.id === triggerType);

  if (mode === "limit") {
    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            inputMode="decimal"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className="h-9 text-sm pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 sm:h-6 px-2 text-xs text-white-64 hover:text-white-96 hover:bg-white-8"
              onClick={() => setLimitPrice(String(price))}
            >
              Current
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs leading-relaxed">
          <span className="text-white-56">Limit Price</span>
          <span className="text-white-56">Current: {formatPrice(price)} USD</span>
        </div>
      </div>
    );
  }

  if (mode === "twap") {
    return (
      <div className="space-y-2">
        <div className="text-sm text-white-64">Duration</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Input
              type="number"
              min="0"
              max="23"
              value={twapHours}
              onChange={(e) => setTwapHours(e.target.value)}
              placeholder="Hours"
              className="h-9 text-sm"
            />
            <div className="text-xs text-white-48">Hours</div>
          </div>
          <div className="space-y-1">
            <Input
              type="number"
              min="0"
              max="59"
              value={twapMinutes}
              onChange={(e) => setTwapMinutes(e.target.value)}
              placeholder="Minutes"
              className="h-9 text-sm"
            />
            <div className="text-xs text-white-48">Minutes</div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "scale") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="text-xs text-white-64">Start USD</div>
            <Input
              inputMode="decimal"
              value={scaleStartUSD}
              onChange={(e) => setScaleStartUSD(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-white-64">End USD</div>
            <Input
              inputMode="decimal"
              value={scaleEndUSD}
              onChange={(e) => setScaleEndUSD(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              className="h-9 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="text-xs text-white-64">Total Orders</div>
            <Input
              type="number"
              min="1"
              value={scaleTotalOrders}
              onChange={(e) => setScaleTotalOrders(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-white-64">Size Skew</div>
            <Input
              inputMode="decimal"
              value={scaleSizeSkew}
              onChange={(e) => setScaleSizeSkew(e.target.value.replace(/[^0-9.-]/g, ""))}
              placeholder="0"
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  if (mode === "stop_limit") {
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-xs text-white-64">Stop Price</div>
          <Input
            inputMode="decimal"
            value={stopPrice}
            onChange={(e) => setStopPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs text-white-64">Limit Price</div>
          <Input
            inputMode="decimal"
            value={stopLimitPrice}
            onChange={(e) => setStopLimitPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className="h-9 text-sm"
          />
        </div>
      </div>
    );
  }

  if (mode === "stop_market") {
    return (
      <div className="space-y-1">
        <div className="text-xs text-white-64">Stop Price</div>
        <Input
          inputMode="decimal"
          value={stopPrice}
          onChange={(e) => setStopPrice(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="0.00"
          className="h-9 text-sm"
        />
      </div>
    );
  }

  if (mode === "schedule_one_time") {
    return (
      <div className="space-y-2">
        <div className="text-sm text-white-64">Schedule</div>
        <DateTimePicker
          date={scheduleDate}
          onDateChange={setScheduleDate}
          time={scheduleTime}
          onTimeChange={setScheduleTime}
        />
      </div>
    );
  }

  if (mode === "schedule_recurring") {
    return (
      <div className="space-y-1">
        <div className="text-xs text-white-64">Cron Expression</div>
        <Input
          value={cronExpression}
          onChange={(e) => setCronExpression(e.target.value)}
          placeholder="0 9 * * 1"
          className="h-9 text-sm font-mono"
        />
        <div className="text-xs text-white-48">Example: "0 9 * * 1" = Every Monday at 9:00 AM</div>
      </div>
    );
  }

  if (mode === "advance_trigger") {
    return (
      <div className="space-y-2">
        {/* Trigger Type Dropdown */}
        <div>
          <label className="block text-xs text-white-64 mb-1">Trigger Type</label>
          <Select 
            value={triggerType} 
            onValueChange={(value) => setTriggerType(value as TriggerType)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select trigger type" />
            </SelectTrigger>
            <SelectContent>
              {triggerTypes.map((trigger) => (
                <SelectItem 
                  key={trigger.id} 
                  value={trigger.id} 
                  disabled={trigger.comingSoon}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white-64">{trigger.icon}</span>
                    <span>{trigger.name}</span>
                    {trigger.comingSoon && <span className="text-xs text-white-48">(Coming soon)</span>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trigger Configuration */}
        {selectedTrigger && !selectedTrigger.comingSoon && (
          <>
            {/* Asset Selection for triggers that need it */}
            {selectedTrigger.needsAsset && (
              <div>
                <label className="block text-xs text-white-64 mb-1">Asset</label>
                <TriggerAssetSelector
                  selectedAsset={selectedTriggerAsset}
                  onAssetSelect={(symbol) => setTriggerAsset(symbol)}
                  triggerType={triggerType}
                  placeholder="Select asset"
                />
              </div>
            )}

            {/* Combined Condition and Value Input */}
            {selectedTrigger.needsDirection && (
              <div>
                <label className="block text-xs text-white-64 mb-1">
                  Trigger when {triggerType === 'ASSET_PRICE' && 'price'}{triggerType === 'VOLUME' && 'volume'}{triggerType === 'OPEN_INTEREST' && 'open interest'}{triggerType === 'DAY_CHANGE_PERCENTAGE' && 'daily change'}{(triggerType === 'FEAR_GREED_INDEX' || triggerType === 'ALTCOIN_SEASON_INDEX' || triggerType === 'BITCOIN_DOMINANCE') && 'value'} is
                </label>
                <div className="space-y-1">
                  <div className="relative">
                    <div className="flex h-9 rounded-lg border border-white-8 bg-transparent">
                      {/* Direction Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setTriggerDirection(triggerDirection === 'MORE_THAN' ? 'LESS_THAN' : 'MORE_THAN')}
                        className={`flex items-center justify-center px-3 rounded-l-lg border-r border-white-8 transition-colors text-sm font-medium min-w-[60px] ${
                          triggerDirection === 'MORE_THAN' 
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {triggerDirection === 'MORE_THAN' ? '>' : '<'}
                      </button>
                      
                      {/* Value Input */}
                      <input
                        type="number"
                        value={triggerValue ?? ''}
                        onChange={(e) => setTriggerValue(Number(e.target.value))}
                        placeholder="Enter value..."
                        className="flex-1 px-3 bg-transparent text-sm text-white placeholder-white-48 focus:outline-none"
                      />
                      
                      {/* Current Value Button */}
                      {selectedTriggerAsset && currentTriggerValue !== null && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTriggerValue(currentTriggerValue)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs text-white-64 hover:text-white-96 hover:bg-white-8"
                        >
                          Current
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Helper Text */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-white-48">
                      Execute when {triggerDirection === 'MORE_THAN' ? 'greater than' : 'less than'} threshold
                    </div>
                    {selectedTriggerAsset && formattedCurrentValue && (
                      <div className="text-white-48">
                        Current: {formattedCurrentValue}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
}