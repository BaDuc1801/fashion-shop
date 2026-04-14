import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List, Popconfirm } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import CategoryForm from './CategoryForm';
import { useDeleteCategory } from './hooks/useDeleteCategory';
import { useUpdateCategory } from './hooks/useUpdateCategory';
import { categoryService, useDebouncedValue } from '@shared';

const CategoryDetailPage = () => {
  const { t } = useTranslation();
  const { id: categoryId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as ReturnToAddNewState | null)?.returnTo;
  const isFromAddPage = returnTo === ADD_NEW_PATH.categories;
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: listResponse, isLoading: isListLoading } = useQuery({
    queryKey: ['categories', 'detail-list', debouncedSearch],
    queryFn: () =>
      categoryService.getCategories({
        search: debouncedSearch,
        page: 1,
        limit: 100,
      }),
  });

  const { data: categoryResponse, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['categories', 'detail-by-id', categoryId],
    enabled: Boolean(categoryId),
    queryFn: () => {
      if (!categoryId) throw new Error('Missing category id');
      return categoryService.getCategoryById(categoryId);
    },
  });

  const updateCategoryMutation = useUpdateCategory({
    categoryId: categoryResponse?._id,
    currentCategoryId: categoryId,
  });
  const deleteCategoryMutation = useDeleteCategory({
    categoryId: categoryResponse?._id,
  });

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          navigate(isFromAddPage ? ADD_NEW_PATH.categories : '/categories')
        }
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {isFromAddPage
          ? t('admin.category.detail.backToAddNew')
          : t('admin.category.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title={t('admin.category.form.editTitle')}
          loading={isCategoryLoading}
          extra={
            <Popconfirm
              title={t('admin.category.form.deleteConfirm')}
              okText={t('admin.confirmModal.confirmText')}
              cancelText={t('admin.confirmModal.cancelText')}
              onConfirm={() => deleteCategoryMutation.mutate()}
            >
              <Button danger loading={deleteCategoryMutation.isPending}>
                {t('admin.category.form.delete')}
              </Button>
            </Popconfirm>
          }
        >
          <CategoryForm
            initialValues={categoryResponse}
            isEdit
            showTitle={false}
            submitting={updateCategoryMutation.isPending}
            onSubmit={async (values) => {
              await updateCategoryMutation.mutateAsync(values);
            }}
          />
        </Card>
        <Card title={t('admin.category.detail.listTitle')} className="h-fit">
          <Input
            placeholder={t('admin.category.detail.listSearchPlaceholder')}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="mb-4"
          />
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden overscroll-y-contain">
            <List
              bordered
              dataSource={listResponse?.data ?? []}
              locale={{ emptyText: t('admin.common.noData') }}
              loading={isListLoading}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer ${
                    item._id === categoryId ? 'bg-slate-100 font-medium' : ''
                  }`}
                  onClick={() =>
                    navigate(`/categories/${item._id}`, {
                      state: location.state,
                    })
                  }
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.slug}</span>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CategoryDetailPage;
