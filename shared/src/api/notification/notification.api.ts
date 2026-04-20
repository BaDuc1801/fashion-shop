import api from '../axios';
import { GetNotificationsResponse } from './notification.response';

class NotificationService {
  async getNotifications(params: {
    page: number;
    limit: number;
  }): Promise<GetNotificationsResponse> {
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
}

export const notificationService = new NotificationService();
