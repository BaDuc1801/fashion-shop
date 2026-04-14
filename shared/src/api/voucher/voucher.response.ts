export type VoucherStatus = 'active' | 'inactive';

export interface Voucher {
  _id: string;
  code: string;
  image?: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  expiresAt: string;
  status: VoucherStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetVouchersResponse {
  data: Voucher[];
  total: number;
  page: number;
  totalPages: number;
}
