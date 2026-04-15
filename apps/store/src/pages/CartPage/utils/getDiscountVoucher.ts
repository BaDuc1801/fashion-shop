import { Voucher } from '@shared';

export const getVoucherDiscount = (
  subtotal: number,
  vouchers: Voucher[],
  voucherId: string,
) => {
  const voucher = vouchers.find((v) => v._id === voucherId);
  if (!voucher) return 0;

  if (voucher.minOrderValue && subtotal < voucher.minOrderValue) {
    return 0;
  }

  const rawDiscount = Math.floor((subtotal * voucher.discountPercent) / 100);

  if (voucher.maxDiscount) {
    return Math.min(rawDiscount, voucher.maxDiscount);
  }

  return rawDiscount;
};
