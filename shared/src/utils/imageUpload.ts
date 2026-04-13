import type { UploadFile } from 'antd';
import { uploadService } from '../api/upload/upload.api';

export const resolveImageUrls = async (images: UploadFile[]) => {
  const existingUrls = images
    .map((img) => img.url)
    .filter((url): url is string => Boolean(url));

  const newFiles = images
    .map((img) => img.originFileObj)
    .filter((file): file is NonNullable<UploadFile['originFileObj']> =>
      Boolean(file),
    );

  const uploadedUrls = await uploadService.uploadImages(newFiles);
  return [...existingUrls, ...uploadedUrls];
};
