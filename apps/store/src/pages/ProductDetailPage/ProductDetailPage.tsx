import { Button, Spin, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NotFoundPage } from '../NotFoundPage';
import { CiHeart } from 'react-icons/ci';
import ProductReviewList from '../../components/productDetail/ProductReviewList';
import { productService, useAuthStore } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { FaHeart } from 'react-icons/fa';
import { useToggleWishlist } from './hooks/useWishList';
import { useToggleCart } from './hooks/useAddToCart';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user } = useAuthStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['product', sku, i18n.language],
    queryFn: () => {
      if (!sku) throw new Error('Missing product sku');
      return productService.getProductBySku(sku, i18n.language);
    },
    enabled: !!sku,
  });

  const selectedVariant = useMemo(
    () => data?.variants.find((v) => v.color === selectedColorId),
    [data, selectedColorId],
  );

  const toggleWishlist = useToggleWishlist();
  const toggleCart = useToggleCart();

  useEffect(() => {
    if (!data) return;

    const firstVariant = data.variants.find((v) =>
      v.skus.some((s) => s.quantity > 0),
    );

    if (!firstVariant) return;

    setSelectedColorId(firstVariant.color);

    const firstSize = firstVariant.skus.find((s) => s.quantity > 0)?.size;
    setSelectedSize(firstSize || '');
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[600px]">
        <Spin />
      </div>
    );

  if (!sku || !data) return <NotFoundPage />;

  return (
    <section className="py-6 mx-[200px]">
      <div className="flex items-start gap-10">
        {/* Gallery */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-4">
            {selectedVariant?.images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                className={[
                  'h-[72px] w-[72px] overflow-hidden rounded-sm border bg-white',
                  i === activeImageIndex
                    ? 'border-pink-300'
                    : 'border-slate-200 hover:border-slate-400',
                ].join(' ')}
              >
                <img
                  src={img}
                  alt={`${data.name} ${i + 1}`}
                  className="h-full w-full object-cover object-top"
                />
              </button>
            ))}
          </div>

          <div className="w-[520px] rounded-sm border border-slate-200 overflow-hidden bg-white">
            <img
              src={selectedVariant?.images[activeImageIndex]}
              alt={data.name}
              className="h-[520px] w-full object-cover object-top"
              onClick={() =>
                setActiveImageIndex((prev) =>
                  selectedVariant?.images.length
                    ? (prev + 1) % selectedVariant?.images.length
                    : 0,
                )
              }
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between h-[520px]">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">
              {i18n.language === 'en' ? data.nameEn : data.name}
            </h1>
            <Tooltip title={!user ? t('pleaseLogin') : ''}>
              <Button
                size="large"
                onClick={() =>
                  toggleWishlist.mutate({
                    productId: data._id,
                    inWishlist: data.inWishlist ?? false,
                  })
                }
                className={`hover:text-[#fb6f92] ${data.inWishlist ? 'border-[#fb6f92]' : ''}`}
                disabled={!user}
              >
                <text className={`${data.inWishlist ? 'text-[#fb6f92]' : ''}`}>
                  {t('product.favorited')}
                </text>
                {data.inWishlist ? (
                  <FaHeart className="text-[#fb6f92]" />
                ) : (
                  <CiHeart />
                )}
              </Button>
            </Tooltip>
          </div>

          <p className="text-base text-slate-600 max-w-[520px]">
            {i18n.language === 'en' ? data.descriptionEn : data.description}
          </p>

          {/* Price */}
          <div>
            <div className="text-sm font-semibold">{t('product.price')}</div>
            <div className="text-2xl font-bold">${data.price}</div>
          </div>

          {/* Stock */}
          <div>
            <div className="text-sm font-semibold">{t('product.stock')}</div>
            <div className="text-xl font-bold">
              {selectedVariant?.skus.find((s) => s.size === selectedSize)
                ?.quantity ?? 0}
            </div>
          </div>

          <div className="flex gap-8">
            {/* Size */}
            <div>
              <div className="text-sm font-semibold">
                {t('product.selectSize')}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedVariant?.skus.map((v) => {
                  const active = v.size === selectedSize;
                  return (
                    <button
                      key={v.size}
                      disabled={selectedVariant?.skus.every(
                        (s) => s.quantity === 0,
                      )}
                      onClick={() => setSelectedSize(v.size)}
                      className={[
                        'relative h-10 min-w-10 px-3 rounded-full border flex items-center justify-center',
                        active
                          ? 'border-pink-300 bg-pink-50'
                          : 'border-slate-200',
                        selectedVariant?.skus.every((s) => s.quantity === 0)
                          ? 'cursor-not-allowed opacity-60'
                          : '',
                      ].join(' ')}
                    >
                      {v.size}
                      {selectedVariant?.skus.every((s) => s.quantity === 0) && (
                        <span className="absolute text-red-400 text-xl font-bold">
                          ✕
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color */}
            <div>
              <div className="text-sm font-semibold">
                {t('product.selectColor')}
              </div>
              <div className="flex gap-2">
                {data.variants.map((v) => (
                  <button
                    key={v.color}
                    onClick={() => {
                      setSelectedColorId(v.color);

                      const firstSize = v.skus.find(
                        (s) => s.quantity > 0,
                      )?.size;

                      setSelectedSize(firstSize || '');
                    }}
                    className={[
                      'w-10 h-10 border',
                      selectedColorId === v.color
                        ? 'border-pink-400'
                        : 'border-gray-300',
                    ].join(' ')}
                    style={{ backgroundColor: v.color }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Actions */}
          <Tooltip title={!user ? t('pleaseLogin') : ''}>
            <div className="flex flex-col gap-2">
              <Button
                type="primary"
                size="large"
                onClick={() =>
                  toggleCart.mutate({
                    productId: data._id,
                    size: selectedSize,
                    color: selectedColorId,
                  })
                }
                disabled={!user}
              >
                {t('product.addToCart')}
              </Button>
              <Button
                size="large"
                onClick={() =>
                  navigate('/checkout', {
                    state: {
                      buyNowItem: {
                        productId: data._id,
                        name: data.name,
                        image: selectedVariant?.images[0],
                        price: data.price,
                        size: selectedSize,
                        color: selectedColorId,
                        quantity: 1,
                      },
                    },
                  })
                }
                disabled={!user}
              >
                {t('byNow')}
              </Button>
            </div>
          </Tooltip>
        </div>
      </div>

      <ProductReviewList
        reviews={data.reviews}
        ratingStats={data.ratingStats}
      />
    </section>
  );
};

export default ProductDetailPage;
