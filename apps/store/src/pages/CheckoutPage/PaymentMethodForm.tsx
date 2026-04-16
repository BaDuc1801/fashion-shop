import { Radio } from 'antd';
import { TFunction } from 'i18next';
import { AiFillBank } from 'react-icons/ai';
import { PiMoneyWavyFill } from 'react-icons/pi';

interface PaymentMethodFormProps {
  t: TFunction;
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodForm = ({ t, value, onChange }: PaymentMethodFormProps) => {
  return (
    <Radio.Group
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    >
      <div className="border rounded-lg divide-y overflow-hidden">
        {/* QR / Bank */}
        <label className="flex items-center justify-between p-4 cursor-pointer">
          <Radio value="sepay" className="w-fit">
            <div className="ms-4 font-medium text-md">
              {t('bankingTransfer')}
            </div>
          </Radio>
          <AiFillBank className="w-6 h-6" />
        </label>

        {/* COD */}
        <label className="flex items-center justify-between p-4 cursor-pointer">
          <Radio value="cod" className="w-fit">
            <div className="ms-4 font-medium text-md">
              {t('cashOnDelivery')}
            </div>
          </Radio>
          <PiMoneyWavyFill className="w-6 h-6" />
        </label>

        {/* VNPay */}
        <label className="flex items-center justify-between gap-3 p-4 cursor-pointer">
          <Radio value="vnpay" className="w-fit">
            <div className="ms-4 font-medium text-md">{t('vnpay')}</div>
          </Radio>
          <img
            src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
            alt="VNPAY"
            className="w-auto h-5"
          />
        </label>

        {/* MoMo */}
        <label className="flex items-center justify-between gap-3 p-4 cursor-pointer">
          <Radio value="momo" className="w-fit">
            <div className="ms-4 font-medium text-md">{t('momo')}</div>
          </Radio>
          <img
            src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png"
            alt="MoMo"
            className="w-auto h-6"
          />
        </label>
      </div>
    </Radio.Group>
  );
};

export default PaymentMethodForm;
