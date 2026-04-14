export interface CreateCategoryRequest {
  name: string;
  slug: string;
  image?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  image?: string;
  status?: 'active' | 'inactive';
}

export interface GetCategoriesRequest {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  search?: string;
}
