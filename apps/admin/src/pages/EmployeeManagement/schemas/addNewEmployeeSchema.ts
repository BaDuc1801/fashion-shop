import dayjs from 'dayjs';

export const addNewEmployeeSchemaDefaultValues = {
  id: '',
  name: '',
  email: '',
  phone: '',
  joinDate: undefined as unknown as dayjs.Dayjs,
  salary: 0,
  avatar: '' as string,
  status: true,
  role: 'staff' as const,
};

export type AddNewEmployeeFormValues = typeof addNewEmployeeSchemaDefaultValues;
