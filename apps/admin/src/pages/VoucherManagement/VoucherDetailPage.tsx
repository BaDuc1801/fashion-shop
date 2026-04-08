import { useParams } from 'react-router-dom';
import VoucherForm from './VoucherForm';
import { vouchers } from './vouchersMockData';

const VoucherDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const voucher = vouchers.find((item) => item.id === id);

  return <VoucherForm initialValues={voucher} isEdit />;
};

export default VoucherDetailPage;
