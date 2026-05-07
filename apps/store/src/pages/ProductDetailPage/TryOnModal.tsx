import { useMemo, useState } from 'react';
import { Button, Modal, Upload, message } from 'antd';
import { LuSparkles } from 'react-icons/lu';
import { FiUploadCloud } from 'react-icons/fi';
import { getApiErrorMessage, userService } from '@shared';
import { TFunction } from 'i18next';

type Variant = {
  color: string;
  images: string[];
};

type Product = {
  name: string;
  nameEn: string;
  variants: Variant[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product;
  selectedColorId: string;
  language: string;
  t: TFunction;
};

export default function AITryOnModal({
  open,
  onClose,
  product,
  selectedColorId,
  language,
  t,
}: Props) {
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [resultImage, setResultImage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const selectedVariant = useMemo(() => {
    return product.variants.find((v) => v.color === selectedColorId);
  }, [product, selectedColorId]);

  const clothesImage = useMemo(() => {
    if (!selectedVariant?.images?.length) return '';

    return selectedVariant.images[1] || selectedVariant.images[0];
  }, [selectedVariant]);

  const handleUpload = (file: File) => {
    setPersonFile(file);
    setPreview(URL.createObjectURL(file));
    return false;
  };

  const generateAI = async (): Promise<void> => {
    try {
      if (!personFile) {
        message.warning(t('pleaseUploadYourImage'));
        return;
      }

      setLoading(true);
      setResultImage('');

      const response = await userService.virtualTryOn({
        person: personFile,
        clothesUrl: clothesImage,
      });

      if (!response?.success) {
        throw new Error('Failed');
      }

      setResultImage(response.imageUrl);
    } catch (error: unknown) {
      getApiErrorMessage(error, 'Generate failed');
      message.error('Generate failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1100}
      centered
      destroyOnClose
      className="[&_.ant-modal-content]:!rounded-3xl [&_.ant-modal-content]:!p-0 overflow-hidden"
    >
      <div className="grid grid-cols-2 min-h-[650px]">
        <div className="border-r border-slate-200 bg-white p-8 flex flex-col">
          <div>
            <div className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
              <LuSparkles className="text-pink-500" />
              <span>{t('aiVirtualTryOn')}</span>
            </div>

            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {t('uploadYourImageAndPreviewYourselfWearingThisOutfitUsingAI')}
            </p>
          </div>

          <div className="mt-6 flex-1 flex flex-col">
            <div className="text-sm font-medium text-slate-600 mb-3">
              {t('uploadYourPhoto')}
            </div>

            <Upload
              accept="image/png,image/jpeg,image/webp,image/avif"
              maxCount={1}
              showUploadList={false}
              beforeUpload={handleUpload}
            >
              <button
                type="button"
                className="w-full rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50/40 p-6 transition hover:bg-pink-50"
              >
                {preview ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <img
                      src={preview}
                      alt="preview"
                      className="h-[240px] w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                      <FiUploadCloud className="text-pink-500" size={28} />
                    </div>

                    <div className="mt-4 text-base font-semibold text-slate-800">
                      {t('clickToUploadImage')}
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      PNG, JPG, WEBP, AVIF
                    </div>
                  </div>
                )}
              </button>
            </Upload>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-500 mb-3">
                {t('selectedOutfit')}
              </div>

              <div className="overflow-hidden rounded-2xl bg-white border border-slate-200">
                <img
                  src={clothesImage}
                  alt="clothes"
                  className="h-[320px] w-full object-contain object-top"
                />
              </div>

              <div className="mt-4 text-base font-semibold text-slate-900 line-clamp-2">
                {language === 'en' ? product.nameEn : product.name}
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={generateAI}
              className="!mt-6 !h-12 !rounded-2xl !bg-black hover:!bg-slate-800"
            >
              <span className="text-md" role="img" aria-label="star">
                ✨
              </span>{' '}
              {t('generateAITryOn')}
            </Button>
          </div>
        </div>

        <div className="bg-slate-50 p-8 flex flex-col">
          <div>
            <div className="text-2xl font-semibold text-slate-900">
              {t('aiResult')}
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {t('yourGeneratedFashionTryOnImageWillAppearHere')}
            </p>
          </div>

          <div className="mt-8 flex-1 rounded-[32px] border border-slate-200 bg-white overflow-hidden relative">
            {loading ? (
              <div className="h-full w-full animate-pulse bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100" />
            ) : resultImage ? (
              <img
                src={resultImage}
                alt="AI Result"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center px-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl">
                  <span className="text-md" role="img" aria-label="star">
                    ✨
                  </span>
                </div>

                <div className="mt-5 text-xl font-semibold text-slate-900">
                  {t('aiPreviewWillAppearHere')}
                </div>

                <div className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                  {t('uploadYourPhotoAndGenerateARealisticVirtualFashionTryOn')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
