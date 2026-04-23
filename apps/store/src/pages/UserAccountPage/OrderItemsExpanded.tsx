import { OrderDetailData, OrderDetailDiscount } from '@shared';
import { TFunction } from 'i18next';
import { MdOutlineRateReview } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AddReviewModal from './AddReviewModal';
import { useState } from 'react';
import { Tooltip } from 'antd';

interface Props {
  items: OrderDetailData['items'];
  t: TFunction;
  language: string;
  discount: OrderDetailDiscount;
  orderId: string;
}

const OrderItemsExpanded = ({
  items,
  t,
  language,
  discount,
  orderId,
}: Props) => {
  const navigate = useNavigate();
  const [openReviewModal, setOpenReviewModal] = useState(false);

  return (
    <div className="bg-gray-50 rounded ps-12 max-w-[600px]">
      {items?.map((item, index) => {
        return (
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
            <div className="flex items-center gap-10">
              <div className="text-right">
                {discount.voucherId && (
                  <>
                    <div>
                      {t('discountCode') + ': ' + discount.voucherId.code}
                    </div>
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
              {item.canReview ? (
                <MdOutlineRateReview
                  className="text-green-500 size-6 cursor-pointer"
                  onClick={() => setOpenReviewModal(true)}
                />
              ) : (
                <Tooltip
                  title={
                    !item.reviewed
                      ? t('orderNotCompleted')
                      : t('alreadyReviewed')
                  }
                >
                  <MdOutlineRateReview className="text-gray-400 size-6 cursor-not-allowed" />
                </Tooltip>
              )}
            </div>
          </div>
        );
      })}
      <AddReviewModal
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        productId={items[0].productId}
        orderId={orderId}
      />
    </div>
  );
};

export default OrderItemsExpanded;
