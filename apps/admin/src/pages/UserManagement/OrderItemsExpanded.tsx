import { OrderDetailData, OrderDetailDiscount } from '@shared';
import { TFunction } from 'i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  items: OrderDetailData['items'];
  t: TFunction;
  language: string;
  discount: OrderDetailDiscount;
}

const OrderItemsExpanded = ({ items, t, language, discount }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 rounded ps-12 pe-[110px]">
      {items?.map((item, index) => (
        <div
          key={item.productId + index}
          className="flex items-center justify-between border-b pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0"
        >
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/products/${item.skuSnapshot}`)}
          >
            <img
              src={item.imageSnapshot}
              alt={item.nameSnapshot}
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <div className="font-medium">
                {language === 'en' ? item.nameEnSnapshot : item.nameSnapshot}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                {t('size')}: {item.size} | {t('color')}:
                <span
                  className="inline-block w-3 h-3 rounded border"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          </div>

          <div className="text-right">
            {discount.voucherId && (
              <>
                <div>{t('discountCode') + ': ' + discount.voucherId.code}</div>
                <div className="text-red-500">
                  - $
                  {discount.discountAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </>
            )}

            <div>
              {item.quantity} × $
              {item.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <div className="font-semibold">
              $
              {(item.quantity * item.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsExpanded;
