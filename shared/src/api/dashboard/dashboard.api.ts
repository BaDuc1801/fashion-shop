import api from '../axios';
import { GetDashboardDataRequest } from './dashboard.request';
import { ChartData, DashboardResponse } from './dashboard.response';

class DashboardService {
  async getDashboardData(request: {
    range: string;
  }): Promise<DashboardResponse> {
    const res = await api.get('/api/dashboard/summary', { params: request });
    return res.data;
  }
  async getChartData(request: GetDashboardDataRequest): Promise<ChartData> {
    const res = await api.get('/api/dashboard/chart', { params: request });
    return res.data;
  }
}

export const dashboardService = new DashboardService();
