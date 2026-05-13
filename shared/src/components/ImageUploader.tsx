/// <reference lib="dom" />
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { useState } from 'react';

export interface ImageUploaderProps {
  fileList: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
  maxCount?: number;
  uploadLabel?: string;
  multiple?: boolean;
  squareFullWidth?: boolean;
}

export const ImageUploader = ({
  fileList,
  onChange,
  maxCount = 6,
  uploadLabel = 'Upload',
  multiple = true,
  squareFullWidth = false,
}: ImageUploaderProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('FileReader failed'));
    });

  const handlePreview: UploadProps['onPreview'] = async (file) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({
    fileList: nextFileList,
  }) => {
    const normalized = nextFileList.slice(0, maxCount).map((file) => {
      const isAvif =
        file.url?.toLowerCase().endsWith('.avif') ||
        file.name?.toLowerCase().endsWith('.avif');

      if (isAvif && file.url && !file.thumbUrl) {
        return {
          ...file,
          thumbUrl: file.url,
        };
      }

      return file;
    });

    onChange(normalized);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        multiple={multiple}
        beforeUpload={() => false}
        onPreview={handlePreview}
        onChange={handleChange}
        fileList={fileList}
        rootClassName={
          squareFullWidth ? 'image-uploader-square-full' : undefined
        }
        isImageUrl={(file) => {
          const lowerUrl = file.url?.toLowerCase() || '';
          const lowerName = file.name?.toLowerCase() || '';
          return !!(
            file.type?.includes('image') ||
            lowerUrl.endsWith('.avif') ||
            lowerUrl.endsWith('.jpg') ||
            lowerUrl.endsWith('.jpeg') ||
            lowerName.endsWith('.avif') ||
            lowerName.endsWith('.jpg') ||
            lowerName.endsWith('.jpeg')
          );
        }}
      >
        {fileList.length >= maxCount ? null : (
          <button type="button" className="border-none">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{uploadLabel}</div>
          </button>
        )}
      </Upload>
      <Image
        styles={{ root: { display: 'none' } }}
        preview={{
          open: previewOpen,
          onOpenChange: (open) => setPreviewOpen(open),
        }}
        src={previewImage || undefined}
      />
    </>
  );
};
