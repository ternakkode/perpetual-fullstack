"use client"

import * as React from "react"
import { Input } from "@brother-terminal/components/ui/input"
import { cn } from "@brother-terminal/lib/utils"

interface DateTimePickerProps {
  date?: string
  onDateChange?: (date: string) => void
  time?: string
  onTimeChange?: (time: string) => void
  className?: string
}

export function DateTimePicker({
  date,
  onDateChange,
  time,
  onTimeChange,
  className,
}: DateTimePickerProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <Input
        type="date"
        value={date}
        onChange={(e) => onDateChange?.(e.target.value)}
        className="h-9 text-sm"
      />
      <Input
        type="time"
        value={time}
        onChange={(e) => onTimeChange?.(e.target.value)}
        className="h-9 text-sm"
      />
    </div>
  )
}