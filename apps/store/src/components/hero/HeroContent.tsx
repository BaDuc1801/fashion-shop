import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroContent = () => {
  const { t } = useTranslation();
  return (
    <div className="absolute inset-x-0 top-40 z-10 px-[200px]">
      <div className="max-w-3xl">
        <div className="text-base tracking-wide font-semibold uppercase">
          {t('hero.subtitle')}
        </div>

        <h1 className="mt-4 text-6xl md:text-7xl font-bold leading-[0.95]">
          {t('hero.titleLine1')}
          <br />
          {t('hero.titleLine2')}
        </h1>

        <p className="mt-4 text-base md:text-lg">
          {t('hero.description')}
        </p>

        <Link
          to="/collection/holiday-2026-women"
          className="inline-flex items-center justify-center mt-5 bg-black text-white px-8 py-4 rounded-sm text-base font-semibold hover:opacity-90 transition-opacity"
        >
          {t('hero.viewCollection')}
        </Link>
      </div>
    </div>
  );
};

export default HeroContent;
