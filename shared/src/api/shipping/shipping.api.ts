import api from '../axios';

export const shippingService = {
  calculateShipping: async (data: { lat: string; lng: string }) => {
    const res = await api.post('/api/shipping/calculate', data);

    return res.data;
  },
};
