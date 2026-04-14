import api from '../axios';
import {
  CreateCategoryRequest,
  GetCategoriesRequest,
  UpdateCategoryRequest,
} from './category.request';
import {
  Category,
  CategoryData,
  DeleteCategoryResponse,
} from './category.response';

class CategoryService {
  async createCategory(payload: CreateCategoryRequest): Promise<Category> {
    const res = await api.post('/api/categories', payload);
    return res.data;
  }

  async getCategories(params: GetCategoriesRequest): Promise<CategoryData> {
    const res = await api.get('/api/categories', { params });
    return res.data;
  }

  async getCategoryById(id: string): Promise<Category> {
    const res = await api.get(`/api/categories/${id}`);
    return res.data;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const res = await api.get(`/api/categories/slug/${slug}`);
    return res.data;
  }

  async updateCategory(
    id: string,
    payload: UpdateCategoryRequest,
  ): Promise<Category> {
    const res = await api.put(`/api/categories/${id}`, payload);
    return res.data;
  }

  async deleteCategory(id: string): Promise<DeleteCategoryResponse> {
    const res = await api.delete(`/api/categories/${id}`);
    return res.data;
  }
}

export const categoryService = new CategoryService();
