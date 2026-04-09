import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import EmployeeForm from './EmployeeForm';
import { Employee, employees } from './employeesMockData';
import { AddNewEmployeeFormValues } from './schemas/addNewEmployeeSchema';

const EmployeeDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as ReturnToAddNewState | null)?.returnTo;
  const isFromAddPage = returnTo === ADD_NEW_PATH.employees;
  const [searchText, setSearchText] = useState('');
  const employee = employees.find((e) => e.id === id);
  const filteredEmployees = useMemo(
    () =>
      employees.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.phone.includes(searchText) ||
          item.email?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [searchText],
  );

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
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          navigate(isFromAddPage ? ADD_NEW_PATH.employees : '/employees')
        }
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {isFromAddPage
          ? t('admin.employee.detail.backToAddNew')
          : t('admin.employee.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title={t('admin.employee.form.editTitle')} className="h-fit">
          <EmployeeForm
            initialValues={mapEmployeeToFormValues(employee)}
            isEdit={true}
            showTitle={false}
          />
        </Card>
        <Card title={t('admin.employee.detail.listTitle')} className="h-fit">
          <Input
            placeholder={t('admin.employee.detail.listSearchPlaceholder')}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="mb-4"
          />
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden overscroll-y-contain">
            <List
              bordered
              dataSource={filteredEmployees}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer ${
                    item.id === id ? 'bg-slate-100 font-medium' : ''
                  }`}
                  onClick={() =>
                    navigate(`/employees/${item.id}`, {
                      state: location.state,
                    })
                  }
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.phone}</span>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
