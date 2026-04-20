import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import CategoryForm from './CategoryForm';
import { useCreateCategory } from './hooks/useCreateCategory';
import { categoryService, useDebouncedValue } from '@shared';

const CategoryAddPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ['categories', 'add-list', debouncedSearch],
    queryFn: () =>
      categoryService.getCategories({
        search: debouncedSearch,
        page: 1,
        limit: 100,
        lang: i18n.language,
      }),
  });

  const createCategoryMutation = useCreateCategory();

  const fromAddState: ReturnToAddNewState = {
    returnTo: ADD_NEW_PATH.categories,
  };

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/categories')}
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {t('admin.category.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title={t('admin.category.form.addTitle')} className="h-fit">
          <CategoryForm
            isEdit={false}
            showTitle={false}
            submitting={createCategoryMutation.isPending}
            onSubmit={async (values) => {
              await createCategoryMutation.mutateAsync(values);
            }}
          />
        </Card>
        <Card
          title={t('admin.category.addPage.existingListTitle')}
          className="h-fit"
        >
          <Input
            placeholder={t('admin.category.detail.listSearchPlaceholder')}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="mb-4"
          />
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden overscroll-y-contain">
            <List
              bordered
              dataSource={categoriesResponse?.data ?? []}
              locale={{ emptyText: t('admin.common.noData') }}
              loading={isLoading}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/categories/${item._id}`, { state: fromAddState })
                  }
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">
                      {i18n.language === 'vi' ? item.name : item.nameEn}
                    </span>
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

export default CategoryAddPage;
