import { Button, Empty, Modal } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import VoucherSection from './components/VoucherSection';
import { CartItem, userService, voucherService } from '@shared';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVoucherDiscount } from './utils/getDiscountVoucher';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => userService.getCart(),
  });

  const { data: vouchersData } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => voucherService.getVouchers(),
  });

  const updateCart = useMutation({
    mutationFn: userService.updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeCart = useMutation({
    mutationFn: userService.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const [selectedVoucherId, setSelectedVoucherId] = useState<string>();

  const vouchers = useMemo(() => vouchersData?.data ?? [], [vouchersData]);

  const subtotal =
    cartData?.reduce((sum, it) => sum + it.quantity * it.product.price, 0) ?? 0;

  const selectedVoucher = useMemo(
    () => vouchers.find((v) => v._id === selectedVoucherId),
    [vouchers, selectedVoucherId],
  );

  const discount = useMemo(() => {
    if (!selectedVoucher) return 0;
    return getVoucherDiscount(subtotal, vouchers, selectedVoucher._id);
  }, [selectedVoucher, subtotal, vouchers]);

  const total = Math.max(0, subtotal - discount);

  useEffect(() => {
    if (!selectedVoucher) return;
    if (
      selectedVoucher.minOrderValue &&
      subtotal < selectedVoucher.minOrderValue
    ) {
      setSelectedVoucherId(undefined);
    }
  }, [selectedVoucher, subtotal]);

  const handleDecrease = (it: CartItem) => {
    if (it.quantity === 1) {
      Modal.confirm({
        title: t('product.removeItem'),
        content: (
          <span className="text-sm">
            <Trans
              i18nKey="product.removeItemConfirm"
              values={{ name: it.product.name }}
              components={[<span className="font-semibold" />]}
            />
          </span>
        ),
        okText: t('product.remove'),
        cancelText: t('product.cancel'),
        okButtonProps: { danger: true },

        onOk: () =>
          removeCart.mutate({
            productId: it.product._id,
            size: it.size,
            color: it.color,
          }),
      });
    } else {
      updateCart.mutate({
        productId: it.product._id,
        size: it.size,
        color: it.color,
        quantity: it.quantity - 1,
      });
    }
  };

  const handleIncrease = (it: CartItem) => {
    updateCart.mutate({
      productId: it.product._id,
      size: it.size,
      color: it.color,
      quantity: it.quantity + 1,
    });
  };

  const isLoading = updateCart.isPending || removeCart.isPending;

  return (
    <section className="py-8 mx-[200px]">
      <h1 className="text-2xl font-bold text-slate-900">{t('nav.cart')}</h1>

      <div className="flex items-start gap-8">
        <div className="flex-1">
          {cartData?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <Empty description={t('cartEmpty')} />
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {cartData
                ?.filter((it) => it.product !== null)
                ?.map((it) => (
                  <div
                    key={`${it.product._id}-${it.size}-${it.color}`}
                    className="flex gap-5 border-b border-slate-200 pb-6"
                  >
                    <div className="h-28 w-28 overflow-hidden rounded-sm bg-slate-100">
                      <img
                        src={it.product.variants[0].images?.[0] ?? ''}
                        alt={it.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {i18n.language === 'en'
                              ? it.product.nameEn
                              : it.product.name}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {t('product.selectSize')}{' '}
                            <span className="font-semibold text-slate-900">
                              {it.size}
                            </span>
                          </div>

                          <div className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                            {t('product.selectColor')}
                            <div
                              className="size-4 rounded-md"
                              style={{ backgroundColor: it.color }}
                            />
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-slate-900">
                          ${it.product.price * it.quantity}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          disabled={isLoading}
                          onClick={() => handleDecrease(it)}
                          className="h-8 w-8 rounded-full border border-slate-300"
                        >
                          −
                        </button>

                        <div className="min-w-6 text-center text-sm font-semibold">
                          {it.quantity}
                        </div>

                        <button
                          disabled={isLoading}
                          onClick={() => handleIncrease(it)}
                          className="h-8 w-8 rounded-full border border-slate-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <aside className="w-[340px] shrink-0">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-900">
              {t('cart.summary')}
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold">${subtotal}</span>
              </div>

              {/* <div className="flex justify-between">
                <span>{t('cart.estimatedDelivery')}</span>
                <span className="font-semibold">{t('cart.free')}</span>
              </div> */}

              <VoucherSection
                vouchers={vouchers}
                subtotal={subtotal}
                selectedVoucherId={selectedVoucherId}
                onSelect={setSelectedVoucherId}
              />

              <div className="flex justify-between">
                <span>{t('cart.discount')}</span>
                <span className="text-emerald-600 font-semibold">
                  -${discount}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>{t('cart.total')}</span>
                <span>${total}</span>
              </div>
            </div>

            <Button
              loading={isLoading}
              type="primary"
              size="large"
              className="mt-5 w-full rounded-full"
              onClick={() =>
                navigate('/checkout', {
                  state: { voucherId: selectedVoucherId },
                })
              }
            >
              {t('cart.memberCheckout')}
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CartPage;
