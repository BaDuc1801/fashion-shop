import { Tooltip } from 'antd';
import type { Voucher } from '../navbar/mockVouchers';

type VoucherCardProps = {
  voucher: Voucher;
  selected: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onSelect: (voucherId: string) => void;
};

const VoucherCard = ({
  voucher,
  selected,
  disabled = false,
  disabledReason,
  onSelect,
}: VoucherCardProps) => {
  const card = (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(voucher.id)}
      className={[
        'w-[200px] h-40 overflow-hidden rounded-md border bg-white text-left transition-colors',
        selected ? 'border-pink-300 ring-2 ring-pink-100' : 'border-slate-200',
        disabled ? 'cursor-not-allowed opacity-60' : 'hover:border-slate-400',
      ].join(' ')}
    >
      <img
        src={voucher.imageUrl}
        alt={voucher.code}
        className="h-24 w-full object-cover object-center"
      />
      <div className="p-3">
        <div className="text-sm font-semibold text-slate-900">
          {voucher.code}
        </div>
        <div className="mt-1 text-xs text-slate-600">{voucher.description}</div>
      </div>
    </button>
  );

  if (disabled && disabledReason) {
    return (
      <Tooltip title={disabledReason}>
        <span className="inline-block">{card}</span>
      </Tooltip>
    );
  }

  return card;
};

export default VoucherCard;
