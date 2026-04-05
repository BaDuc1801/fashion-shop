import { FaArrowRightLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

interface AddNewButtonProps {
  to: string;
  label?: string;
}

const AddNewButton = ({ to, label = 'Add New' }: AddNewButtonProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-2 hover:cursor-pointer"
      onClick={() => navigate(to)}
    >
      <text className="hover:underline font-semibold">{label}</text>
      <FaArrowRightLong />
    </div>
  );
};

export default AddNewButton;
