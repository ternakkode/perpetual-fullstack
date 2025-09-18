import { ChartRangeOption } from "@brother-terminal/lib/enums/chart";
import { PairType } from "@brother-terminal/lib/enums/trading";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToCurrencyString(value: number): string {
  const currentLocale = window.navigator.languages[0];
  const formatted = new Intl.NumberFormat(currentLocale || "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
  return `$${formatted}`;
}

/**
 * Normalizes a Unix timestamp to the nearest boundary based on the specified range option.
 * @param timestamp Unix timestamp in milliseconds
 * @param rangeOption ChartRangeOption to normalize to
 * @returns Normalized Unix timestamp in milliseconds
 */
export function normalizeTimestamp(
  timestamp: number,
  rangeOption: ChartRangeOption
): number {
  const date = new Date(timestamp * 1000);

  switch (rangeOption) {
    case ChartRangeOption.OneMinute:
      // Reset seconds and milliseconds
      date.setUTCSeconds(0, 0);
      break;

    case ChartRangeOption.FiveMinutes:
      // Reset minutes, seconds, and milliseconds
      date.setUTCMinutes(
        date.getUTCMinutes() - (date.getUTCMinutes() % 5),
        0,
        0
      );
      break;

    case ChartRangeOption.OneHour:
      // Reset minutes, seconds, and milliseconds
      date.setUTCMinutes(0, 0, 0);
      break;

    case ChartRangeOption.OneDay:
      // Reset hours, minutes, seconds, and milliseconds
      date.setUTCHours(0, 0, 0, 0);
      break;

    case ChartRangeOption.OneWeek:
      // Reset to the start of the week (Sunday)
      const dayOfWeek = date.getUTCDay();
      date.setUTCDate(date.getUTCDate() - dayOfWeek); // Go back to Sunday
      date.setUTCHours(0, 0, 0, 0);
      break;

    case ChartRangeOption.OneMonth:
      // Reset to the start of the month
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
      break;

    default:
      throw new Error(`Unsupported range option: ${rangeOption}`);
  }

  return date.getTime() / 1000;
}

export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
};

export function roundToDecimalPlace(value: number, decimalPlaces = 2) {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
}

export const formatPriceToOptimalDecimals = (price: number) => {
  const decimals = getOptimalDecimals(price);
  const formatted = price.toFixed(decimals);
  
  // Remove trailing zeros after decimal point
  const parts = formatted.split('.');
  if (parts.length === 1) {
    return parts[0];
  }
  
  const integerPart = parts[0];
  const decimalPart = parts[1].replace(/0+$/, '');
  
  return decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : integerPart;
};

export const getOptimalDecimals = (price: number) => {
  if (!price || isNaN(price)) return 2;

  if (price >= 10000) return 2; // BTC, ETH range
  if (price >= 1000) return 3;
  if (price >= 100) return 3; // SOL, AVAX range
  if (price >= 10) return 4;
  if (price >= 1) return 5;
  if (price >= 0.1) return 6;
  if (price >= 0.01) return 7;
  return 8; // Very low prices
};

export const getMinimumDecimalUnit = (price: number) => {
  const decimals = getOptimalDecimals(price);
  return 1 / Math.pow(10, decimals);
};

export const simplifyMoneyFormat = (value: number) => {
  if (value < 0) {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `-$${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `-$${(absValue / 1000).toFixed(1)}K`;
    }
    return `-$${absValue.toFixed(0)}`;
  } else {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  }
};

export const formatPriceWithSubscript = (price: number): { 
  prefix: string; 
  leadingZeros: number | null; 
  significantDigits: string;
  isFormatted: boolean;
  raw: string; 
} => {
  if (!price || isNaN(price)) {
    return { 
      prefix: "0", 
      leadingZeros: null, 
      significantDigits: "", 
      isFormatted: false,
      raw: "0" 
    };
  }
  
  // For regular prices (1 and above), format normally with optimal decimals
  if (price >= 1) {
    const formatted = formatPriceToOptimalDecimals(price);
    return { 
      prefix: formatted, 
      leadingZeros: null, 
      significantDigits: "", 
      isFormatted: false,
      raw: formatted 
    };
  }
  
  // For small numbers that need subscript formatting
  // Use toFixed with maximum precision to avoid scientific notation
  // and preserve trailing zeros
  const priceStr = price.toFixed(20).replace(/0+$/, '');
  
  // Check if it has a decimal part
  if (!priceStr.includes('.')) {
    return { 
      prefix: priceStr, 
      leadingZeros: null, 
      significantDigits: "", 
      isFormatted: false,
      raw: priceStr 
    };
  }
  
  const [integerPart, decimalPart] = priceStr.split('.');
  
  // Count leading zeros in decimal part
  let leadingZeros = 0;
  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] === '0') {
      leadingZeros++;
    } else {
      break;
    }
  }
  
  // If fewer than 2 leading zeros, just use the normal formatter without subscript
  if (leadingZeros < 2) {
    const formatted = formatPriceToOptimalDecimals(price);
    return { 
      prefix: formatted, 
      leadingZeros: null, 
      significantDigits: "", 
      isFormatted: false,
      raw: formatted 
    };
  }
  
  // Get the significant digits (up to 6)
  // If we have fewer than 6 significant digits, use all of them
  const significantPart = decimalPart.substring(leadingZeros);
  const significantDigits = significantPart.length > 6 
    ? significantPart.substring(0, 6)
    : significantPart;
  
  // Return structured data instead of HTML string
  return {
    prefix: "0.0",
    leadingZeros,
    significantDigits,
    isFormatted: true,
    raw: `0.0${"0".repeat(leadingZeros)}${significantDigits}`
  };
};