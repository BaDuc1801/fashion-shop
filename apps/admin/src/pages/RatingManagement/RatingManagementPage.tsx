import {
  ConfirmModal,
  MaskedSelection,
  RatingResponse,
  ratingService,
  useTableQuery,
} from '@shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  Button,
  Image,
  Input,
  Modal,
  Select,
  Switch,
  Table,
  Tooltip,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa6';
import { normalizeRanges, renderHighlightedText } from './utils/masking';

const RatingManagementPage = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const [rate, setRate] = useState<number | undefined>(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<RatingResponse | null>(
    null,
  );
  const [nextValue, setNextValue] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<RatingResponse | null>(
    null,
  );

  const [sensitiveWords, setSensitiveWords] = useState<[number, number][]>([]);
  const textRef = useRef<HTMLDivElement | null>(null);

  const { page, limit, searchText, setSearchText, onPageChange } =
    useTableQuery({ defaultLimit: 10 });

  const queryParams = { page, limit, search: searchText, rate };

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
  });

  const maskMutation = useMutation({
    mutationFn: (payload: MaskedSelection) =>
      ratingService.maskComment(payload),
    onSuccess: () => {
      message.success(t('updatedSuccessfully'));
      setDetailOpen(false);
      setSensitiveWords([]);
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    },
  });

  const handleSaveMask = () => {
    if (!selectedDetail) return;

    maskMutation.mutate({
      ratingId: selectedDetail._id,
      ranges: sensitiveWords,
    });
  };

  const handleConfirmToggle = () => {
    if (!selectedRating) return;

    toggleMutation.mutate({
      id: selectedRating._id,
      isPublic: nextValue,
    });

    setConfirmOpen(false);
    setSelectedRating(null);
  };

  const handleMouseUp = () => {
    const el = textRef.current;
    if (!el) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    const pre = range.cloneRange();
    pre.selectNodeContents(el);
    pre.setEnd(range.startContainer, range.startOffset);

    const start = pre.toString().length;
    const end = start + range.toString().length;

    if (start === end) return;

    const max = selectedDetail?.comment?.length || 0;

    const next = normalizeRanges([...sensitiveWords, [start, end]], max);

    setSensitiveWords(next);
    selection.removeAllRanges();
  };

  const columns: ColumnsType<RatingResponse> = useMemo(
    () => [
      {
        title: t('user'),
        dataIndex: 'userId',
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
        render: (product) => product?.name || product?._id,
      },
      {
        title: t('rating'),
        dataIndex: 'rating',
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
        width: 300,
        render: (comment: string, record) => (
          <Tooltip title={record.maskedComment || comment}>
            <span className="block !line-clamp-3 max-w-[200px]">
              {record.maskedComment || comment}
            </span>
          </Tooltip>
        ),
      },
      {
        title: t('images'),
        dataIndex: 'images',
        width: 260,
        render: (images: string[]) =>
          images?.length ? (
            <Image.PreviewGroup>
              <div className="flex gap-2">
                {images.slice(0, 5).map((img, idx) => (
                  <Image key={idx} src={img} width={40} height={40} />
                ))}
              </div>
            </Image.PreviewGroup>
          ) : (
            '-'
          ),
      },
      {
        title: t('createdAt'),
        dataIndex: 'createdAt',
        width: 170,
        render: (date: string) => new Date(date).toLocaleString(),
      },
      {
        title: t('publish'),
        dataIndex: 'isPublic',
        width: 80,
        render: (isPublic: boolean, record) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={isPublic}
              onChange={(checked) => {
                setSelectedRating(record);
                setNextValue(checked);
                setConfirmOpen(true);
              }}
            />
          </div>
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('ratingAndReview')}</h1>

      <div className="flex items-end justify-end">
        <div className="flex items-center gap-4">
          <Select
            value={rate}
            size="large"
            placeholder={t('all')}
            onChange={setRate}
            allowClear
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
        onRow={(record) => ({
          onClick: () => {
            setSelectedDetail(record);
            setSensitiveWords(record.maskedRanges || []);
            setDetailOpen(true);
          },
        })}
        rowClassName={(record) =>
          record.isToxic && !record.isPublic ? 'bg-red-50' : ''
        }
      />

      <ConfirmModal
        open={confirmOpen}
        title={nextValue ? t('confirmPublishReview') : t('confirmHideReview')}
        isRating
        confirmText={t('confirm')}
        cancelText={t('cancel')}
        loading={toggleMutation.isPending}
        onConfirm={handleConfirmToggle}
        onCancel={() => setConfirmOpen(false)}
      />

      <Modal
        open={detailOpen}
        title={t('reviewDetail')}
        onCancel={() => setDetailOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setDetailOpen(false);
                setSensitiveWords([]);
              }}
              className="px-4 py-2 rounded border"
            >
              {t('cancel')}
            </Button>

            <Button
              onClick={handleSaveMask}
              disabled={!sensitiveWords.length || maskMutation.isPending}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              loading={maskMutation.isPending}
            >
              {t('save')}
            </Button>
          </div>
        }
        closable={false}
        okText={t('close')}
        onOk={() => setDetailOpen(false)}
      >
        <div className="flex flex-col gap-3">
          {selectedDetail?.isToxic && (
            <div>
              <p className="font-semibold">{t('toxicReason')}:</p>
              <p className="text-red-500">
                {i18n.language === 'vi'
                  ? selectedDetail?.toxicityReason
                  : selectedDetail?.toxicityReasonEn}
              </p>
            </div>
          )}

          <div>
            <p className="font-semibold">{t('comment')}:</p>

            <div
              ref={textRef}
              onMouseUp={handleMouseUp}
              className="p-2 bg-gray-100 rounded whitespace-pre-wrap"
            >
              {renderHighlightedText(
                selectedDetail?.comment || '',
                sensitiveWords,
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {sensitiveWords.map(([start, end], idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full relative border border-blue-400"
              >
                {selectedDetail?.comment?.slice(start, end)}
                <div
                  onClick={() =>
                    setSensitiveWords((prev) =>
                      prev.filter((_, i) => i !== idx),
                    )
                  }
                  className="absolute -right-1 -top-1 bg-[#D14C1B] size-3 rounded-full flex items-center justify-center cursor-pointer text-white"
                >
                  ×
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RatingManagementPage;
