import { UserMeData } from '../user/user.response';
import { Voucher } from '../voucher/voucher.response';

export interface CreateOrderResponse {
  message: string;
  order: {
    _id: string;
    orderCode: string;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
  };
  paymentUrl?: string;
  paymentId?: string;
  expiresAt?: string;
  payment?: {
    method: string;
    accountNumber: string;
    bankName: string;
    amount: number;
    content: string;
    qrCode: string;
  };
}

export interface UserOrderData {
  _id: string;
  orderCode: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export interface OrderDetailDiscount {
  voucherId: Voucher;
  discountAmount: number;
}

export interface OrderDetailData {
  _id: string;
  orderCode: string;
  items: {
    productId: string;
    nameSnapshot: string;
    nameEnSnapshot: string;
    reviewed: boolean;
    canReview: boolean;
    imageSnapshot: string;
    skuSnapshot: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  subtotal: number;
  discount: OrderDetailDiscount;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
  payment?: {
    method: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    content: string;
    qr: string;
  };
  userId: UserMeData;
  createdAt: string;
}

export interface GetListOrdersResponse {
  orders: OrderDetailData[];
  total: number;
  page: number;
  totalPages: number;
}
