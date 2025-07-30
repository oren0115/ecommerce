export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
}; 