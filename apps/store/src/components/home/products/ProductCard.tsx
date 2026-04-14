import { Product } from '@shared';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className="rounded-sm overflow-hidden">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-[300px] w-full object-cover"
        />
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-semibold text-slate-900 truncate">
          {product.name}
        </h3>
        <div className="mt-1 text-sm font-bold text-slate-900">
          ${product.price}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
