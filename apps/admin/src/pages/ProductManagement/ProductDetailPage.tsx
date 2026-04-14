import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List, Popconfirm } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService, useDebouncedValue } from '@shared';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import ProductForm from './ProductForm';
import { useDeleteProduct } from './hooks/useDeleteProduct';
import { useUpdateProduct } from './hooks/useUpdateProduct';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { sku: productSku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as ReturnToAddNewState | null)?.returnTo;
  const isFromAddPage = returnTo === ADD_NEW_PATH.products;
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: listResponse, isLoading: isListLoading } = useQuery({
    queryKey: ['products', 'detail-list', debouncedSearch],
    queryFn: () =>
      productService.getProducts({
        search: debouncedSearch,
      }),
  });

  const { data: productResponse, isLoading: isProductLoading } = useQuery({
    queryKey: ['products', 'detail-by-sku', productSku],
    enabled: Boolean(productSku),
    retry: false,
    queryFn: () => {
      if (!productSku) throw new Error('Missing product sku');
      return productService.getProductBySku(productSku);
    },
  });

  const updateProductMutation = useUpdateProduct({
    productId: productResponse?._id,
    currentSku: productSku,
  });
  const deleteProductMutation = useDeleteProduct({
    productId: productResponse?._id,
  });

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          navigate(isFromAddPage ? ADD_NEW_PATH.products : '/products')
        }
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {isFromAddPage
          ? t('admin.product.detail.backToAddNew')
          : t('admin.product.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title={t('admin.product.form.editTitle')}
          loading={isProductLoading}
          extra={
            <Popconfirm
              title={t('admin.product.form.deleteConfirm')}
              okText={t('admin.confirmModal.confirmText')}
              cancelText={t('admin.confirmModal.cancelText')}
              onConfirm={() => deleteProductMutation.mutate()}
            >
              <Button danger loading={deleteProductMutation.isPending}>
                {t('admin.product.form.delete')}
              </Button>
            </Popconfirm>
          }
        >
          <ProductForm
            initialValues={productResponse}
            isEdit
            showTitle={false}
            submitting={updateProductMutation.isPending}
            onSubmit={async (values) => {
              await updateProductMutation.mutateAsync(values);
            }}
          />
        </Card>
        <Card title={t('admin.product.detail.listTitle')} className="h-fit">
          <Input
            placeholder={t('admin.product.detail.listSearchPlaceholder')}
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
                    item.sku === productSku ? 'bg-slate-100 font-medium' : ''
                  }`}
                  onClick={() =>
                    navigate(`/products/${item.sku}`, { state: location.state })
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

export default ProductDetailPage;
