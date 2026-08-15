import { USE_MOCKS, http, mockCrud } from './api';

// Catálogo fijo de niveles (BEGINNER, INTERMEDIATE, ADVANCED)
export const levelService = {
  getAll: async () => {
    if (USE_MOCKS) return mockCrud.getAll('levels');
    return http.get('/levels');
  },

  getById: async (id) => {
    if (USE_MOCKS) return mockCrud.getById('levels', id);
    return http.get(`/levels/${id}`);
  },
};
