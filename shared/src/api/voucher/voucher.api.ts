import api from '../axios';
import type {
  CreateVoucherRequest,
  UpdateVoucherRequest,
  GetVouchersParams,
} from './voucher.request';

import type { Voucher, GetVouchersResponse } from './voucher.response';

class VoucherService {
  async getVouchers(params?: GetVouchersParams): Promise<GetVouchersResponse> {
    const res = await api.get<GetVouchersResponse>('/api/vouchers', {
      params,
    });
    return res.data;
  }

  async getVoucherById(id: string): Promise<Voucher> {
    const res = await api.get<Voucher>(`/api/vouchers/${id}`);
    return res.data;
  }

  async createVoucher(data: CreateVoucherRequest): Promise<Voucher> {
    const res = await api.post<Voucher>('/api/vouchers', data);
    return res.data;
  }

  async updateVoucher(
    id: string,
    data: UpdateVoucherRequest,
  ): Promise<Voucher> {
    const res = await api.put<Voucher>(`/api/vouchers/${id}`, data);
    return res.data;
  }

  async deleteVoucher(id: string): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(`/api/vouchers/${id}`);
    return res.data;
  }
}

export const voucherService = new VoucherService();
