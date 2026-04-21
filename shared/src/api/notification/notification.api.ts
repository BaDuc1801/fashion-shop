import api from '../axios';
import { GetNotificationsRequest } from './notification.request';
import { GetNotificationsResponse } from './notification.response';

class NotificationService {
  async getNotifications(
    params: GetNotificationsRequest,
  ): Promise<GetNotificationsResponse> {
    const res = await api.get('/api/notifications', { params });
    return res.data;
  }

  async getUnreadNotificationsCount(): Promise<{ total: number }> {
    const res = await api.get('/api/notifications/unread');
    return res.data;
  }

  async markAsRead(id: string): Promise<{ success: boolean }> {
    const res = await api.post(`/api/notifications/${id}/read`);
    return res.data;
  }

  async markAllAsRead(): Promise<{ success: boolean }> {
    const res = await api.post(`/api/notifications/read-all`);
    return res.data;
  }

  async getCustomerNotifications(
    params: GetNotificationsRequest,
  ): Promise<GetNotificationsResponse> {
    const res = await api.get('/api/notifications/customer', { params });
    return res.data;
  }

  async getCustomerUnreadNotificationsCount(): Promise<{ total: number }> {
    const res = await api.get('/api/notifications/customer/unread-count');
    return res.data;
  }

  async markCustomerNotificationAsRead(
    id: string,
  ): Promise<{ success: boolean }> {
    const res = await api.patch(`/api/notifications/customer/${id}/read`);
    return res.data;
  }

  async markAllCustomerNotificationsAsRead(): Promise<{ success: boolean }> {
    const res = await api.patch('/api/notifications/customer/read-all');
    return res.data;
  }
}

export const notificationService = new NotificationService();
