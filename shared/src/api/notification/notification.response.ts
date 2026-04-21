import { UserMeData } from '../user/user.response';

export type Notification = {
  type: string;
  title: string;
  message: string;
  target: string;
  data: {
    orderId: string;
    orderCode: string;
    total: number;
    paymentMethod: string;
  };
  _id: string;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  isRead: boolean;
  userId: UserMeData;
};

export interface GetNotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  totalPages: number;
}
