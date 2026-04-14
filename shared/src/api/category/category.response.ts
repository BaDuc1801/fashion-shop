export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryData {
  data: Category[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DeleteCategoryResponse {
  message: string;
}
