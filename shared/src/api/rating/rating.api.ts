import api from '../axios';
import { CreateRatingRequest, UpdateRatingRequest } from './rating.request';
import { RatingAdminResponse, RatingResponse } from './rating.response';

class RatingService {
  async createRating(payload: CreateRatingRequest): Promise<RatingResponse> {
    const res = await api.post('/api/ratings', payload);
    return res.data;
  }

  async getReviewsByProduct(productId: string): Promise<RatingResponse[]> {
    const res = await api.get(`/api/ratings/${productId}`);
    return res.data;
  }

  async getMyReviews(): Promise<RatingResponse[]> {
    const res = await api.get('/api/ratings/my-reviews');
    return res.data;
  }

  async updateRating(
    id: string,
    payload: UpdateRatingRequest,
  ): Promise<RatingResponse> {
    const res = await api.put(`/api/ratings/${id}`, payload);
    return res.data;
  }

  async deleteRating(id: string): Promise<{ message: string }> {
    const res = await api.delete(`/api/ratings/${id}`);
    return res.data;
  }

  async getAllReviewsAdmin({
    page,
    limit,
    search,
    rate,
  }: {
    page: number;
    limit: number;
    search: string;
    rate: number | undefined;
  }): Promise<RatingAdminResponse> {
    const res = await api.get('/api/ratings/admin/all', {
      params: { page, limit, search, rate },
    });
    return res.data;
  }

  async togglePublish(id: string): Promise<{ message: string }> {
    const res = await api.put(`/api/ratings/admin/toggle-publish/${id}`);
    return res.data;
  }
}

export const ratingService = new RatingService();
