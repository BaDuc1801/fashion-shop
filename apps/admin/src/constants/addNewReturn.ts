export type ReturnToAddNewState = {
  returnTo?: string;
};

export const ADD_NEW_PATH = {
  employees: '/employees/add-new',
  users: '/users/add-new',
  products: '/products/add-new',
  categories: '/categories/add-new',
  vouchers: '/vouchers/add-new',
  collections: '/collections/add-new',
} as const;
