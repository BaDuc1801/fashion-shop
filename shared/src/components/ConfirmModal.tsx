import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { MdInfo } from 'react-icons/md';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  productName?: string;
  categoryName?: string;
  userName?: string;
  voucherCode?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  open,
  title,
  productName,
  categoryName,
  userName,
  voucherCode,
  confirmText,
  cancelText,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const { t } = useTranslation();
  const confirmLabel = confirmText ?? t('admin.confirmModal.confirmText');
  const cancelLabel = cancelText ?? t('admin.confirmModal.cancelText');

  return (
    <Modal
      open={open}
      title={
        <p className="text-lg font-semibold flex items-center gap-2">
          <MdInfo className="text-blue-500 size-6" />
          {title}
        </p>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>,
        <Button
          key="confirm"
          type="primary"
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>,
      ]}
    >
      <span className="mb-0 text-base">
        {categoryName && (
          <>
            {t('admin.confirmModal.descriptionPrefixCategory')}{' '}
            <span className="font-semibold">{categoryName}</span>?
          </>
        )}

        {productName && (
          <>
            {t('admin.confirmModal.descriptionPrefixProduct')}{' '}
            <span className="font-semibold">{productName}</span>?
          </>
        )}

        {userName && (
          <>
            {t('admin.confirmModal.descriptionPrefixUser')}{' '}
            <span className="font-semibold">{userName}</span>?
          </>
        )}

        {voucherCode && (
          <>
            {t('admin.confirmModal.descriptionPrefixVoucher')}{' '}
            <span className="font-semibold">{voucherCode}</span>?
          </>
        )}
      </span>
    </Modal>
  );
};
