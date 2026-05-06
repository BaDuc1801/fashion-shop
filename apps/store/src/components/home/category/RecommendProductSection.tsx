import { Product, productService, useTableQuery } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { Input, Button, Spin, Pagination } from 'antd';
import { useState } from 'react';
import ProductCard from '../products/ProductCard';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RecommendProductSection = () => {
  const { t } = useTranslation();
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

  return (
    <div className="mt-20 px-[200px]">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          {t('notSureWhatToChoose')}
        </h2>
        <p className="mt-2 text-gray-500">
          {t('letOurAIHelpYouFindThePerfectOutfit')}
        </p>
      </div>

      <div className="mx-auto mb-10 flex max-w-2xl gap-2">
        <Input
          size="large"
          placeholder={t('searchRecommendProduct')}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onPressEnter={() => refetch()}
        />
        <Button
          type="primary"
          size="large"
          disabled={isFetching}
          className="!bg-[#fb6f92]"
          onClick={() => {
            refetch();
            onPageChange(1);
          }}
        >
          {t('find')}
        </Button>
      </div>

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
