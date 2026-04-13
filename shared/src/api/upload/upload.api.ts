import api from '../axios';

const pickUrlsFromUploadPayload = (payload: unknown): string[] => {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is string => typeof item === 'string');
  }

  if (!payload || typeof payload !== 'object') return [];

  const data = payload as {
    url?: string;
    urls?: string[];
    imageUrl?: string;
    imageUrls?: string[];
    data?: {
      url?: string;
      urls?: string[];
      imageUrl?: string;
      imageUrls?: string[];
    };
  };

  return [
    data.url,
    ...(data.urls ?? []),
    data.imageUrl,
    ...(data.imageUrls ?? []),
    data.data?.url,
    ...(data.data?.urls ?? []),
    data.data?.imageUrl,
    ...(data.data?.imageUrls ?? []),
  ].filter((item): item is string => typeof item === 'string' && item.length > 0);
};

class UploadService {
  async uploadImages(files: Blob[]): Promise<string[]> {
    if (!files.length) return [];

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const res = await api.post('/api/upload?images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const urls = pickUrlsFromUploadPayload(res.data);
    if (!urls.length) {
      throw new Error('Upload response missing image urls');
    }
    return urls;
  }
}

export const uploadService = new UploadService();
