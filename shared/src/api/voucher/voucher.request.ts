import { VoucherStatus } from './voucher.response';

export interface CreateVoucherRequest {
  code: string;
  image?: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  expiresAt: string;
  status: VoucherStatus;
}

export type UpdateVoucherRequest = Partial<CreateVoucherRequest>;

export interface GetVouchersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: VoucherStatus;
}
