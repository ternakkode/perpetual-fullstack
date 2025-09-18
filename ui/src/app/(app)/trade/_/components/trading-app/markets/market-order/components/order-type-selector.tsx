"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@brother-terminal/components/ui/select";

export type Mode = "market" | "limit" | "twap" | "scale" | "stop_limit" | "stop_market" | "schedule_one_time" | "schedule_recurring" | "advance_trigger";

interface OrderTypeSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function OrderTypeSelector({ mode, onModeChange }: OrderTypeSelectorProps) {
  return (
    <div>
      <Select value={mode} onValueChange={(v) => onModeChange(v as Mode)}>
        <SelectTrigger className="w-full h-10 text-sm font-bold">
          <SelectValue placeholder="Select order type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="market" className="font-bold">Market</SelectItem>
          <SelectItem value="limit" className="font-bold">Limit</SelectItem>
          <SelectItem value="twap" className="font-bold">TWAP</SelectItem>
          <SelectItem value="scale" className="font-bold">Scale</SelectItem>
          <SelectItem value="stop_limit" className="font-bold">Stop Limit</SelectItem>
          <SelectItem value="stop_market" className="font-bold">Stop Market</SelectItem>
          <SelectItem value="schedule_one_time" className="font-bold">Schedule (One Time)</SelectItem>
          <SelectItem value="schedule_recurring" className="font-bold">Schedule (Recurring)</SelectItem>
          <SelectItem value="advance_trigger" className="font-bold">Advance Trigger</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}