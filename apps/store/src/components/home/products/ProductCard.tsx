import { Product } from '@shared';
import { useTranslation } from 'react-i18next';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { i18n } = useTranslation();
  return (
    <article className="rounded-sm overflow-hidden">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-[300px] w-full object-cover object-top"
        />
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-slate-900 truncate">
          {i18n.language === 'en' ? product.nameEn : product.name}
        </h3>
        <div className="mt-1 text-sm font-bold text-slate-900">
          ${product.price}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
