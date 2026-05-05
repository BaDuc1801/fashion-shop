import { Button, Form, Input } from 'antd';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AddressAutocomplete,
  CartItem,
  FormItem,
  shippingService,
  useAuthStore,
  userService,
  voucherService,
} from '@shared';
import { getVoucherDiscount } from '../CartPage/utils/getDiscountVoucher';
import VoucherSection from '../CartPage/components/VoucherSection';
import PaymentMethodForm from './PaymentMethodForm';
import { useLocation } from 'react-router-dom';
import {
  OrderFormValues,
  orderFormSchema,
  orderFormSchemaDefaultValues,
} from './schemas/orderFormSchema';
import { useCreateOrder } from './hooks/useCreateOrder';
import useOrderSubmit from './hooks/useOrderSubmit';
import { zodResolver } from '@hookform/resolvers/zod';

const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const { state } = useLocation();
  const { user } = useAuthStore();
  const [selectedAddress, setSelectedAddress] = useState<{
    lat: string;
    lng: string;
  } | null>(null);

  const { buyNowItem } = state ?? {};

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema(t)),
    mode: 'onSubmit',
    defaultValues: {
      ...orderFormSchemaDefaultValues,
      voucherId: state?.voucherId,
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      address: user?.address ?? '',
    },
  });

  const { handleSubmit, watch, setValue } = form;

  const { data: shippingData } = useQuery({
    queryKey: ['shipping-fee', selectedAddress],
    queryFn: async () => {
      if (!selectedAddress) return null;

      return shippingService.calculateShipping(selectedAddress);
    },
    enabled: !!selectedAddress,
  });

  const shippingFee = shippingData?.shippingFee || 0;

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: userService.getCart,
    enabled: !state?.buyNowItem,
  });

  const { data: vouchersData } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => voucherService.getVouchers(),
  });

  const voucherId = watch('voucherId');

  const displayItems = useMemo(() => {
    if (buyNowItem) {
      return [
        {
          product: {
            _id: buyNowItem.productId,
            name: buyNowItem.name,
            nameEn: buyNowItem.nameEn,
            variants: [
              {
                images: [buyNowItem.image],
              },
            ],
            price: buyNowItem.price,
          },
          size: buyNowItem.size,
          color: buyNowItem.color,
          quantity: buyNowItem.quantity,
        },
      ];
    }

    return cartData ?? [];
  }, [buyNowItem, cartData]);

  const subtotal =
    displayItems?.reduce(
      (sum, it) => sum + it.quantity * it.product.price,
      0,
    ) ?? 0;

  const selectedVoucher = useMemo(
    () => vouchersData?.data?.find((v) => v._id === voucherId),
    [voucherId, vouchersData?.data],
  );

  const discount = useMemo(() => {
    if (!selectedVoucher) return 0;
    return getVoucherDiscount(
      subtotal,
      vouchersData?.data ?? [],
      selectedVoucher._id,
    );
  }, [selectedVoucher, subtotal, vouchersData?.data]);

  const total = Math.max(0, subtotal - discount + shippingFee);

  const { createOrder, isLoading } = useCreateOrder();
  const { onCheckoutSubmit } = useOrderSubmit({
    cartData: displayItems as CartItem[],
    selectedVoucher,
    createOrder,
  });

  return (
    <FormProvider {...form}>
      <Form layout="vertical" onFinish={handleSubmit(onCheckoutSubmit)}>
        <div className="max-w-6xl mx-auto py-10 grid grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('delivery')}</h3>

            <FormItem name="email">
              <Input placeholder={t('auth.email')} size="large" />
            </FormItem>

            <FormItem name="name">
              <Input placeholder={t('auth.username')} size="large" />
            </FormItem>

            <FormItem name="phone">
              {({ field }) => (
                <Input
                  required
                  {...field}
                  size="large"
                  placeholder={t('auth.phoneNumber')}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/\D/g, '');
                    field.onChange(onlyNumber);
                  }}
                />
              )}
            </FormItem>

            <FormItem name="address">
              <AddressAutocomplete
                onSelect={(data: {
                  address: string;
                  lat: string;
                  lng: string;
                }) => {
                  setValue('address', data.address);
                  setSelectedAddress({
                    lat: data.lat,
                    lng: data.lng,
                  });
                }}
              />
            </FormItem>

            <FormItem name="note">
              <Input.TextArea rows={3} placeholder={t('note')} size="large" />
            </FormItem>

            {/* PAYMENT */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">{t('paymentMethod')}</h3>

              <PaymentMethodForm
                t={t}
                value={watch('paymentMethod')}
                onChange={(val) => setValue('paymentMethod', val)}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="border p-4 rounded-lg">
              <h2 className="font-semibold mb-4">{t('summary')}</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span>${subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t('cart.estimatedDelivery')}</span>
                  <span className="font-semibold">${shippingFee}</span>
                </div>

                <VoucherSection
                  vouchers={vouchersData?.data ?? []}
                  subtotal={subtotal}
                  selectedVoucherId={voucherId}
                  onSelect={(id) => setValue('voucherId', id)}
                />

                <div className="flex justify-between">
                  <span>{t('cart.discount')}</span>
                  <span className="text-green-600">-${discount}</span>
                </div>

                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>{t('total')}</span>
                  <span>${total}</span>
                </div>
              </div>

              <Button
                htmlType="submit"
                type="primary"
                size="large"
                className="mt-4 w-full"
                loading={isLoading}
              >
                {t('placeOrder')}
              </Button>
            </div>

            {/* CART LIST */}
            <div className="border px-4 rounded-lg max-h-[500px] overflow-y-auto mt-4">
              {displayItems?.map((it) => (
                <div
                  key={`${it.product._id}-${it.size}-${it.color}`}
                  className="flex gap-4 justify-between border-b pb-4 mt-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={it.product.variants[0].images?.[0]}
                      className="w-20 h-20 object-cover"
                      alt={
                        i18n.language === 'en'
                          ? it.product.nameEn
                          : it.product.name
                      }
                    />
                    <div className="flex flex-col justify-between">
                      <div className="font-medium">
                        {i18n.language === 'en'
                          ? it.product.nameEn
                          : it.product.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {t('product.selectSize')}: {it.size} |{' '}
                        {t('product.selectColor')}:{' '}
                        <div
                          className="size-4 rounded-md shadow-md"
                          style={{ backgroundColor: it.color }}
                        />
                      </div>
                      <div className="text-sm">
                        {t('quantity')}: {it.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="font-semibold">
                    ${it.product.price * it.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
};

export default CheckoutPage;
