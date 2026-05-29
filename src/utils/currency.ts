export const formatPrice = (amount: string | number | null | undefined): string => {
  if (!amount) return '0';
  return Number(amount).toLocaleString('fa-IR');
};

export const formatPriceWithCurrency = (amount: string | number | null | undefined): string => {
  return `${formatPrice(amount)} تومان`;
};
