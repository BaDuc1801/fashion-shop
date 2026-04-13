import { Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

type ChangePasswordModalProps = {
  open: boolean;
  loading: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  error: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

const ChangePasswordModal = ({
  open,
  loading,
  currentPassword,
  newPassword,
  confirmPassword,
  error,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onCancel,
  onSubmit,
}: ChangePasswordModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      title={t('auth.changePassword')}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={loading}
      okText={t('auth.changePassword')}
      cancelText={t('common.cancel')}
      destroyOnClose
    >
      <div className="space-y-3 pt-2">
        <Input.Password
          size="large"
          placeholder={t('auth.currentPassword')}
          value={currentPassword}
          onChange={(e) => onCurrentPasswordChange(e.target.value)}
        />
        <Input.Password
          size="large"
          placeholder={t('auth.newPassword')}
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
        />
        <Input.Password
          size="large"
          placeholder={t('auth.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
