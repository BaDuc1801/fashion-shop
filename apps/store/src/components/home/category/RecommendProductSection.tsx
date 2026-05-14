import { Product, productService, useAuthStore, useTableQuery } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { Input, Button, Spin, Pagination, Tooltip } from 'antd';
import { useState } from 'react';
import ProductCard from '../products/ProductCard';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RecommendProductSection = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [prompt, setPrompt] = useState('');
  const { page, onPageChange } = useTableQuery({
    defaultPage: 1,
    defaultLimit: 8,
  });

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['recommend-products'],
    queryFn: () => productService.getProductByPrompt(prompt),
    enabled: false,
  });

  const paginatedData = data?.data?.slice((page - 1) * 8, page * 8);
  const canSubmit = Boolean(prompt.trim());

  const runSearch = () => {
    if (!canSubmit) return;
    refetch();
    onPageChange(1);
  };

  return (
    <div className="mt-20 px-8 lg:px-12 xl:px-20 2xl:px-32">
      <div className="mb-8 text-center">
        <h2 className="text-3xl max-md:text-2xl font-bold text-gray-800">
          {t('notSureWhatToChoose')}
        </h2>
        <p className="mt-2 text-gray-500">
          {t('letOurAIHelpYouFindThePerfectOutfit')}
        </p>
      </div>

      <Tooltip title={!user ? t('pleaseLogin') : ''}>
        <div className="mx-auto mb-10 flex max-w-2xl gap-2">
          <Input
            disabled={!user || isFetching}
            size="large"
            placeholder={t('searchRecommendProduct')}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onPressEnter={runSearch}
          />
          <Button
            type="primary"
            size="large"
            disabled={isFetching || !user || !canSubmit}
            className="!bg-[#fb6f92]"
            onClick={runSearch}
          >
            {t('find')}
          </Button>
        </div>
      </Tooltip>

      {isFetching ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {paginatedData?.map((item: Product) => (
            <Link key={item._id} to={`/products/${item.sku}`} className="block">
              <ProductCard key={item._id} product={item} />
            </Link>
          ))}
        </div>
      )}
      {(data?.data?.length || 0) > 8 && (
        <Pagination
          className="mt-6 flex justify-center"
          current={page}
          pageSize={8}
          total={data?.data?.length}
          onChange={onPageChange}
        />
      )}
    </div>
  );
};

export default RecommendProductSection;
