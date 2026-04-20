import { orderService } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentFailedPage from './PaymentFailedPage';
import { useEffect } from 'react';

const SePayQRCard = () => {
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
  console.log(1);
  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true });
    }

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
    <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-pink-50">
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm mb-20 w-[600px] gap-4">
        <div className="text-center space-y-1">
          <div className="font-semibold text-lg">
            {order?.payment?.bankName}
          </div>
          <div className="text-sm text-gray-500">
            {order?.payment?.accountNumber}
          </div>
        </div>

        <img
          src={order?.payment?.qr}
          alt="SePay QR"
          className="w-80 object-contain border rounded-lg"
        />

        <div>
          <span className="font-medium">{t('amount')}:</span>
          {'  '}
          <span className="font-bold">
            {order?.payment?.amount?.toLocaleString('en-US')} VND
          </span>
        </div>

        <div className="text-center">
          <span className="font-medium">{t('content')}:</span>{' '}
          {order?.payment?.content}
        </div>
        <p className="text-sm text-gray-500">{t('noteKeepTransferContent')}</p>
      </div>
    </div>
  );
};

export default SePayQRCard;
