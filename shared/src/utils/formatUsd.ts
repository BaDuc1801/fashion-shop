export const formatUsd = (n: number) => {
  if (n == null) return '0.00';

  const usd = n / 26000;

  return (
    '$ ' +
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usd)
  );
};
