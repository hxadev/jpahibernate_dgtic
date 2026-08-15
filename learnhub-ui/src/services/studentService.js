import { USE_MOCKS, http, mockCrud, mockDb, delay } from './api';

export const studentService = {
  getAll: async () => {
    if (USE_MOCKS) return mockCrud.getAll('students');
    return http.get('/students');
  },

  getById: async (id) => {
    if (USE_MOCKS) return mockCrud.getById('students', id);
    return http.get(`/students/${id}`);
  },

  create: async (data) => {
    if (USE_MOCKS) return mockCrud.create('students', data, { idPrefix: 'STU' });
    return http.post('/students', data);
  },

  update: async (id, data) => {
    if (USE_MOCKS) return mockCrud.update('students', id, data);
    return http.put(`/students/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCKS) return mockCrud.delete('students', id);
    return http.delete(`/students/${id}`);
  },

  // ---------- Queries específicas ----------

  // HQL equivalente: SELECT s.city, COUNT(s) FROM Student s GROUP BY s.city
  getCountByCity: async () => {
    if (USE_MOCKS) {
      await delay();
      const counts = mockDb.students.reduce((acc, s) => {
        acc[s.city] = (acc[s.city] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts).map(([city, count]) => ({ city, count }));
    }
    return http.get('/students/by-city');
  },
};
