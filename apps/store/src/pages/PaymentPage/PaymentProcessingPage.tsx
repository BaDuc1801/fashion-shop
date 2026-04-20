import { orderService } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { Button, message, Spin } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentFailedPage from './PaymentFailedPage';

const PaymentProcessingPage = () => {
  const { search } = useLocation();
  const orderId = new URLSearchParams(search).get('orderId');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: order, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId as string),
    enabled: !!orderId,

    refetchInterval: (query) => {
      if (query.state.error) return false;
      const data = query?.state?.data?.orderStatus as string;
      if (data === 'paid' || data === 'failed') {
        return false;
      }

      return 3000;
    },
  });

  const handleCancelPayment = async () => {
    await orderService.cancelOrder(orderId as string);
    navigate('/', { replace: true });
    message.success(t('cancelPaymentSuccess'));
  };

  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true });
    }
    console.log(order?.orderStatus);
    if (order?.orderStatus === 'paid') {
      navigate(`/payment/success?orderId=${order.orderCode}`, {
        replace: true,
      });
    }

    if (order?.orderStatus === 'failed') {
      navigate(`/payment/failed?orderId=${order.orderCode}`, {
        replace: true,
      });
    }
  }, [order?.orderStatus, order?.orderCode, navigate, orderId]);

  if (error) {
    return <PaymentFailedPage />;
  }

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-pink-50">
      <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-lg shadow-sm mb-20">
        <div className="flex flex-col items-center justify-center gap-8">
          <h1 className="text-2xl font-semibold">{t('paymentProcessing')}</h1>
          <Spin size="large" />
          <div className="text-center">
            <p className="text-gray-600">{t('paymentProcessingDescription')}</p>
          </div>
        </div>
        <div className="text-center">{t('or')}</div>
        <Button type="primary" size="large" onClick={handleCancelPayment}>
          {t('cancelPayment')}
        </Button>
      </div>
    </div>
  );
};

export default PaymentProcessingPage;
