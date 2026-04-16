import { type Voucher } from '@shared';
import { Modal } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { LuTicket } from 'react-icons/lu';

type Props = {
  vouchers: Voucher[];
  subtotal: number;
  selectedVoucherId?: string;
  onSelect: (id?: string) => void;
};

const VoucherSection = ({
  vouchers,
  subtotal,
  selectedVoucherId,
  onSelect,
}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const selectedVoucher = useMemo(
    () => vouchers.find((v) => v._id === selectedVoucherId),
    [vouchers, selectedVoucherId],
  );

  const isEligible = (voucher: Voucher) =>
    !voucher.minOrderValue || subtotal >= voucher.minOrderValue;

  return (
    <div className="space-y-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2">
          <LuTicket className="size-4" />
          <span className="text-slate-700">{t('cart.selectVoucher')}</span>
        </div>
        <div className="cursor-pointer">
          <FaAngleDoubleRight />
        </div>
      </div>

      {selectedVoucher && (
        <div className="text-xs text-emerald-600">
          Applied: {selectedVoucher.discountPercent}% OFF
        </div>
      )}

      <Modal
        title="Select Voucher"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={520}
      >
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {vouchers.map((v) => {
            const eligible = isEligible(v);
            const active = selectedVoucherId === v._id;

            return (
              <div
                key={v._id}
                onClick={() => {
                  if (!eligible) return;
                  onSelect(v._id);
                }}
                className={[
                  'border rounded-lg p-3 flex justify-between items-center cursor-pointer transition',
                  active
                    ? 'border-black bg-slate-50'
                    : 'border-slate-200 hover:border-slate-400',
                  !eligible ? 'opacity-50 cursor-not-allowed' : '',
                ].join(' ')}
              >
                <div className="flex items-center gap-4 h-[150px]">
                  <img
                    src={v.image}
                    alt={v.code}
                    className="h-full object-fit"
                  />
                  <div className="flex flex-col justify-between gap-1 h-full">
                    <div>
                      <div className="text-xl font-semibold">{v.code}</div>
                      <div className="font-semibold text-sm">
                        {v.discountPercent}% OFF
                      </div>
                      <div className="text-sm text-slate-500">
                        {v.maxDiscount ? `Max discount: $${v.maxDiscount}` : ''}
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {t('cart.minOrder')} ${v.minOrderValue ?? 0}
                    </div>
                  </div>
                </div>

                {active && (
                  <div className="text-green-500 text-sm font-semibold">
                    Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default VoucherSection;
