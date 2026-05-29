import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

type ProductCardProps = {
  product: {
    _id: string;
    name: string;
    nameEn?: string;
    price: number;
    variants?: Array<{
      images: string[];
    }>;
    images?: string[];
  };
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { i18n } = useTranslation();
  const displayName =
    i18n.language === 'en' ? (product.nameEn ?? product.name) : product.name;
  const imageSrc =
    product.variants?.[0]?.images?.[0] ?? product.images?.[0] ?? '';

  return (
    <article className="rounded-md overflow-hidden shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={displayName}
          className="h-[300px] w-full object-cover object-top transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-2">
        <Tooltip title={displayName}>
          <h3 className="text-lg font-semibold text-slate-900 truncate">
            {displayName}
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
