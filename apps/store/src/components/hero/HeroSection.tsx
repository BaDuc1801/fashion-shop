import heroBanner1 from '../../assets/hero-banner-1.png';
import HeroContent from './HeroContent';

const HeroSection = () => {
  return (
    <section className="inset-0 z-0 h-[calc(100vh-72px)] max-sm:h-[500px]">
      <img
        src={heroBanner1}
        alt="Men's New Arrivals"
        className="h-full w-full object-cover sm:object-top max-sm:object-[60%_100%]"
      />

      <HeroContent />
    </section>
  );
};

export default HeroSection;
