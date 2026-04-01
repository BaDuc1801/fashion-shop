import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import CategoryCard from './CategoryCard';
import { categoryData } from './categoryData';

const CategorySection = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    const item = container.querySelector('article') as HTMLElement;
    if (!item) return;

    const itemWidth = item.offsetWidth;

    container.scrollBy({
      left: direction === 'left' ? -itemWidth : itemWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="mt-20 mx-[200px]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('home.shopByCategories')}</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-pink-100"
          >
            <FiChevronLeft />
          </button>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-pink-100"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex w-full overflow-x-auto scroll-smooth snap-x snap-mandatory gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categoryData.map((category) => (
          <div
            key={category.id}
            className="w-[calc((100%-96px)/4)] shrink-0 snap-start"
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
