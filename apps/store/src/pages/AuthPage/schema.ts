import { z } from 'zod';

const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\d{9,15}$/, 'Phone number must be 9-15 digits'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof RegisterSchema>;

const defaultRegisterValues: RegisterFormValues = {
  name: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

export { type RegisterFormValues, RegisterSchema, defaultRegisterValues };
