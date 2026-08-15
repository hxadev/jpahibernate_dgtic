// Punto de entrada de los datos mock.
// Las colecciones se copian a memoria para que el CRUD de la UI funcione
// sin backend: los cambios viven mientras dure la sesión del navegador.
import { levels as levelsSeed } from './levels';
import { categories as categoriesSeed } from './categories';
import { instructors as instructorsSeed } from './instructors';
import { courses as coursesSeed } from './courses';
import { instructorsCourses as instructorsCoursesSeed } from './instructorsCourses';
import { modules as modulesSeed } from './modules';
import { students as studentsSeed } from './students';
import { enrollments as enrollmentsSeed } from './enrollments';

const clone = (data) => JSON.parse(JSON.stringify(data));

// Almacenes mutables en memoria (simulan las tablas de la base de datos)
export const db = {
  levels: clone(levelsSeed),
  categories: clone(categoriesSeed),
  instructors: clone(instructorsSeed),
  courses: clone(coursesSeed),
  instructorsCourses: clone(instructorsCoursesSeed),
  modules: clone(modulesSeed),
  students: clone(studentsSeed),
  enrollments: clone(enrollmentsSeed),
};

export {
  levelsSeed,
  categoriesSeed,
  instructorsSeed,
  coursesSeed,
  instructorsCoursesSeed,
  modulesSeed,
  studentsSeed,
  enrollmentsSeed,
};
