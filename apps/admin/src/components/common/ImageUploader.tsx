import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { useState } from 'react';

interface ImageUploaderProps {
  fileList: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
  maxCount?: number;
  uploadLabel?: string;
  multiple?: boolean;
}

const ImageUploader = ({
  fileList,
  onChange,
  maxCount = 6,
  uploadLabel = 'Upload',
  multiple = true,
}: ImageUploaderProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
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
    onChange(nextFileList.slice(0, maxCount));
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
      >
        {fileList.length >= maxCount ? null : (
          <button type="button" style={{ border: 0, background: 'none' }}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{uploadLabel}</div>
          </button>
        )}
      </Upload>
      <Image
        wrapperStyle={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
        src={previewImage}
      />
    </>
  );
};

export default ImageUploader;
