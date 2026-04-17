import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { ApiErrorResponse, CreateOrderRequest, orderService } from '@shared';

export const useCreateOrder = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (values: CreateOrderRequest) =>
      orderService.createOrder({
        items: values.items,
        shippingAddress: values.shippingAddress,
        voucherCode: values.voucherCode,
        paymentMethod: values.paymentMethod,
        note: values.note,
      }),

    onSuccess: (res) => {
      const method = res?.order?.paymentMethod;

      if (method === 'cod') {
        navigate(`/order-success?orderId=${res.order._id}`);
        return;
      }

      if (method === 'sepay') {
        navigate(`/payment/sepay?orderId=${res.order._id}`);
        return;
      }

      if (res?.paymentUrl) {
        navigate(`/payment/processing?orderId=${res.order._id}`);
        window.location.href = res.paymentUrl;
        return;
      }
    },

    onError: (err: ApiErrorResponse) => {
      message.error(err?.message || 'Create order failed');
    },
  });

  return {
    createOrder: mutation.mutate,
    createOrderAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
