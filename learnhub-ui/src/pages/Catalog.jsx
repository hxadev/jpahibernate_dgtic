import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Search, Star, Users } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import LevelBadge from '../components/LevelBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { categoryService } from '../services/categoryService';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { instructorService } from '../services/instructorService';
import { levelService } from '../services/levelService';
import { moduleService } from '../services/moduleService';
import { formatCurrency, formatMinutes, fullName, initials } from '../utils/formatters';

// Gradientes de portada por curso (se asignan de forma estable por id)
const GRADIENTS = [
  'from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-orange-500 to-red-600',
  'from-violet-600 to-purple-700',
  'from-cyan-600 to-blue-700',
  'from-rose-500 to-pink-700',
  'from-amber-500 to-orange-600',
  'from-slate-600 to-slate-800',
];

function Stars({ ranking }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${ranking} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= ranking ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
        />
      ))}
    </span>
  );
}

export default function Catalog() {
  const [data, setData] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null); // curso del modal
  const [detail, setDetail] = useState(null); // módulos + instructores del curso
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      courseService.getAll(),
      categoryService.getAll(),
      levelService.getAll(),
      enrollmentService.getAll(),
      instructorService.getAll(),
    ]).then(([courses, categories, levels, enrollments, instructors]) => {
      if (!cancelled) setData({ courses, categories, levels, enrollments, instructors });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Al abrir el modal, cargar módulos e instructores del curso
  useEffect(() => {
    if (!selected) {
      setDetail(null);
      setEnrolled(false);
      return undefined;
    }
    let cancelled = false;
    Promise.all([moduleService.getByCourse(selected.id), instructorService.getByCourse(selected.id)]).then(
      ([courseModules, courseInstructors]) => {
        if (!cancelled) setDetail({ modules: courseModules, instructors: courseInstructors });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const enrollmentCounts = useMemo(() => {
    if (!data) return {};
    return data.enrollments.reduce((acc, e) => {
      acc[e.idCourse] = (acc[e.idCourse] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    return data.courses.filter((course) => {
      if (!course.active) return false;
      if (categoryFilter && course.categoryId !== Number(categoryFilter)) return false;
      if (levelFilter && course.levelId !== Number(levelFilter)) return false;
      if (term && !`${course.title} ${course.description}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [data, categoryFilter, levelFilter, search]);

  if (!data) return <LoadingSpinner label="Cargando catálogo…" />;

  const categoryById = Object.fromEntries(data.categories.map((c) => [c.id, c]));
  const levelById = Object.fromEntries(data.levels.map((l) => [l.id, l]));

  const handleEnroll = async () => {
    if (!selected) return;
    setEnrolling(true);
    try {
      // Demo: inscribe al primer estudiante activo del mock
      await enrollmentService.create({ idStudent: 'STU-001', idCourse: selected.id, grade: null, status: 'ENROLLED' });
      setEnrolled(true);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Catálogo de cursos</h1>
        <p className="text-sm text-slate-500">Explora los cursos disponibles en LearnHub</p>
      </div>

      {/* Filtros */}
      <div className="card flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por título o descripción…"
            className="input-field pl-9"
            aria-label="Buscar cursos"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="input-field sm:w-52"
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {data.categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(event) => setLevelFilter(event.target.value)}
          className="input-field sm:w-44"
          aria-label="Filtrar por nivel"
        >
          <option value="">Todos los niveles</option>
          {data.levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.title}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState title="Sin resultados" message="Ningún curso coincide con los filtros seleccionados." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => {
            const gradient = GRADIENTS[course.id % GRADIENTS.length];
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelected(course)}
                className="card group overflow-hidden text-left transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className={`relative h-28 bg-gradient-to-br ${gradient} p-4`}>
                  <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {categoryById[course.categoryId]?.name || 'Sin categoría'}
                  </span>
                  <p className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-white">{course.title}</p>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <CourseInstructor courseId={course.id} />
                    <LevelBadge level={levelById[course.levelId]} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} /> {course.duration} h
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={13} /> {enrollmentCounts[course.id] || 0} inscritos
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Stars ranking={course.ranking} />
                    <span className="text-lg font-bold text-slate-900">{formatCurrency(course.price)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal de detalle */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || ''} size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {categoryById[selected.categoryId]?.name}
              </span>
              <LevelBadge level={levelById[selected.levelId]} />
              <Stars ranking={selected.ranking} />
              <span className="ml-auto text-xl font-bold text-slate-900">{formatCurrency(selected.price)}</span>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">{selected.description}</p>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} /> {selected.duration} horas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users size={15} /> {enrollmentCounts[selected.id] || 0} inscritos
              </span>
            </div>

            {!detail ? (
              <LoadingSpinner label="Cargando detalle…" />
            ) : (
              <>
                <section>
                  <h3 className="mb-2 text-sm font-bold text-slate-800">Contenido del curso</h3>
                  {detail.modules.length === 0 ? (
                    <p className="text-sm text-slate-500">El temario de este curso se publicará próximamente.</p>
                  ) : (
                    <ol className="space-y-2">
                      {detail.modules.map((module) => (
                        <li key={module.id} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-primary">
                            {module.position}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800">{module.title}</p>
                            <p className="text-xs text-slate-500">{module.description}</p>
                          </div>
                          <span className="shrink-0 text-xs text-slate-400">{formatMinutes(module.duration)}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>

                <section>
                  <h3 className="mb-2 text-sm font-bold text-slate-800">
                    Instructor{detail.instructors.length > 1 && 'es'}
                  </h3>
                  <div className="space-y-3">
                    {detail.instructors.map((instructor) => (
                      <div key={instructor.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {initials(instructor)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{fullName(instructor)}</p>
                          <p className="text-xs font-medium text-primary">{instructor.speciality}</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">{instructor.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {enrolled ? (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={18} /> ¡Inscripción registrada con éxito!
                  </div>
                ) : (
                  <button type="button" className="btn-primary w-full" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? 'Inscribiendo…' : 'Inscribirse'}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// Avatar + nombre del primer instructor asignado al curso
function CourseInstructor({ courseId }) {
  const [instructor, setInstructor] = useState(null);

  useEffect(() => {
    let cancelled = false;
    instructorService.getByCourse(courseId).then((list) => {
      if (!cancelled) setInstructor(list[0] || null);
    });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (!instructor) return <span className="text-xs text-slate-400">—</span>;

  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
        {initials(instructor)}
      </span>
      <span className="truncate text-xs font-medium text-slate-600">{fullName(instructor)}</span>
    </span>
  );
}
