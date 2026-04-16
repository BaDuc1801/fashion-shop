import { CartItem, CreateOrderRequest, Voucher } from '@shared';
import { OrderFormValues } from '../schemas/orderFormSchema';

interface Props {
  cartData?: CartItem[];
  selectedVoucher?: Voucher;
  createOrder: (data: CreateOrderRequest) => void;
}

const useOrderSubmit = ({ cartData, selectedVoucher, createOrder }: Props) => {
  const onCheckoutSubmit = (values: OrderFormValues) => {
    if (!cartData?.length) return;

    const payload: CreateOrderRequest = {
      items: cartData.map((it) => ({
        productId: it.product._id,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
      })),
      shippingAddress: {
        name: values.name,
        phone: values.phone,
        address: values.address,
        email: values.email,
      },
      voucherCode: selectedVoucher?.code,
      paymentMethod: values.paymentMethod,
      note: values.note,
    };

    createOrder(payload);
  };

  return { onCheckoutSubmit };
};

export default useOrderSubmit;
