import OutProductsSection from '../components/home/products/ProductSection';
import CategorySection from '../components/home/category/CategorySection';
import HeroSection from '../components/hero/HeroSection';
import RecommendProductSection from '../components/home/category/RecommendProductSection';
import RecommendedProductsCarousel from './ProductDetailPage/RecommendedProductsCarousel';

const HomePage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <RecommendProductSection />
      <CategorySection />
      <RecommendedProductsCarousel onlyTrending />
      <OutProductsSection />
    </div>
  );
};

export { HomePage };
