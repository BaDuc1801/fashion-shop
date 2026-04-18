export interface DashboardResponse {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  cancelledOrders: {
    current: number;
    previous: number;
    change: number;
  };
  users: {
    current: number;
    previous: number;
    change: number;
  };
}

export interface ChartData {
  type: string;
  from: string;
  to: string;
  data: {
    _id: string;
    revenue: number;
    orders: number;
  }[];
}
