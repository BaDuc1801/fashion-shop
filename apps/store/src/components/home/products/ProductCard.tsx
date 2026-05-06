import { Product } from '@shared';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { i18n } = useTranslation();
  return (
    <article className="rounded-md overflow-hidden shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={product.variants[0].images[0]}
          alt={product.name}
          className="h-[300px] w-full object-cover object-top transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-2">
        <Tooltip title={i18n.language === 'en' ? product.nameEn : product.name}>
          <h3 className="text-lg font-semibold text-slate-900 truncate">
            {i18n.language === 'en' ? product.nameEn : product.name}
          </h3>
        </Tooltip>
        <div className="mt-1 text-sm font-bold text-slate-900">
          ${product.price}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
