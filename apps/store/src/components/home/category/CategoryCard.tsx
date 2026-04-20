import { Link } from 'react-router-dom';
import { Category } from '@fashion-monorepo/shared';
import { useTranslation } from 'react-i18next';

type CategoryCardProps = {
  category: Category;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { i18n } = useTranslation();

  return (
    <Link
      to={`/category/${category.slug}`}
      className="block w-full shrink-0 rounded-sm"
    >
      <article className="w-full shrink-0 relative">
        <div className="overflow-hidden bg-slate-100">
          <img
            src={category.image}
            alt={category.name}
            className="h-[400px] w-full object-cover object-top transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="absolute shadow-lg whitespace-nowrap bottom-8 left-1/2 -translate-x-1/2 bg-white px-8 py-1 text-sm font-semibold">
          {i18n.language === 'vi' ? category.name : category.nameEn} (
          {category.productCount})
        </div>
      </article>
    </Link>
  );
};

export default CategoryCard;
