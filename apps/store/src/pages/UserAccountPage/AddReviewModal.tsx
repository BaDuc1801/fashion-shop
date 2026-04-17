import { Button, Form, Input, Modal, Rate } from 'antd';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { FormItem, ImageUploader } from '@shared';
import {
  createRatingFormSchema,
  RatingFormValues,
} from './schemas/ratingFormSchema';
import { useCreateReview } from './hooks/useCreateReview';

interface Props {
  open: boolean;
  onClose: () => void;
  productId: string;
  orderId: string;
}

const AddReviewModal = ({ open, onClose, productId, orderId }: Props) => {
  const { t } = useTranslation();
  const schema = createRatingFormSchema(t);

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 5,
      comment: '',
      images: [],
    },
  });

  const { handleSubmit, reset } = form;
  const { mutate, isPending } = useCreateReview(onClose, reset);

  const onSubmit = (values: RatingFormValues) => {
    mutate({
      orderId,
      productId,
      rating: values.rating,
      comment: values.comment || '',
      images: values.images || [],
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={t('addReview')}
      destroyOnClose
    >
      <FormProvider {...form}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <FormItem name="rating" label={t('rating')}>
            {({ field }) => (
              <Rate value={field.value} onChange={field.onChange} />
            )}
          </FormItem>

          <FormItem name="comment" label={t('comment')}>
            <Input.TextArea rows={4} />
          </FormItem>

          <FormItem name="images" label={t('images')}>
            {({ field }) => (
              <ImageUploader
                fileList={field.value || []}
                onChange={field.onChange}
                maxCount={5}
              />
            )}
          </FormItem>

          <Button type="primary" htmlType="submit" block loading={isPending}>
            {t('submit')}
          </Button>
        </Form>
      </FormProvider>
    </Modal>
  );
};

export default AddReviewModal;
