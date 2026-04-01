import BestSellerSection from '../components/home/bestSeller/BestSellerSection';
import CategorySection from '../components/home/category/CategorySection';
import HeroSection from '../components/hero/HeroSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <BestSellerSection />
    </>
  );
};

export { HomePage };
