export interface CreateCategoryRequest {
  name: string;
  nameEn: string;
  slug: string;
  image?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateCategoryRequest {
  name?: string;
  nameEn?: string;
  slug?: string;
  image?: string;
  status?: 'active' | 'inactive';
}

export interface GetCategoriesRequest {
  page?: number;
  limit?: number;
  lang?: string;
  status?: 'active' | 'inactive';
  search?: string;
}
