import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import ProductForm from './ProductForm';
import { products } from './productsMockData';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as ReturnToAddNewState | null)?.returnTo;
  const isFromAddPage = returnTo === ADD_NEW_PATH.products;
  const [searchText, setSearchText] = useState('');
  const product = products.find((item) => item.id === id);
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [searchText],
  );

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
        <Card title={t('admin.product.form.editTitle')}>
          <ProductForm initialValues={product} isEdit showTitle={false} />
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
              dataSource={filteredProducts}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer ${
                    item.id === id ? 'bg-slate-100 font-medium' : ''
                  }`}
                  onClick={() =>
                    navigate(`/products/${item.id}`, { state: location.state })
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
