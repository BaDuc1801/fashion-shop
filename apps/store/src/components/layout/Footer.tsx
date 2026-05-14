import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const linkClass =
  'block max-w-full truncate text-sm text-slate-600 transition-colors hover:text-slate-900';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-x-hidden border-t border-slate-200 bg-gray-100">
      <div className="mx-auto w-full max-w-[1920px] px-4 py-10 max-md:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[200px]">
        <div className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-10">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold text-slate-900">
              {t('footer.brand')}
            </h2>
            <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600 sm:line-clamp-5 lg:line-clamp-6">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold uppercase tracking-wide text-slate-900">
              {t('footer.shop')}
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="min-w-0">
                <Link to="/category/men" className={linkClass}>
                  {t('nav.men')}
                </Link>
              </li>
              <li className="min-w-0">
                <Link to="/category/women" className={linkClass}>
                  {t('nav.women')}
                </Link>
              </li>
              <li className="min-w-0">
                <Link to="/category/new-arrivals" className={linkClass}>
                  {t('nav.newArrivals')}
                </Link>
              </li>
              <li className="min-w-0">
                <Link to="/category/sale" className={linkClass}>
                  {t('nav.sale')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold uppercase tracking-wide text-slate-900">
              {t('footer.support')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="min-w-0 truncate">{t('footer.contact')}</li>
              <li className="min-w-0 truncate">{t('footer.shipping')}</li>
              <li className="min-w-0 truncate">{t('footer.returns')}</li>
              <li className="min-w-0 truncate">{t('footer.faq')}</li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold uppercase tracking-wide text-slate-900">
              {t('footer.followUs')}
            </h3>
            <div className="mt-4 flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.socialFacebook')}
                className="shrink-0 rounded-full border border-slate-300 p-3 text-lg text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.socialInstagram')}
                className="shrink-0 rounded-full border border-slate-300 p-3 text-lg text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.socialTiktok')}
                className="shrink-0 rounded-full border border-slate-300 p-3 text-lg text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-5 text-center text-sm text-slate-500 max-md:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[200px]">
        <p className="mx-auto max-w-full break-words">
          {t('footer.copyright', { year })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
