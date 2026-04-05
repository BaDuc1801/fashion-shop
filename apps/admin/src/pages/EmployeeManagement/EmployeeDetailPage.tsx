import { useParams } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import { Employee, employees } from './employeesMockData';
import { AddNewEmployeeFormValues } from './schemas/addNewEmployeeSchema';

const EmployeeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const employee = employees.find((e) => e.id === id);

  const mapEmployeeToFormValues = (
    emp: Employee | undefined,
  ): AddNewEmployeeFormValues | undefined => {
    if (!emp) return undefined;

    return {
      id: emp.id,
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      joinDate: emp.joinDate,
      salary: emp.salary || 0,
      avatar: emp.avatar?.url || '',
      status: emp.status === 'active',
      role: emp.role,
    };
  };

  return (
    <EmployeeForm
      initialValues={mapEmployeeToFormValues(employee)}
      isEdit={true}
    />
  );
};

export default EmployeeDetailPage;
