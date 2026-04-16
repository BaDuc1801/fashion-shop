export interface CreateOrderRequest {
  items: {
    productId: string;
    size: string;
    color: string;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  voucherCode?: string;
  paymentMethod: string;
  note?: string;
}
