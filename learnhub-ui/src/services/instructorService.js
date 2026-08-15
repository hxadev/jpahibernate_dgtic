import { USE_MOCKS, http, mockCrud, mockDb, delay } from './api';

export const instructorService = {
  getAll: async () => {
    if (USE_MOCKS) return mockCrud.getAll('instructors');
    return http.get('/instructors');
  },

  getById: async (id) => {
    if (USE_MOCKS) return mockCrud.getById('instructors', id);
    return http.get(`/instructors/${id}`);
  },

  create: async (data) => {
    if (USE_MOCKS) {
      const now = new Date().toISOString().slice(0, 19);
      return mockCrud.create('instructors', { ...data, createdAt: now }, { idPrefix: 'INS' });
    }
    return http.post('/instructors', data);
  },

  update: async (id, data) => {
    if (USE_MOCKS) return mockCrud.update('instructors', id, data);
    return http.put(`/instructors/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCKS) return mockCrud.delete('instructors', id);
    return http.delete(`/instructors/${id}`);
  },

  // ---------- Queries específicas ----------

  // HQL equivalente: SELECT i FROM Course c JOIN c.instructors i WHERE c.id = :courseId
  getByCourse: async (courseId) => {
    if (USE_MOCKS) {
      await delay();
      const instructorIds = mockDb.instructorsCourses
        .filter((ic) => ic.idCourse === Number(courseId))
        .map((ic) => ic.idInstructor);
      return mockDb.instructors.filter((i) => instructorIds.includes(i.id));
    }
    return http.get(`/instructors/course/${courseId}`);
  },

  // Número de cursos asignados por instructor
  getCourseCount: async (instructorId) => {
    if (USE_MOCKS) {
      await delay(100);
      return mockDb.instructorsCourses.filter((ic) => ic.idInstructor === instructorId).length;
    }
    return http.get(`/instructors/${instructorId}/course-count`);
  },
};
