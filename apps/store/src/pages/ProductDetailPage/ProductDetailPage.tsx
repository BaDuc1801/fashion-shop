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
  const toggleWishlist = useToggleWishlist();
  const toggleCart = useToggleCart();

  useEffect(() => {
    if (!data) return;
    setActiveImageIndex(0);
    const firstAvailableSize = data.sizeVariants.find((s) =>
      s.colors.some((c) => c.quantity > 0),
    );
    setSelectedSize(firstAvailableSize?.size ?? '');
  }, [data]);

  const selectedSizeVariant = useMemo(
    () => data?.sizeVariants.find((s) => s.size === selectedSize),
    [data, selectedSize],
  );

  useEffect(() => {
    if (!selectedSizeVariant) return;
    const firstAvailableColor = selectedSizeVariant.colors.find(
      (c) => c.quantity > 0,
    );

    setSelectedColorId(firstAvailableColor?.name ?? '');
  }, [selectedSizeVariant]);

  const selectedVariant = useMemo(
    () => selectedSizeVariant?.colors.find((c) => c.name === selectedColorId),
    [selectedSizeVariant, selectedColorId],
  );

  const activeImage = data?.images?.[activeImageIndex] ?? '';

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
          <div className="flex flex-col justify-between">
            {data.images.map((img, i) => (
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
              src={activeImage}
              alt={data.name}
              className="h-[520px] w-full object-cover object-top"
              onClick={() =>
                setActiveImageIndex((prev) =>
                  data.images.length ? (prev + 1) % data.images.length : 0,
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
              {selectedVariant?.quantity ?? 0}
            </div>
          </div>

          <div className="flex gap-8">
            {/* Size */}
            <div>
              <div className="text-sm font-semibold">
                {t('product.selectSize')}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.sizeVariants.map((s) => {
                  const active = s.size === selectedSize;
                  return (
                    <button
                      key={s.size}
                      disabled={s.colors.every((c) => c.quantity === 0)}
                      onClick={() => setSelectedSize(s.size)}
                      className={[
                        'relative h-10 px-3 rounded-full border flex items-center justify-center',
                        active
                          ? 'border-pink-300 bg-pink-50'
                          : 'border-slate-200',
                        s.colors.every((c) => c.quantity === 0)
                          ? 'cursor-not-allowed opacity-60'
                          : '',
                      ].join(' ')}
                    >
                      {s.size}
                      {s.colors.every((c) => c.quantity === 0) && (
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
              <div key={selectedSize} className="flex gap-3">
                {selectedSizeVariant?.colors.map((c) => {
                  const active = c.name === selectedColorId;
                  return (
                    <button
                      key={`${selectedSize}-${c.name}`}
                      onClick={() => setSelectedColorId(c.name)}
                      disabled={c.quantity === 0}
                      className={[
                        'relative h-10 w-10 border rounded-sm flex items-center justify-center',
                        active
                          ? 'border-pink-300 ring-2 ring-pink-100'
                          : 'border-slate-200',
                        c.quantity === 0 ? 'cursor-not-allowed opacity-60' : '',
                      ].join(' ')}
                      style={{ backgroundColor: c.name }}
                    >
                      {c.quantity === 0 && (
                        <span className="absolute text-red-400 text-xl font-bold">
                          ✕
                        </span>
                      )}
                    </button>
                  );
                })}
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
                        image: data.images?.[0],
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
