import { USE_MOCKS, http, mockCrud, mockDb, delay } from './api';

export const courseService = {
  getAll: async () => {
    if (USE_MOCKS) return mockCrud.getAll('courses');
    return http.get('/courses');
  },

  getById: async (id) => {
    if (USE_MOCKS) return mockCrud.getById('courses', id);
    return http.get(`/courses/${id}`);
  },

  create: async (data) => {
    if (USE_MOCKS) return mockCrud.create('courses', data, { timestamps: true });
    return http.post('/courses', data);
  },

  update: async (id, data) => {
    if (USE_MOCKS) return mockCrud.update('courses', id, data, { timestamps: true });
    return http.put(`/courses/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCKS) return mockCrud.delete('courses', id);
    return http.delete(`/courses/${id}`);
  },

  // ---------- Queries específicas ----------

  // HQL equivalente: FROM Course c WHERE c.category.id = :categoryId
  getByCategory: async (categoryId) => {
    if (USE_MOCKS) {
      await delay();
      return mockDb.courses.filter((c) => c.categoryId === Number(categoryId));
    }
    return http.get(`/courses/category/${categoryId}`);
  },

  // HQL equivalente: SELECT e.course, COUNT(e) FROM Enrollment e GROUP BY e.course ORDER BY COUNT(e) DESC
  getTopPopular: async (limit = 5) => {
    if (USE_MOCKS) {
      await delay();
      const counts = mockDb.enrollments.reduce((acc, e) => {
        acc[e.idCourse] = (acc[e.idCourse] || 0) + 1;
        return acc;
      }, {});
      return mockDb.courses
        .map((c) => ({ ...c, enrollmentCount: counts[c.id] || 0 }))
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, limit);
    }
    return http.get(`/courses/top-popular?limit=${limit}`);
  },

  // HQL equivalente: SELECT c FROM Instructor i JOIN i.courses c WHERE i.id = :instructorId
  getByInstructor: async (instructorId) => {
    if (USE_MOCKS) {
      await delay();
      const courseIds = mockDb.instructorsCourses
        .filter((ic) => ic.idInstructor === instructorId)
        .map((ic) => ic.idCourse);
      return mockDb.courses.filter((c) => courseIds.includes(c.id));
    }
    return http.get(`/courses/instructor/${instructorId}`);
  },
};
