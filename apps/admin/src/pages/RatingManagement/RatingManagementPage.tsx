import {
  ConfirmModal,
  RatingResponse,
  ratingService,
  useTableQuery,
} from '@shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  Image,
  Input,
  Select,
  Switch,
  Table,
  Tooltip,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa6';

const RatingManagementPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [rate, setRate] = useState<number | undefined>(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<RatingResponse | null>(
    null,
  );
  const [nextValue, setNextValue] = useState<boolean>(false);

  const { page, limit, search, searchText, setSearchText, onPageChange } =
    useTableQuery({
      defaultLimit: 10,
    });

  const queryParams = {
    page,
    limit,
    search,
    rate,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['ratings', queryParams],
    queryFn: () => ratingService.getAllReviewsAdmin(queryParams),
  });

  const toggleMutation = useMutation({
    mutationFn: (payload: { id: string; isPublic: boolean }) =>
      ratingService.togglePublish(payload.id),
    onSuccess: () => {
      message.success(t('updatedSuccessfully'));
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    },
    onError: () => {
      message.error(t('updateFailed'));
    },
  });

  const handleConfirmToggle = () => {
    if (!selectedRating) return;

    toggleMutation.mutate(
      {
        id: selectedRating._id,
        isPublic: nextValue,
      },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          setSelectedRating(null);
        },
      },
    );
  };

  const columns: ColumnsType<RatingResponse> = useMemo(
    () => [
      {
        title: t('user'),
        dataIndex: 'userId',
        key: 'user',
        render: (user) => (
          <div className="flex items-center gap-2">
            <Avatar src={user?.avatar} />
            <span>{user?.name}</span>
          </div>
        ),
      },
      {
        title: t('product'),
        dataIndex: 'productId',
        key: 'product',
        render: (product) => product?.name || product?._id,
      },
      {
        title: t('rating'),
        dataIndex: 'rating',
        key: 'rating',
        width: 100,
        render: (rating: number) => (
          <span className="font-semibold flex items-center gap-1">
            {rating} <FaStar className="text-yellow-400" />
          </span>
        ),
      },
      {
        title: t('comment'),
        dataIndex: 'comment',
        key: 'comment',
        width: 200,
        render: (comment: string) => (
          <Tooltip title={comment}>
            <span className="block truncate max-w-[200px]">{comment}</span>
          </Tooltip>
        ),
      },
      {
        title: t('images'),
        dataIndex: 'images',
        key: 'images',
        width: 260,
        render: (images: string[]) =>
          images?.length ? (
            <Image.PreviewGroup>
              <div className="flex gap-2">
                {images.slice(0, 5).map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    width={40}
                    height={40}
                    className="object-cover rounded"
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          ) : (
            '-'
          ),
      },
      {
        title: t('publish'),
        dataIndex: 'isPublic',
        key: 'isPublic',
        width: 80,
        render: (isPublic: boolean, record) => (
          <Switch
            checked={isPublic}
            onChange={(checked) => {
              setSelectedRating(record);
              setNextValue(checked);
              setConfirmOpen(true);
            }}
          />
        ),
      },
      {
        title: t('createdAt'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (date: string) => new Date(date).toLocaleString('en-US'),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('ratingAndReview')}</h1>

        <div className="flex items-center gap-4">
          <Select
            value={rate}
            size="large"
            placeholder={t('all')}
            onChange={(value) => setRate(value)}
            allowClear
            tagRender={(props) => {
              return (
                <span className="flex items-center gap-1">
                  {props.value} <FaStar className="text-yellow-400" />
                </span>
              );
            }}
            style={{ width: 120 }}
            options={[1, 2, 3, 4, 5].map((v) => ({
              value: v,
              label: (
                <span className="flex items-center gap-1">
                  {v} <FaStar className="text-yellow-400" />
                </span>
              ),
            }))}
          />

          <Input
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('search')}
          />
        </div>
      </div>

      <Table
        rowKey="_id"
        dataSource={data?.data || []}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.total,
          onChange: onPageChange,
        }}
      />
      <ConfirmModal
        open={confirmOpen}
        title={nextValue ? t('confirmPublishReview') : t('confirmHideReview')}
        isRating={true}
        confirmText={t('confirm')}
        cancelText={t('cancel')}
        loading={toggleMutation.isPending}
        onConfirm={handleConfirmToggle}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedRating(null);
        }}
      />
    </div>
  );
};

export default RatingManagementPage;
