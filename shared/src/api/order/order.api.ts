import api from '../axios';
import { CreateOrderRequest } from './order.request';
import {
  CreateOrderResponse,
  GetListOrdersResponse,
  OrderDetailData,
} from './order.response';

class OrderService {
  async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    const res = await api.post('/api/orders', payload);
    return res.data;
  }

  async getAllOrders(params: {
    page: number;
    limit: number;
  }): Promise<GetListOrdersResponse> {
    const res = await api.get('/api/orders', { params });
    return res.data;
  }

  async getMyOrders(): Promise<GetListOrdersResponse> {
    const res = await api.get('/api/orders/my-orders');
    return res.data;
  }

  async getOrderById(id: string): Promise<OrderDetailData> {
    const res = await api.get(`/api/orders/${id}`);
    return res.data;
  }

  async cancelOrder(id: string): Promise<{ message: string }> {
    const res = await api.put(`/api/orders/cancel/${id}`);
    return res.data;
  }
}

export const orderService = new OrderService();
