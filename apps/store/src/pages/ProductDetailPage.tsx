import { Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NotFoundPage } from './NotFoundPage';
import {
  getMockProductById,
  type CategoryProduct,
} from '../components/home/category/categoryProductsData';
import { CiHeart } from 'react-icons/ci';
import ProductReviewList from '../components/productDetail/ProductReviewList';

const colorNameToHex = (name: string) => {
  const v = name.trim().toLowerCase();
  if (v === 'blue') return '#3b82f6';
  if (v === 'black') return '#111827';
  if (v === 'red') return '#ef4444';
  if (v === 'green') return '#22c55e';
  if (v === 'white') return '#f9fafb';
  if (v === 'brown') return '#8b5e34';
  return '#d1d5db';
};

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();

  const product: CategoryProduct | null = useMemo(
    () => (productId ? getMockProductById(productId) : null),
    [productId],
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<string>('');

  useEffect(() => {
    setActiveImageIndex(0);
    if (!product) return;
    setSelectedSize(product.sizes[0]?.id ?? '');
    setSelectedColorId(product.colors[0]?.id ?? '');
  }, [product]);

  const activeImage =
    product?.galleryImages?.[activeImageIndex] ?? product?.imageUrl ?? '';
  const selectedColor = useMemo(
    () => product?.colors.find((c) => c.id === selectedColorId),
    [product, selectedColorId],
  );

  if (!product) return <NotFoundPage />;

  return (
    <section className="py-6 mx-[200px]">
      <div className="flex items-start gap-10">
        {/* Gallery */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-3">
            {product.galleryImages.map((img, i) => (
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
                  alt={`${product.name} ${i + 1}`}
                  className="h-full w-full object-cover object-top"
                />
              </button>
            ))}
          </div>

          <div className="w-[520px] max-w-[520px] rounded-sm border border-slate-200 overflow-hidden bg-white">
            <img
              src={activeImage}
              alt={product.name}
              className="h-[520px] w-full object-cover object-top"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {product.name}
                {selectedColor ? ` (${selectedColor.name})` : null}
              </h1>
              <p className="mt-2 max-w-[520px] text-sm text-slate-600">
                {product.description}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="mt-6">
            <div className="text-sm font-semibold text-slate-900">
              {t('product.price')}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              ${product.price}
            </div>
          </div>

          {/* Size */}
          <div className="mt-6">
            <div className="text-sm font-semibold text-slate-900">
              {t('product.selectSize')}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const active = s.id === selectedSize;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSize(s.id)}
                    className={[
                      'h-10 min-w-[40px] rounded-full border px-3 text-sm font-medium',
                      active
                        ? 'border-pink-300 bg-pink-50 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400',
                    ].join(' ')}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div className="mt-6">
            <div className="text-sm font-semibold text-slate-900">
              {t('product.selectColor')}
            </div>
            <div className="mt-2 flex items-center gap-3">
              {product.colors.map((c) => {
                const active = c.id === selectedColorId;
                const swatch = colorNameToHex(c.name);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColorId(c.id)}
                    className={[
                      'h-10 w-10 rounded-sm border transition-colors',
                      active
                        ? 'border-pink-300 ring-2 ring-pink-100'
                        : 'border-slate-200 hover:border-slate-400',
                    ].join(' ')}
                    style={{ backgroundColor: swatch }}
                  >
                    <span className="sr-only">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <Button type="primary" size="large" className="w-full rounded-sm">
              {t('product.addToCart')}
            </Button>
            <Button size="large" className="w-full rounded-sm">
              {t('product.favorited')} <CiHeart />
            </Button>
          </div>
        </div>
      </div>

      <ProductReviewList productId={product.id} />
    </section>
  );
};

export default ProductDetailPage;
