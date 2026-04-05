import { useEffect } from 'react';
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import type { Employee } from './employeesMockData';
import {
  AddNewEmployeeFormValues,
  addNewEmployeeSchemaDefaultValues,
} from './schemas/addNewEmployeeSchema';
import { FormItem } from '../../components/common/FormItem';

interface Props {
  initialValues?: AddNewEmployeeFormValues;
  isEdit?: boolean;
  onSubmit?: (values: Employee) => void;
}

const EmployeeForm = ({ initialValues, isEdit, onSubmit }: Props) => {
  const { control, handleSubmit, reset } = useForm<AddNewEmployeeFormValues>({
    defaultValues: addNewEmployeeSchemaDefaultValues,
  });
  console.log(isEdit);
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onFormSubmit = (values: AddNewEmployeeFormValues) => {
    const payload: Employee = {
      id: values.id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      joinDate: values.joinDate,
      salary: values.salary,
      avatar: { url: values.avatar || '', name: 'avatar.png' },
      status: values.status ? 'active' : 'inactive',
      role: values.role,
    };

    onSubmit?.(payload);
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onFormSubmit)}
      className="space-y-4 min-h-screen"
    >
      <h2 className="text-xl font-semibold text-center">
        {isEdit ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      <div className="grid grid-cols-5 gap-10">
        <div className="flex flex-col col-span-1 gap-2">
          <FormItem
            name="avatar"
            control={control}
            label="Avatar"
            type="upload"
          />
          <FormItem
            name="status"
            control={control}
            label="Active"
            type="switch"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <FormItem
            name="name"
            control={control}
            label="Name"
            required
            placeholder="Enter name"
            rules={{ required: 'Please enter name' }}
          />
          <FormItem
            name="phone"
            control={control}
            label="Phone"
            required
            placeholder="Enter phone"
            rules={{ required: 'Please enter phone' }}
          />
          <FormItem
            name="joinDate"
            control={control}
            label="Join Date"
            type="date"
            placeholder="Select date"
            rules={{ required: 'Please select date' }}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <FormItem
            name="email"
            control={control}
            label="Email"
            type="text"
            required
            placeholder="Enter email"
            rules={{ required: 'Please enter email' }}
          />
          <FormItem
            name="salary"
            control={control}
            label="Salary (USD)"
            type="number"
            rules={{ required: 'Please enter salary' }}
          />
        </div>
      </div>
      <Button
        type="primary"
        htmlType="submit"
        block
        size="large"
        className="mt-4"
      >
        {isEdit ? 'Update Employee' : 'Create Employee'}
      </Button>
    </Form>
  );
};

export default EmployeeForm;
