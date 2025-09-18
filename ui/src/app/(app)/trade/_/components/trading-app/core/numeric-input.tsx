"use client";

import { cn } from "@brother-terminal/lib/utils";
import { useEffect, useRef } from "react";
import { withMask } from "use-mask-input";

interface NumericInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  mask?: Parameters<typeof withMask>[0];
  opts?: Parameters<typeof withMask>[1];
  onChange?: (value: number) => void;
}

export const NumericInput = ({
  mask = "numeric",
  opts,
  ...props
}: NumericInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maskRef = useRef<(input: HTMLInputElement) => void>(null);

  useEffect(() => {
    if (inputRef.current && !maskRef.current) {
      maskRef.current = withMask(mask, {
        ...opts,
        allowMinus: false,
        showMaskOnHover: false,
        unmaskAsNumber: true,
      });

      maskRef.current(inputRef.current);
    }
  }, [mask, opts]);

  return (
    <input
      ref={inputRef}
      {...props}
      className={cn(
        "placeholder:text-white-32 md:text-xs bg-transparent outline-none",
        props.className
      )}
      onChange={(e) => {
        let value = Number(e.target.value.replace(/\D/g, ""));
        if (!value) value = 1;
        if (props.onChange) props.onChange(value);
      }}
    />
  );
};
