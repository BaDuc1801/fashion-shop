import { ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Button, Card, Input, List, message } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resolveImageUrls, userService, useDebouncedValue } from '@shared';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import EmployeeForm from './EmployeeForm';
import type { AddNewEmployeeFormValues } from './schemas/addNewEmployeeSchema';

const EmployeeDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const returnTo = (location.state as ReturnToAddNewState | null)?.returnTo;
  const isFromAddPage = returnTo === ADD_NEW_PATH.employees;
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: employeeResponse, isLoading: isEmployeeLoading } = useQuery({
    queryKey: ['users', 'employee-detail-by-id', id],
    enabled: Boolean(id),
    retry: false,
    queryFn: () => {
      if (!id) throw new Error('Missing employee id');
      return userService.getUserById(id);
    },
  });

  const { data: listResponse, isLoading: isListLoading } = useQuery({
    queryKey: ['users', 'employees-detail-list', debouncedSearch],
    queryFn: () =>
      userService.getUsers({
        search: debouncedSearch,
        page: 1,
        limit: 100,
        role: employeeResponse?.role === 'admin' ? 'admin' : 'staff',
      }),
  });

  const employeeFormValues: AddNewEmployeeFormValues | undefined = useMemo(
    () =>
      employeeResponse
        ? {
            _id: employeeResponse._id,
            name: employeeResponse.name || '',
            email: employeeResponse.email || '',
            phone: employeeResponse.phone || '',
            joinDate: dayjs(employeeResponse.createdAt),
            salary: employeeResponse.salary || 0,
            avatar: employeeResponse.avatar
              ? [
                  {
                    uid: `${employeeResponse._id}-avatar`,
                    name: `${employeeResponse.name}-avatar`,
                    status: 'done',
                    url: employeeResponse.avatar,
                  } as UploadFile,
                ]
              : [],
            status: employeeResponse.status === 'active',
            role: employeeResponse.role === 'admin' ? 'admin' : 'staff',
          }
        : undefined,
    [employeeResponse],
  );

  const updateEmployeeMutation = useMutation({
    mutationFn: async (values: AddNewEmployeeFormValues) => {
      if (!id) throw new Error('Missing employee id');
      const avatarUrls = await resolveImageUrls(values.avatar);
      return userService.updateUser(id, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: avatarUrls[0],
        salary: values.salary,
        status: values.status ? 'active' : 'inactive',
        role: values.role,
      });
    },
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(
        ['users', 'employee-detail-by-id', id],
        updatedUser,
      );
      await queryClient.invalidateQueries({
        queryKey: ['users', 'employees-detail-list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      message.success(t('admin.employee.form.updateSuccess'));
    },
  });

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
        <Card
          title={t('admin.employee.form.editTitle')}
          className="h-fit"
          loading={isEmployeeLoading}
        >
          <EmployeeForm
            initialValues={employeeFormValues}
            isEdit={true}
            showTitle={false}
            submitting={updateEmployeeMutation.isPending}
            onSubmit={async (values) => {
              await updateEmployeeMutation.mutateAsync(values);
            }}
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
              dataSource={listResponse?.data ?? []}
              loading={isListLoading}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer ${
                    item._id === id ? 'bg-slate-100 font-medium' : ''
                  }`}
                  onClick={() =>
                    navigate(`/employees/${item._id}`, {
                      state: location.state,
                    })
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

export default EmployeeDetailPage;
