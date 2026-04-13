import {
  Button,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from 'antd';
import type { UploadFile } from 'antd';
import { useEffect, useMemo } from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormItem, ImageUploader, ProductData } from '@shared';
import { PRODUCT_SIZE_SELECT_OPTIONS } from './constants/productSizeOptions';
import {
  addNewProductSchemaDefaultValues,
  createAddNewProductSchema,
  type AddNewProductFormValues,
} from './schemas/addNewProductSchema';

const DEFAULT_SWATCH = '#1677ff';
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

interface ProductFormProps {
  initialValues?: ProductData;
  isEdit?: boolean;
  showTitle?: boolean;
  submitting?: boolean;
  onSubmit?: (values: AddNewProductFormValues) => void | Promise<void>;
}

function SizeColorsFields({ sizeIndex }: { sizeIndex: number }) {
  const { t } = useTranslation();
  const { control } = useFormContext<AddNewProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sizeVariants.${sizeIndex}.colors`,
  });

  return (
    <div className="space-y-2 border-l-2 border-slate-200 pl-3">
      <div className="text-xs font-medium text-slate-500">
        {t('admin.product.form.colorsSection')}
      </div>
      <div className="max-h-48 overflow-y-auto overflow-x-hidden pr-1 space-y-2">
        {fields.map((field, colorIndex) => (
          <div key={field.id} className="flex flex-wrap items-end gap-2">
            <div className="min-w-[200px] flex-1">
              <FormItem
                name={`sizeVariants.${sizeIndex}.colors.${colorIndex}.name`}
                label={t('admin.product.form.color')}
              >
                {({ field }) => (
                  <ColorPicker
                    value={field.value}
                    onChange={(_, hex) => field.onChange(hex)}
                    showText
                    format="hex"
                    size="large"
                    disabledAlpha
                  />
                )}
              </FormItem>
            </div>
            <div className="w-32">
              <FormItem
                name={`sizeVariants.${sizeIndex}.colors.${colorIndex}.quantity`}
                label={t('admin.product.form.quantity')}
                getValueFromEvent={(value) => (value as number | null) ?? 0}
              >
                <InputNumber min={0} className="w-full" size="large" />
              </FormItem>
            </div>
            <Button type="text" danger onClick={() => remove(colorIndex)}>
              {t('admin.product.form.removeColor')}
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="dashed"
        size="small"
        onClick={() => append({ name: DEFAULT_SWATCH, quantity: 0 })}
      >
        {t('admin.product.form.addColor')}
      </Button>
    </div>
  );
}

const ProductForm = ({
  initialValues,
  isEdit,
  showTitle = true,
  submitting = false,
  onSubmit,
}: ProductFormProps) => {
  const { t } = useTranslation();
  const productSchema = createAddNewProductSchema(t);
  const form = useForm<AddNewProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: 'onSubmit',
    defaultValues: addNewProductSchemaDefaultValues,
  });
  const { handleSubmit, reset, control } = form;

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: 'sizeVariants',
  });

  const sizeVariantsWatch = useWatch({
    control,
    name: 'sizeVariants',
    defaultValue: addNewProductSchemaDefaultValues.sizeVariants,
  });

  const totalVariantStock = useMemo(() => {
    if (!sizeVariantsWatch?.length) return 0;
    return sizeVariantsWatch.reduce((sum, row) => {
      if (!row?.colors?.length) return sum;
      return (
        sum + row.colors.reduce((acc, c) => acc + (Number(c?.quantity) || 0), 0)
      );
    }, 0);
  }, [sizeVariantsWatch]);

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        sku: initialValues.sku,
        price: initialValues.price,
        status: initialValues.status === 'active',
        images: initialValues.images?.length
          ? initialValues.images.map((url, index) => ({
              uid: `${initialValues._id}-img-${index}`,
              name: `${initialValues.name}-${index + 1}`,
              status: 'done' as const,
              url,
            }))
          : [],
        sizeVariants:
          initialValues.sizeVariants && initialValues.sizeVariants.length > 0
            ? initialValues.sizeVariants.map((sv) => ({
                size: sv.size,
                colors: sv.colors.map((c) => ({
                  // Doi mau tu BE ve hex de ColorPicker + zod validate khong bi sai dinh dang.
                  name: HEX_COLOR_REGEX.test(c.name) ? c.name : DEFAULT_SWATCH,
                  quantity: c.quantity,
                })),
              }))
            : [
                {
                  size: '',
                  colors: [
                    { name: DEFAULT_SWATCH, quantity: initialValues.stock },
                  ],
                },
              ],
      });
    }
  }, [initialValues, reset]);

  const handleFinish = async (values: AddNewProductFormValues) => {
    await onSubmit?.(values);
  };

  return (
    <FormProvider {...form}>
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleFinish)}
        className="max-w-2xl space-y-2"
      >
        {showTitle ? (
          <h2 className="text-xl font-semibold">
            {isEdit
              ? t('admin.product.form.editTitle')
              : t('admin.product.form.addTitle')}
          </h2>
        ) : null}

        <FormItem name="images" label={t('admin.product.form.images')}>
          {({ field }) => (
            <ImageUploader
              fileList={(field.value as UploadFile[]) || []}
              onChange={(fileList) => field.onChange(fileList.slice(0, 6))}
              maxCount={6}
              uploadLabel={t('admin.product.form.upload')}
              multiple
            />
          )}
        </FormItem>

        <FormItem name="name" label={t('admin.product.form.name')}>
          <Input
            placeholder={t('admin.product.form.placeholderName')}
            size="large"
          />
        </FormItem>

        <FormItem name="sku" label={t('admin.product.form.sku')}>
          <Input
            placeholder={t('admin.product.form.placeholderSku')}
            size="large"
          />
        </FormItem>

        <FormItem
          name="price"
          label={t('admin.product.form.price')}
          getValueFromEvent={(value) => (value as number | null) ?? 0}
        >
          <InputNumber min={0} className="w-full" size="large" />
        </FormItem>

        <Form.Item label={t('admin.product.form.totalStock')} className="mb-0">
          <InputNumber
            value={totalVariantStock}
            disabled
            className="w-full"
            size="large"
          />
        </Form.Item>

        <div className="space-y-3 pt-1">
          <div className="text-sm font-semibold text-slate-800">
            {t('admin.product.form.sizesTitle')}
          </div>
          <div className="max-h-[min(420px,55vh)] overflow-y-auto overflow-x-hidden space-y-3 pr-1">
            {sizeFields.map((sizeField, sizeIndex) => (
              <div
                key={sizeField.id}
                className="space-y-3 rounded-md border border-slate-200 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-[160px] max-w-[240px] flex-1">
                    <FormItem
                      name={`sizeVariants.${sizeIndex}.size`}
                      label={t('admin.product.form.sizeLabel')}
                    >
                      {({ field }) => {
                        const selectedSizes = (sizeVariantsWatch ?? [])
                          .map((variant) => variant?.size)
                          .filter((size): size is string => Boolean(size));
                        const options = PRODUCT_SIZE_SELECT_OPTIONS.map((option) => ({
                          ...option,
                          disabled:
                            option.value !== field.value &&
                            selectedSizes.includes(option.value),
                        }));

                        return (
                          <Select
                            value={field.value || undefined}
                            onChange={(v) => field.onChange(v ?? '')}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            showSearch
                            optionFilterProp="label"
                            options={options}
                            placeholder={t('admin.product.form.placeholderSize')}
                            size="large"
                            className="w-full"
                          />
                        );
                      }}
                    </FormItem>
                  </div>
                  <Button
                    type="text"
                    danger
                    disabled={sizeFields.length <= 1}
                    onClick={() => removeSize(sizeIndex)}
                  >
                    {t('admin.product.form.removeSize')}
                  </Button>
                </div>
                <SizeColorsFields sizeIndex={sizeIndex} />
              </div>
            ))}
          </div>
          <Button
            type="dashed"
            block
            onClick={() =>
              appendSize({
                size: '',
                colors: [{ name: DEFAULT_SWATCH, quantity: 0 }],
              })
            }
          >
            {t('admin.product.form.addSize')}
          </Button>
        </div>

        <FormItem
          name="status"
          label={t('admin.product.form.active')}
          valuePropName="checked"
        >
          <Switch />
        </FormItem>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={submitting}
        >
          {isEdit
            ? t('admin.product.form.submitUpdate')
            : t('admin.product.form.submitCreate')}
        </Button>
      </Form>
    </FormProvider>
  );
};

export default ProductForm;
