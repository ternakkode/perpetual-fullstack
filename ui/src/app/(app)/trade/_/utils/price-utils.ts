export const formatPrice = (value: number, opts?: Intl.NumberFormatOptions) => {
  return Intl.NumberFormat("en-US", {
    currency: "USD",
    ...opts,
  }).format(value);
};
