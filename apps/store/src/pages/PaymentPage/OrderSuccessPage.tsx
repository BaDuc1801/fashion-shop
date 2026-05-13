import { interactionService, orderService } from '@shared';
import { useEffect, useRef } from 'react';
import { noop, useQuery } from '@tanstack/react-query';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const orderId = new URLSearchParams(search).get('orderId');
  const hasTrackedPurchaseRef = useRef(false);

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId as string),
    enabled: !!orderId,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (hasTrackedPurchaseRef.current) return;
    if (!order?.items?.length) return;

    hasTrackedPurchaseRef.current = true;
    const productIds = order.items.map((it) => it.productId);

    void interactionService.trackPurchase({ productIds }).catch(noop);
  }, [order]);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-pink-50">
      <div className="flex flex-col items-center justify-center px-8 pb-8 bg-white rounded-lg shadow-sm mb-20 w-[600px] max-sm:w-full">
        <Result
          status="success"
          title={t('orderSuccess')}
          subTitle={
            <div>
              <p className="text-base text-black">
                {t('yourOrderCode')}: {order?.orderCode}
              </p>
              <p className="text-base">{t('orderSuccessDescription')}</p>
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

export default OrderSuccessPage;
