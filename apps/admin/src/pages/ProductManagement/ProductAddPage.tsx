import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService, useDebouncedValue } from '@shared';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import ProductForm from './ProductForm';
import { useCreateProduct } from './hooks/useCreateProduct';

const ProductAddPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['products', 'add-list', debouncedSearch],
    queryFn: () => productService.getProducts({ search: debouncedSearch }),
  });

  const createProductMutation = useCreateProduct();

  const fromAddState: ReturnToAddNewState = {
    returnTo: ADD_NEW_PATH.products,
  };

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/products')}
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {t('admin.product.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title={t('admin.product.form.addTitle')} className="h-fit">
          <ProductForm
            isEdit={false}
            showTitle={false}
            submitting={createProductMutation.isPending}
            onSubmit={async (values) => {
              await createProductMutation.mutateAsync(values);
            }}
          />
        </Card>
        <Card
          title={t('admin.product.addPage.existingListTitle')}
          className="h-fit"
        >
          <Input
            placeholder={t('admin.product.detail.listSearchPlaceholder')}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="mb-4"
          />
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden overscroll-y-contain">
            <List
              bordered
              dataSource={productsResponse?.data ?? []}
              locale={{ emptyText: t('admin.common.noData') }}
              loading={isLoading}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/products/${item.sku}`, { state: fromAddState })
                  }
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.sku}</span>
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

export default ProductAddPage;
