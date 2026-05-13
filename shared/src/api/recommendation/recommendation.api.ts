import api from '../axios';
import type {
  RecommendationProductsResponse,
} from './recommendation.response';

class RecommendationService {
  async getTrending(
    limit: number,
  ): Promise<RecommendationProductsResponse> {
    const res = await api.get('/api/recommendations/trending', {
      params: { limit },
    });
    return res.data;
  }

  async getRecommendations(
    userId: string,
    limit: number,
  ): Promise<RecommendationProductsResponse> {
    const res = await api.get(`/api/recommendations/${userId}`, {
      params: { limit },
    });
    return res.data;
  }
}

export const recommendationService = new RecommendationService();

