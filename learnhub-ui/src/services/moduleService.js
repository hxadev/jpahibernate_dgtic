import { USE_MOCKS, http, mockCrud, mockDb, delay } from './api';

export const moduleService = {
  getAll: async () => {
    if (USE_MOCKS) return mockCrud.getAll('modules');
    return http.get('/modules');
  },

  getById: async (id) => {
    if (USE_MOCKS) return mockCrud.getById('modules', id);
    return http.get(`/modules/${id}`);
  },

  create: async (data) => {
    if (USE_MOCKS) return mockCrud.create('modules', data, { idPrefix: 'MOD' });
    return http.post('/modules', data);
  },

  update: async (id, data) => {
    if (USE_MOCKS) return mockCrud.update('modules', id, data);
    return http.put(`/modules/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCKS) return mockCrud.delete('modules', id);
    return http.delete(`/modules/${id}`);
  },

  // ---------- Queries específicas ----------

  // HQL equivalente: FROM Module m WHERE m.course.id = :courseId ORDER BY m.position
  getByCourse: async (courseId) => {
    if (USE_MOCKS) {
      await delay();
      return mockDb.modules
        .filter((m) => m.idCourse === Number(courseId))
        .sort((a, b) => a.position - b.position);
    }
    return http.get(`/modules/course/${courseId}`);
  },
};
