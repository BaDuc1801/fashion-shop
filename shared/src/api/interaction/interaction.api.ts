import api from '../axios';
import type {
  TrackAddToCartRequest,
  TrackClickRequest,
  TrackPurchaseRequest,
  TrackViewRequest,
} from './interaction.request';
import type {
  TrackInteractionResponse,
  TrackPurchaseResponse,
} from './interaction.response';

class InteractionService {
  async trackView(
    payload: TrackViewRequest,
  ): Promise<TrackInteractionResponse> {
    const res = await api.post('/api/interactions/view', payload);
    return res.data;
  }

  async trackClick(
    payload: TrackClickRequest,
  ): Promise<TrackInteractionResponse> {
    const res = await api.post('/api/interactions/click', payload);
    return res.data;
  }

  async trackAddToCart(
    payload: TrackAddToCartRequest,
  ): Promise<TrackInteractionResponse> {
    const res = await api.post('/api/interactions/add-to-cart', payload);
    return res.data;
  }

  async trackPurchase(
    payload: TrackPurchaseRequest,
  ): Promise<TrackPurchaseResponse> {
    const res = await api.post('/api/interactions/purchase', payload);
    return res.data;
  }
}

export const interactionService = new InteractionService();
