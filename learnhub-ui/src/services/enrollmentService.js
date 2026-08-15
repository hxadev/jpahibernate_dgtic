import { USE_MOCKS, http, mockCrud, mockDb, delay } from './api';

export const enrollmentService = {
  getAll: async () => {
    if (USE_MOCKS) return mockCrud.getAll('enrollments');
    return http.get('/enrollments');
  },

  getById: async (id) => {
    if (USE_MOCKS) return mockCrud.getById('enrollments', id);
    return http.get(`/enrollments/${id}`);
  },

  create: async (data) => {
    if (USE_MOCKS) {
      const now = new Date().toISOString().slice(0, 19);
      return mockCrud.create('enrollments', { enrollmentDate: now, completionDate: null, ...data });
    }
    return http.post('/enrollments', data);
  },

  update: async (id, data) => {
    if (USE_MOCKS) return mockCrud.update('enrollments', id, data);
    return http.put(`/enrollments/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCKS) return mockCrud.delete('enrollments', id);
    return http.delete(`/enrollments/${id}`);
  },

  // ---------- Queries específicas ----------

  // HQL equivalente: FROM Enrollment e WHERE e.student.id = :studentId
  getByStudent: async (studentId) => {
    if (USE_MOCKS) {
      await delay();
      return mockDb.enrollments.filter((e) => e.idStudent === studentId);
    }
    return http.get(`/enrollments/student/${studentId}`);
  },

  // HQL equivalente: FROM Enrollment e WHERE e.course.id = :courseId
  getByCourse: async (courseId) => {
    if (USE_MOCKS) {
      await delay();
      return mockDb.enrollments.filter((e) => e.idCourse === Number(courseId));
    }
    return http.get(`/enrollments/course/${courseId}`);
  },

  // HQL equivalente: FROM Enrollment e WHERE e.status = :status
  getByStatus: async (status) => {
    if (USE_MOCKS) {
      await delay();
      return mockDb.enrollments.filter((e) => e.status === status);
    }
    return http.get(`/enrollments/status/${status}`);
  },
};
