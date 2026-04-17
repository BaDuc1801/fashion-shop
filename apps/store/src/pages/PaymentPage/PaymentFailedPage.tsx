import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PaymentFailedPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-pink-50">
      <div className="flex flex-col items-center justify-center px-8 pb-8 bg-white rounded-lg shadow-sm mb-20">
        <Result
          status="error"
          title={t('paymentProcessingFailed')}
          subTitle={t('paymentProcessingError')}
        />
        <Button type="primary" onClick={() => navigate('/')}>
          {t('backToHome')}
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
