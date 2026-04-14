import { useTranslation } from 'react-i18next';

const HeroContent = () => {
  const { t } = useTranslation();
  return (
    <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-[200px]">
      <div className="max-w-3xl">
        <div className="text-base tracking-wide font-semibold uppercase">
          {t('hero.subtitle')}
        </div>

        <h1 className="mt-4 text-6xl md:text-7xl font-bold leading-[0.95]">
          {t('hero.titleLine1')}
          <br />
          {t('hero.titleLine2')}
        </h1>

        <p className="mt-4 text-base md:text-lg">{t('hero.description')}</p>
      </div>
    </div>
  );
};

export default HeroContent;
