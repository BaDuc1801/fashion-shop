import OutProductsSection from '../components/home/products/ProductSection';
import CategorySection from '../components/home/category/CategorySection';
import HeroSection from '../components/hero/HeroSection';
import RecommendProductSection from '../components/home/category/RecommendProductSection';

const HomePage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <RecommendProductSection />
      <CategorySection />
      <OutProductsSection />
    </div>
  );
};

export { HomePage };
