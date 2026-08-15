import { USE_MOCKS, http, mockCrud } from './api';

export const categoryService = {
  getAll: async () => {
    if (USE_MOCKS) return mockCrud.getAll('categories');
    return http.get('/categories');
  },

  getById: async (id) => {
    if (USE_MOCKS) return mockCrud.getById('categories', id);
    return http.get(`/categories/${id}`);
  },

  create: async (data) => {
    if (USE_MOCKS) {
      const now = new Date().toISOString().slice(0, 19);
      return mockCrud.create('categories', { ...data, createdAt: now });
    }
    return http.post('/categories', data);
  },

  update: async (id, data) => {
    if (USE_MOCKS) return mockCrud.update('categories', id, data);
    return http.put(`/categories/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCKS) return mockCrud.delete('categories', id);
    return http.delete(`/categories/${id}`);
  },
};
