import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resolveImageUrls, userService, useDebouncedValue } from '@shared';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import EmployeeForm from './EmployeeForm';
import type { AddNewEmployeeFormValues } from './schemas/addNewEmployeeSchema';

const EmployeeAddPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users', 'employees-add-list', debouncedSearch],
    queryFn: () =>
      userService.getUsers({
        search: debouncedSearch,
        page: 1,
        limit: 100,
        role: 'staff',
      }),
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (values: AddNewEmployeeFormValues) => {
      const avatarUrls = await resolveImageUrls(values.avatar);
      return userService.inviteUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: avatarUrls[0],
        salary: values.salary,
        role: values.role,
        status: values.status ? 'active' : 'inactive',
        joinDate: values.joinDate?.toISOString(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success(t('admin.employee.form.inviteSuccess'));
    },
  });

  const fromAddState: ReturnToAddNewState = {
    returnTo: ADD_NEW_PATH.employees,
  };

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/employees')}
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {t('admin.employee.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title={t('admin.employee.form.addTitle')} className="h-fit">
          <EmployeeForm
            isEdit={false}
            showTitle={false}
            submitting={createEmployeeMutation.isPending}
            onSubmit={async (values) => {
              await createEmployeeMutation.mutateAsync(values);
            }}
          />
        </Card>
        <Card
          title={t('admin.employee.addPage.existingListTitle')}
          className="h-fit"
        >
          <Input
            placeholder={t('admin.employee.detail.listSearchPlaceholder')}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="mb-4"
          />
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden overscroll-y-contain">
            <List
              bordered
              dataSource={usersResponse?.data ?? []}
              loading={isLoading}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/employees/${item._id}`, { state: fromAddState })
                  }
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.role}</span>
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

export default EmployeeAddPage;
