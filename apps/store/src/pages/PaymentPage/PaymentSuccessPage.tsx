import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const orderId = new URLSearchParams(search).get('orderId');

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-pink-50">
      <div className="flex flex-col items-center justify-center px-8 pb-8 bg-white rounded-lg shadow-sm mb-20">
        <Result
          status="success"
          title={t('paymentProcessingSuccess')}
          subTitle={
            <div>
              <p className="text-base text-black">
                {t('yourOrderCode')}: {orderId}
              </p>
              <p className="text-base">
                {t('paymentProcessingSuccessDescription')}
              </p>
            </div>
          }
          className="!pb-4"
        />
        <Button
          type="primary"
          onClick={() => navigate('/user/orders')}
          className="mb-4 w-[160px]"
          size="large"
        >
          {t('viewOrder')}
        </Button>
        <Button
          onClick={() => navigate('/')}
          size="large"
          className="w-[160px]"
        >
          {t('backToHome')}
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
