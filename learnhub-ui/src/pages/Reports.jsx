import { useEffect, useMemo, useState } from 'react';
import { Code2 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { instructorService } from '../services/instructorService';
import { studentService } from '../services/studentService';
import { mockDb } from '../services/api';
import { formatCurrency, fullName } from '../utils/formatters';

const PRIMARY = '#2563eb';
// Paleta categórica validada para visión de color (orden fijo; la leyenda
// con texto refuerza la identidad de cada rebanada)
const PIE_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4'];
const OTHER_COLOR = '#94a3b8';

const tooltipStyle = {
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
  fontSize: 13,
};

function HqlBlock({ query }) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
      <p className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">
        <Code2 size={14} /> Query HQL en el Backend:
      </p>
      <pre className="overflow-x-auto bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300">
        <code>{query}</code>
      </pre>
    </div>
  );
}

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      courseService.getAll(),
      instructorService.getAll(),
      enrollmentService.getAll(),
      studentService.getCountByCity(),
    ]).then(([courses, instructors, enrollments, byCity]) => {
      if (!cancelled) setData({ courses, instructors, enrollments, byCity });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Reporte 1: ingresos por instructor
  const revenueByInstructor = useMemo(() => {
    if (!data) return [];
    const courseById = Object.fromEntries(data.courses.map((c) => [c.id, c]));
    const validEnrollments = data.enrollments.filter((e) => e.status !== 'DROPPED');
    return data.instructors
      .map((instructor) => {
        const courseIds = mockDb.instructorsCourses
          .filter((ic) => ic.idInstructor === instructor.id)
          .map((ic) => ic.idCourse);
        const revenue = validEnrollments
          .filter((e) => courseIds.includes(e.idCourse))
          .reduce((sum, e) => sum + (courseById[e.idCourse]?.price || 0), 0);
        const enrollmentCount = validEnrollments.filter((e) => courseIds.includes(e.idCourse)).length;
        return { name: fullName(instructor), shortName: instructor.firstName, revenue, enrollmentCount };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  // Reporte 2: tasa de completado por curso
  const completionByCourse = useMemo(() => {
    if (!data) return [];
    return data.courses
      .map((course) => {
        const courseEnrollments = data.enrollments.filter((e) => e.idCourse === course.id);
        const completed = courseEnrollments.filter((e) => e.status === 'COMPLETED').length;
        return {
          title: course.title,
          total: courseEnrollments.length,
          completed,
          rate: courseEnrollments.length > 0 ? Math.round((completed / courseEnrollments.length) * 100) : 0,
        };
      })
      .filter((row) => row.total > 0)
      .sort((a, b) => b.rate - a.rate);
  }, [data]);

  // Reporte 3: promedio de calificación por curso (solo completados)
  const avgGradeByCourse = useMemo(() => {
    if (!data) return [];
    return data.courses
      .map((course) => {
        const grades = data.enrollments
          .filter((e) => e.idCourse === course.id && e.status === 'COMPLETED' && e.grade != null)
          .map((e) => e.grade);
        return {
          title: course.title,
          count: grades.length,
          average: grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : null,
        };
      })
      .filter((row) => row.average != null)
      .sort((a, b) => b.average - a.average);
  }, [data]);

  // Reporte 4: estudiantes por ciudad (top 5 + "Otras")
  const studentsByCity = useMemo(() => {
    if (!data) return [];
    const sorted = [...data.byCity].sort((a, b) => b.count - a.count);
    const top = sorted.slice(0, 5).map((row, index) => ({
      name: row.city,
      value: row.count,
      color: PIE_COLORS[index],
    }));
    const rest = sorted.slice(5).reduce((sum, row) => sum + row.count, 0);
    if (rest > 0) top.push({ name: 'Otras', value: rest, color: OTHER_COLOR });
    return top;
  }, [data]);

  if (!data) return <LoadingSpinner label="Generando reportes…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
        <p className="text-sm text-slate-500">
          Cada reporte muestra el query HQL que tu backend de Hibernate ejecutará para producir estos datos.
        </p>
      </div>

      {/* Reporte 1: Ingresos por instructor */}
      <section className="card p-5">
        <h2 className="text-base font-bold text-slate-800">1 · Ingresos por instructor</h2>
        <p className="mt-0.5 text-sm text-slate-500">Suma del precio de las inscripciones (sin bajas) a sus cursos.</p>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-semibold">Instructor</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Inscripciones</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {revenueByInstructor.map((row, index) => (
                  <tr key={row.name} className={`border-t border-slate-100 ${index % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.name}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{row.enrollmentCount}</td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{formatCurrency(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByInstructor} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }}
                  contentStyle={tooltipStyle}
                  formatter={(value) => [formatCurrency(value), 'Ingresos']}
                />
                <Bar dataKey="revenue" name="Ingresos" fill={PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <HqlBlock
          query={`SELECT i.id, CONCAT(i.firstName, ' ', i.lastName), SUM(c.price)
FROM Enrollment e
  JOIN e.course c
  JOIN c.instructors i
WHERE e.status <> 'DROPPED'
GROUP BY i.id, i.firstName, i.lastName
ORDER BY SUM(c.price) DESC`}
        />
      </section>

      {/* Reporte 2: Tasa de completado */}
      <section className="card p-5">
        <h2 className="text-base font-bold text-slate-800">2 · Tasa de completado por curso</h2>
        <p className="mt-0.5 text-sm text-slate-500">Porcentaje de inscripciones completadas sobre el total.</p>

        <ul className="mt-4 space-y-3">
          {completionByCourse.map((row) => (
            <li key={row.title}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-800">{row.title}</span>
                <span className="shrink-0 tabular-nums text-slate-500">
                  {row.completed}/{row.total} · <span className="font-bold text-slate-800">{row.rate}%</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${row.rate}%` }} />
              </div>
            </li>
          ))}
        </ul>

        <HqlBlock
          query={`SELECT c.id, c.title,
       SUM(CASE WHEN e.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completados,
       COUNT(e) AS total,
       (SUM(CASE WHEN e.status = 'COMPLETED' THEN 1 ELSE 0 END) * 100.0 / COUNT(e)) AS tasa
FROM Enrollment e JOIN e.course c
GROUP BY c.id, c.title
ORDER BY tasa DESC`}
        />
      </section>

      {/* Reporte 3: Promedio de calificación */}
      <section className="card p-5">
        <h2 className="text-base font-bold text-slate-800">3 · Promedio de calificación por curso</h2>
        <p className="mt-0.5 text-sm text-slate-500">Considera únicamente inscripciones con status COMPLETED.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 font-semibold">Curso</th>
                <th className="px-4 py-2.5 text-right font-semibold">Completados</th>
                <th className="px-4 py-2.5 text-right font-semibold">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {avgGradeByCourse.map((row, index) => (
                <tr key={row.title} className={`border-t border-slate-100 ${index % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                  <td className="px-4 py-2.5 font-medium text-slate-800">{row.title}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{row.count}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${
                        row.average >= 9
                          ? 'bg-emerald-100 text-emerald-700'
                          : row.average >= 8
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {row.average.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <HqlBlock
          query={`SELECT c.id, c.title, AVG(e.grade), COUNT(e)
FROM Enrollment e JOIN e.course c
WHERE e.status = 'COMPLETED'
GROUP BY c.id, c.title
ORDER BY AVG(e.grade) DESC`}
        />
      </section>

      {/* Reporte 4: Estudiantes por ciudad */}
      <section className="card p-5">
        <h2 className="text-base font-bold text-slate-800">4 · Estudiantes por ciudad</h2>
        <p className="mt-0.5 text-sm text-slate-500">Distribución geográfica de los estudiantes registrados.</p>

        <div className="mt-4 grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentsByCity}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="85%"
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {studentsByCity.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2">
            {studentsByCity.map((entry) => (
              <li key={entry.name} className="flex items-center gap-2.5 text-sm text-slate-700">
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: entry.color }} aria-hidden="true" />
                <span className="flex-1">{entry.name}</span>
                <span className="font-bold tabular-nums">{entry.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <HqlBlock
          query={`SELECT s.city, COUNT(s)
FROM Student s
GROUP BY s.city
ORDER BY COUNT(s) DESC`}
        />
      </section>
    </div>
  );
}
