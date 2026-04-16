import { UserMeData } from '../user/user.response';

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

export interface OrderDetailData {
  _id: string;
  orderCode: string;
  items: {
    productId: string;
    nameSnapshot: string;
    imageSnapshot: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  subtotal: number;
  discount: {
    discountAmount: number;
  };
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
  userId: UserMeData;
}

export interface GetListOrdersResponse {
  data: OrderDetailData[];
  total: number;
  page: number;
  totalPages: number;
}
