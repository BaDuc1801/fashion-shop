import type { BestSellerProduct } from './bestSellerData';

type BestSellerCardProps = {
  product: BestSellerProduct;
};

const BestSellerCard = ({ product }: BestSellerCardProps) => {
  return (
    <article className="rounded-sm overflow-hidden">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-[300px] w-full object-cover"
        />
        {product.isHot ? (
          <span className="absolute top-2 left-2 rounded-full bg-[#ffb3c6] px-3 py-1 text-[11px] font-semibold text-black">
            HOT
          </span>
        ) : null}
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

export default BestSellerCard;
