import { Button, Spin, Tooltip } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NotFoundPage } from '../NotFoundPage';
import { CiHeart } from 'react-icons/ci';
import ProductReviewList from '../../components/productDetail/ProductReviewList';
import {
  interactionService,
  productService,
  useAuthStore,
  type InteractionSource,
} from '@shared';
import { useQuery } from '@tanstack/react-query';
import { FaHeart } from 'react-icons/fa';
import { useToggleWishlist } from './hooks/useWishList';
import { useToggleCart } from './hooks/useAddToCart';
import AITryOnModal from './TryOnModal';
import RecommendedProductsCarousel from './RecommendedProductsCarousel';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { i18n } = useTranslation();
  const { user } = useAuthStore();

  type ProductDetailLocationState = {
    source?: InteractionSource;
  };

  const source = (state as ProductDetailLocationState | null)?.source;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [openAITryOnModal, setOpenAITryOnModal] = useState(false);
  const trackedViewProductIdRef = useRef<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['product', sku, i18n.language],
    queryFn: () => {
      if (!sku) throw new Error('Missing product sku');
      const looksLikeObjectId = /^[a-fA-F0-9]{24}$/.test(sku);
      if (looksLikeObjectId) return productService.getProductById(sku);
      return productService.getProductBySku(sku, i18n.language);
    },
    enabled: !!sku,
  });

  useEffect(() => {
    trackedViewProductIdRef.current = null;
  }, [sku]);

  useEffect(() => {
    if (!user) return;
    if (!data?._id) return;
    if (trackedViewProductIdRef.current === data._id) return;

    trackedViewProductIdRef.current = data._id;
    void interactionService
      .trackView({
        productId: data._id,
        source: source ?? 'organic',
      })
      .catch(() => undefined);
  }, [data?._id, source, user]);

  const selectedVariant = useMemo(
    () => data?.variants.find((v) => v.color === selectedColorId),
    [data, selectedColorId],
  );

  const maxAvailableStock = useMemo(() => {
    if (!selectedVariant || !selectedSize) return 0;
    const currentSku = selectedVariant.skus.find(
      (s) => s.size === selectedSize,
    );
    return currentSku ? currentSku.quantity : 0;
  }, [selectedVariant, selectedSize]);

  const toggleWishlist = useToggleWishlist();
  const toggleCart = useToggleCart();

  useEffect(() => {
    setQuantity(1);
  }, [selectedSize, selectedColorId]);

  useEffect(() => {
    if (!data) return;

    const firstVariant = data.variants.find((v) =>
      v.skus.some((s) => s.quantity > 0),
    );

    if (!firstVariant) {
      const defaultVariant = data.variants[0];
      if (defaultVariant) {
        setSelectedColorId(defaultVariant.color);
        setSelectedSize(defaultVariant.skus[0]?.size || '');
      }
      return;
    }

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
    <section className="xl:px-[120px] 2xl:px-[200px] py-6 max-xl:px-[48px]">
      <div className="flex items-start max-lg:items-center gap-10 max-lg:flex-col">
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

          <div className="w-[520px] max-xl:w-[400px] max-sm:w-[320px] rounded-sm border border-slate-200 overflow-hidden bg-white">
            <img
              src={selectedVariant?.images[activeImageIndex]}
              alt={data.name}
              className="h-[520px] max-xl:h-[400px] max-sm:h-[320px] w-full object-cover object-top"
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
        <div className="flex-1 flex flex-col justify-between h-fit gap-4">
          <div className="flex justify-between gap-4 flex-wrap">
            <h1 className="text-2xl font-semibold text-slate-900 truncate">
              {i18n.language === 'en' ? data.nameEn : data.name}
            </h1>
            <Tooltip title={!user ? t('pleaseLogin') : ''}>
              <div className="flex flex-col justify-end w-fit items-end gap-2">
                <Button
                  size="large"
                  onClick={() =>
                    toggleWishlist.mutate({
                      productId: data._id,
                      inWishlist: data.inWishlist ?? false,
                      source: source ?? 'organic',
                    })
                  }
                  className={`hover:text-[#fb6f92] w-40 ${data.inWishlist ? 'border-[#fb6f92]' : ''}`}
                  disabled={!user}
                >
                  <span
                    className={`${data.inWishlist ? 'text-[#fb6f92]' : ''}`}
                  >
                    {t('product.favorited')}
                  </span>
                  {data.inWishlist ? (
                    <FaHeart className="text-[#fb6f92]" />
                  ) : (
                    <CiHeart />
                  )}
                </Button>
                <Button
                  size="large"
                  className="!border-pink-200 w-40 !bg-pink-50 hover:!bg-pink-100 !text-pink-600 !font-medium disabled:!bg-slate-100 disabled:!text-slate-400 disabled:!border-slate-200"
                  onClick={() => {
                    setOpenAITryOnModal(true);
                  }}
                  disabled={!user}
                >
                  <span className="text-md" role="img" aria-label="star">
                    ✨
                  </span>{' '}
                  {t('tryOnAI')}
                </Button>
              </div>
            </Tooltip>
          </div>

          <p className="text-base text-slate-600 text-justify">
            {i18n.language === 'en' ? data.descriptionEn : data.description}
          </p>

          {/* Price */}
          <div>
            <div className="text-sm font-semibold">{t('product.price')}</div>
            <div className="text-2xl font-bold">${data.price}</div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="text-sm font-semibold">
              {t('product.selectSize')}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedVariant?.skus.map((v) => {
                const active = v.size === selectedSize;
                const isOutOfStock = v.quantity === 0;

                return (
                  <Tooltip title={isOutOfStock ? t('outOfStock') : ''}>
                    <button
                      key={v.size}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(v.size)}
                      className={[
                        'relative h-10 min-w-10 px-3 rounded-full border flex items-center justify-center transition-all',
                        active
                          ? 'border-pink-300 bg-pink-50 text-pink-600'
                          : 'border-slate-200 text-slate-800 hover:border-slate-400',
                        isOutOfStock
                          ? 'cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                          : '',
                      ].join(' ')}
                    >
                      {v.size}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
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
                    const firstSize = v.skus.find((s) => s.quantity > 0)?.size;
                    setSelectedSize(firstSize || v.skus[0]?.size || '');
                  }}
                  className={[
                    'w-10 h-10 border rounded-sm transition-all',
                    selectedColorId === v.color
                      ? 'border-pink-500 scale-105 shadow-sm'
                      : 'border-gray-300 hover:border-gray-400',
                  ].join(' ')}
                  style={{ backgroundColor: v.color }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <button
                disabled={quantity <= 1 || maxAvailableStock === 0}
                onClick={() => setQuantity(quantity - 1)}
                className="h-8 w-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>

              <div className="min-w-6 text-center text-sm font-semibold">
                {maxAvailableStock === 0 ? 0 : quantity}
              </div>

              <button
                disabled={
                  quantity >= maxAvailableStock || maxAvailableStock === 0
                }
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            {maxAvailableStock === 0 ? (
              <p className="text-red-500 text-sm mt-2 font-medium">
                {t('outOfStockAlert')}
              </p>
            ) : quantity >= maxAvailableStock ? (
              <p className="text-red-500 text-sm mt-2 font-medium">
                * {t('maxStockAlert')}
              </p>
            ) : null}
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
                    quantity: quantity,
                    source: source ?? 'organic',
                  })
                }
                disabled={!user || maxAvailableStock === 0}
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
                        nameEn: data.nameEn,
                        image: selectedVariant?.images[0],
                        price: data.price,
                        size: selectedSize,
                        color: selectedColorId,
                        quantity: quantity,
                      },
                    },
                  })
                }
                disabled={!user || maxAvailableStock === 0}
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
      <RecommendedProductsCarousel />
      <AITryOnModal
        open={openAITryOnModal}
        onClose={() => setOpenAITryOnModal(false)}
        product={data}
        selectedColorId={selectedColorId}
        language={i18n.language}
        t={t}
      />
    </section>
  );
};

export default ProductDetailPage;
