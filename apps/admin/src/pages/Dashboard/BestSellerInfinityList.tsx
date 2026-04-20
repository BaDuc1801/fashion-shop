import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spin, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { productService, BestSellerProduct } from '@shared';
import { useTranslation } from 'react-i18next';

const LIMIT = 5;

const BestSellerInfinityList = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<BestSellerProduct[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['best-seller-infinite', page],
    queryFn: () =>
      productService.getBestSellerProducts({
        page,
        limit: LIMIT,
        lang: i18n.language,
      }),
  });

  useEffect(() => {
    if (!data) return;

    if (page === 1) {
      setProducts(data.data);
    } else {
      setProducts((prev) => [...prev, ...data.data]);
    }

    if (data.data.length < LIMIT) {
      setHasMore(false);
    }
  }, [data, page]);

  useEffect(() => {
    if (!loaderRef.current) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  return (
    <Card title="Recent Orders">
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
        {products?.map((product) => (
          <div
            key={product.productId}
            onClick={() => navigate(`/products/${product.sku}`)}
            className="cursor-pointer rounded-lg border p-3 hover:shadow transition"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2 flex items-center gap-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="font-medium">
                  {i18n.language === 'vi' ? product.name : product.nameEn}
                </div>
              </div>
              <span>$ {product.price}</span>
              <span className="text-right">
                Sold: <span className="font-bold">{product.totalSold}</span>
              </span>
            </div>
          </div>
        ))}

        <div ref={loaderRef} className="flex justify-center py-3">
          {isLoading || isFetching ? <Spin /> : null}
          {!hasMore && products.length > 0 && (
            <span className="text-gray-400 text-sm">No more products</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BestSellerInfinityList;
