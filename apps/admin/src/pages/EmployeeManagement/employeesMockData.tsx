import dayjs, { Dayjs } from 'dayjs';

export interface Employee {
  id: string;
  name: string;
  phone: string;
  joinDate: Dayjs;
  avatar: { url: string; name: string };
  status: 'active' | 'inactive';
  role: 'staff';
  salary: number; // USD

  email?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const employees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '0901234567',
    joinDate: dayjs('2023-05-10'),
    avatar: { url: 'https://i.pravatar.cc/150?img=11', name: 'avatar.png' },
    status: 'active',
    role: 'staff',
    salary: 1500,
    email: 'john.smith@gmail.com',
    lastLogin: '2026-04-04 10:30',
    createdAt: '2023-05-10',
    updatedAt: '2026-04-04',
  },
  {
    id: '2',
    name: 'Emily Johnson',
    phone: '0912345678',
    joinDate: dayjs('2024-01-15'),
    avatar: { url: 'https://i.pravatar.cc/150?img=12', name: 'avatar.png' },
    status: 'inactive',
    role: 'staff',
    salary: 900,
    email: 'emily.johnson@gmail.com',
    lastLogin: '2026-03-30 08:00',
    createdAt: '2024-01-15',
    updatedAt: '2026-03-30',
  },
  {
    id: '3',
    name: 'Michael Brown',
    phone: '0987654321',
    joinDate: dayjs('2022-11-01'),
    avatar: { url: 'https://i.pravatar.cc/150?img=13', name: 'avatar.png' },
    status: 'active',
    role: 'staff',
    salary: 2500,
    email: 'michael.brown@gmail.com',
    lastLogin: '2026-04-05 09:15',
    createdAt: '2022-11-01',
    updatedAt: '2026-04-05',
  },
  {
    id: '4',
    name: 'Sophia Williams',
    phone: '0978123456',
    joinDate: dayjs('2023-08-20'),
    avatar: { url: 'https://i.pravatar.cc/150?img=14', name: 'avatar.png' },
    status: 'inactive',
    role: 'staff',
    salary: 1100,
    email: 'sophia.williams@gmail.com',
    lastLogin: '2026-03-25 14:10',
    createdAt: '2023-08-20',
    updatedAt: '2026-03-25',
  },
  {
    id: '5',
    name: 'Daniel Anderson',
    phone: '0965123456',
    joinDate: dayjs('2021-03-12'),
    avatar: { url: 'https://i.pravatar.cc/150?img=15', name: 'avatar.png' },
    status: 'inactive',
    role: 'staff',
    salary: 1800,
    email: 'daniel.anderson@gmail.com',
    lastLogin: '2025-12-01 09:00',
    createdAt: '2021-03-12',
    updatedAt: '2025-12-01',
  },
];
