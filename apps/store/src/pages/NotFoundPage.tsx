import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">404</h1>
      <p className="text-slate-700">{t('notFound.message')}</p>
      <Link className="text-sm font-medium text-sky-700 hover:underline" to="/">
        {t('notFound.goHome')}
      </Link>
    </section>
  );
}

