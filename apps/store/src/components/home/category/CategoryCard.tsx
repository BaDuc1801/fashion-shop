import { Link } from 'react-router-dom';
import { CategoryItem } from './categoryData';

type CategoryCardProps = {
  category: CategoryItem;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      to={`/category/${category.id}`}
      className="block w-full shrink-0 rounded-sm"
    >
      <article className="w-full shrink-0 relative">
        <div className="overflow-hidden bg-slate-100">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="h-[400px] w-full object-cover object-top transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="absolute shadow-lg whitespace-nowrap bottom-8 left-1/2 -translate-x-1/2 bg-white px-8 py-1 text-sm font-semibold">
          {category.name} ({category.itemCount})
        </div>
      </article>
    </Link>
  );
};

export default CategoryCard;
