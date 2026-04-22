import { Button, ColorPicker, UploadFile } from 'antd';
import { SkuFields } from './SkuFields';
import { FormItem, ImageUploader } from '@shared';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AddNewProductFormValues } from '../schemas/addNewProductSchema';
import { useTranslation } from 'react-i18next';

export const VariantFields = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<AddNewProductFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-xl border border-slate-200 p-4 shadow-sm bg-white"
        >
          <div className="flex items-start justify-between mb-4">
            <FormItem name={`variants.${index}.color`}>
              {({ field }) => (
                <ColorPicker
                  value={field.value}
                  onChange={(_, hex) => field.onChange(hex)}
                  showText
                />
              )}
            </FormItem>

            <Button
              danger
              type="text"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              {t('admin.product.form.removeColor')}
            </Button>
          </div>

          <FormItem name={`variants.${index}.images`}>
            {({ field }) => (
              <ImageUploader
                fileList={(field.value as UploadFile[]) || []}
                onChange={(list) => field.onChange(list)}
                maxCount={6}
                multiple
              />
            )}
          </FormItem>

          <SkuFields variantIndex={index} />
        </div>
      ))}

      <Button
        type="dashed"
        block
        onClick={() =>
          append({
            color: '#fff',
            images: [],
            skus: [{ size: '', quantity: 0 }],
          })
        }
      >
        + {t('admin.product.form.addColor')}
      </Button>
    </div>
  );
};
