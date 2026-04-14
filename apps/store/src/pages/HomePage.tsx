import OutProductsSection from '../components/home/products/ProductSection';
import CategorySection from '../components/home/category/CategorySection';
import HeroSection from '../components/hero/HeroSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <OutProductsSection />
    </>
  );
};

export { HomePage };
