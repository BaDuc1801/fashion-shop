import { useFieldArray, useFormContext } from 'react-hook-form';
import { AddNewProductFormValues } from '../schemas/addNewProductSchema';
import { FormItem, ProductSku } from '@shared';
import { Select } from 'antd';
import { InputNumber } from 'antd';
import { Button } from 'antd';
import { PRODUCT_SIZE_SELECT_OPTIONS } from '../constants/productSizeOptions';
import { useTranslation } from 'react-i18next';

export const SkuFields = ({ variantIndex }: { variantIndex: number }) => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<AddNewProductFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.skus`,
  });

  const skus = watch(`variants.${variantIndex}.skus`);

  return (
    <div className="mt-3 space-y-2">
      {fields.map((field, skuIndex) => {
        const selectedSizes =
          skus?.map((s: ProductSku) => s.size).filter(Boolean) || [];

        return (
          <div key={field.id} className="flex items-end justify-between">
            <div className="flex items-end gap-2">
              <FormItem
                name={`variants.${variantIndex}.skus.${skuIndex}.size`}
                label={skuIndex === 0 ? t('admin.product.form.sizeLabel') : ''}
              >
                {({ field }) => (
                  <Select
                    {...field}
                    placeholder={t('admin.product.form.sizeLabel')}
                    options={PRODUCT_SIZE_SELECT_OPTIONS.map((opt) => ({
                      ...opt,
                      disabled:
                        opt.value !== field.value &&
                        selectedSizes.includes(opt.value),
                    }))}
                    size="large"
                    className="!w-[120px]"
                  />
                )}
              </FormItem>
              <Button danger type="text" onClick={() => remove(skuIndex)}>
                {t('admin.product.form.removeSize')}
              </Button>
            </div>

            <FormItem
              name={`variants.${variantIndex}.skus.${skuIndex}.quantity`}
              label={skuIndex === 0 ? t('admin.product.form.quantity') : ''}
            >
              <InputNumber
                min={0}
                placeholder="Stock"
                className="w-24"
                size="large"
              />
            </FormItem>
          </div>
        );
      })}

      <Button
        size="small"
        type="dashed"
        className="!mt-4"
        onClick={() => append({ size: '', quantity: 0 })}
      >
        + {t('admin.product.form.addSize')}
      </Button>
    </div>
  );
};
