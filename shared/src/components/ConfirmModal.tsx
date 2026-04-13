import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { MdInfo } from 'react-icons/md';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  productName?: string;
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
        {t('admin.confirmModal.descriptionPrefix')}{' '}
        <span className="font-semibold">{productName ?? ''}</span>{' '}
        {t('admin.confirmModal.descriptionSuffix')}
      </span>
    </Modal>
  );
};
