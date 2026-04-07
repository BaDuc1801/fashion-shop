import * as yup from 'yup';

type RegisterFormValues = {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const defaultRegisterValues: RegisterFormValues = {
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const RegisterSchema = yup.object<RegisterFormValues>({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),

  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),

  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{9,15}$/, 'Phone number must be 9-15 digits'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),

  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export { type RegisterFormValues, RegisterSchema, defaultRegisterValues };
