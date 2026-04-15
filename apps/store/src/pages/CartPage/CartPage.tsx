import { Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockCartItems } from '../../components/navbar/mockCart';
import VoucherSection from './components/VoucherSection';
import { voucherService } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { getVoucherDiscount } from './utils/getDiscountVoucher';

const CartPage = () => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>();

  const { data: vouchersData } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => voucherService.getVouchers(),
  });

  const vouchers = useMemo(() => vouchersData?.data ?? [], [vouchersData]);

  const subtotal = cartItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0,
  );
  const selectedVoucher = useMemo(
    () => vouchers.find((v) => v._id === selectedVoucherId),
    [vouchers, selectedVoucherId],
  );

  const discount = useMemo(() => {
    if (!selectedVoucher) return 0;
    return getVoucherDiscount(subtotal, vouchers, selectedVoucher._id);
  }, [selectedVoucher, subtotal, vouchers]);

  const total = Math.max(0, subtotal - discount);

  const handleIncreaseQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  useEffect(() => {
    if (!selectedVoucher) return;
    if (
      selectedVoucher.minOrderValue &&
      subtotal < selectedVoucher.minOrderValue
    ) {
      setSelectedVoucherId(undefined);
    }
  }, [selectedVoucher, subtotal]);

  return (
    <section className="py-8 mx-[200px]">
      <h1 className="text-2xl font-bold text-slate-900">{t('cart.bag')}</h1>

      <div className="flex items-start gap-8">
        <div className="flex-1">
          <div className="mt-6 space-y-6">
            {cartItems.map((it) => (
              <div
                key={it.id}
                className="flex gap-5 border-b border-slate-200 pb-6"
              >
                <div className="h-28 w-28 overflow-hidden rounded-sm bg-slate-100">
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {it.name}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {it.categoryLabel}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {it.color}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {t('product.selectSize')} {it.size}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      ${it.price}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecreaseQuantity(it.id)}
                      className="h-8 w-8 rounded-full border border-slate-300 text-slate-700"
                    >
                      −
                    </button>
                    <div className="min-w-6 text-center text-sm font-semibold text-slate-900">
                      {it.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleIncreaseQuantity(it.id)}
                      className="h-8 w-8 rounded-full border border-slate-300 text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="w-[340px] shrink-0">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-900">
              {t('cart.summary')}
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-700">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>{t('cart.estimatedDelivery')}</span>
                <span className="font-semibold text-slate-900">
                  {t('cart.free')}
                </span>
              </div>
              <div className="space-y-2 pt-1">
                <VoucherSection
                  vouchers={vouchers}
                  subtotal={subtotal}
                  selectedVoucherId={selectedVoucherId}
                  onSelect={(voucherId) => setSelectedVoucherId(voucherId)}
                />
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>{t('cart.discount')}</span>
                <span className="font-semibold text-emerald-600">
                  -${discount}
                </span>
              </div>
              <div className="my-3 h-px bg-slate-200" />
              <div className="flex items-center justify-between text-slate-900">
                <span className="font-semibold">{t('cart.total')}</span>
                <span className="font-semibold">${total}</span>
              </div>
            </div>

            <Button
              type="primary"
              className="mt-5 w-full rounded-full bg-black text-white hover:!bg-black/90"
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
