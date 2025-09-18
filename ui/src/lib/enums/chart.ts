export enum ChartRangeOption {
  OneMinute = "1m",
  FiveMinutes = "5m",
  OneHour = "1H",
  OneDay = "1D",
  OneWeek = "1W",
  OneMonth = "1M",
}

export const inputOptionMap: Map<ChartRangeOption, string> = new Map([
  [ChartRangeOption.OneMinute, "1m"],
  [ChartRangeOption.FiveMinutes, "5m"],
  [ChartRangeOption.OneHour, "1h"],
  [ChartRangeOption.OneDay, "1d"],
  [ChartRangeOption.OneWeek, "1w"],
  [ChartRangeOption.OneMonth, "1M"],
]);

export enum ChartTypeOption {
  Candlestick = "candlestick",
  Area = "area",
}

export const RANGE_MAP = {
  "1m": 60 * 60 * 1000,
  "5m": 60 * 5 * 60 * 1000,
  "1H": 60 * 60 * 60 * 1000,
  "1D": 60 * 24 * 60 * 60 * 1000,
  "1W": 60 * 7 * 24 * 60 * 60 * 1000,
  "1M": 60 * 30 * 24 * 60 * 60 * 1000,
};