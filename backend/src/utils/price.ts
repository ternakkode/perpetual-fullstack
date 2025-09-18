export const getSlippagePrice = (
    optimalDecimal: number,
    isBuy: boolean,
    slippage: number = 0.08,
    px: number
  ): number => {
    const adjustedPrice = isBuy ?
      px * (1 + slippage) :
      px * (1 - slippage);

    const significantFigures = Number(adjustedPrice.toPrecision(5));

    const pricePrecision = 6 - optimalDecimal;

    return Number(significantFigures.toFixed(pricePrecision));
  }