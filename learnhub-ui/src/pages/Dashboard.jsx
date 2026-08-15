import { useEffect, useMemo, useState } from 'react';
import { BookOpen, DollarSign, GraduationCap, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { categoryService } from '../services/categoryService';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { levelService } from '../services/levelService';
import { studentService } from '../services/studentService';
import { formatCurrency, formatDate, fullName } from '../utils/formatters';

const PRIMARY = '#2563eb';
// Colores por nivel (validados para visión de color; la leyenda y etiquetas
// de texto refuerzan la identidad de cada segmento)
const LEVEL_COLORS = { BEGINNER: '#059669', INTERMEDIATE: '#f59e0b', ADVANCED: '#dc2626' };
const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const tooltipStyle = {
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
  fontSize: 13,
};

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      courseService.getAll(),
      studentService.getAll(),
      enrollmentService.getAll(),
      categoryService.getAll(),
      levelService.getAll(),
      courseService.getTopPopular(5),
    ]).then(([courses, students, enrollments, categories, levels, topCourses]) => {
      if (!cancelled) setData({ courses, students, enrollments, categories, levels, topCourses });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    const { courses, students, enrollments } = data;
    const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));
    const revenue = enrollments
      .filter((e) => e.status !== 'DROPPED')
      .reduce((sum, e) => sum + (courseById[e.idCourse]?.price || 0), 0);
    return {
      totalCourses: courses.length,
      activeStudents: students.filter((s) => s.active).length,
      totalEnrollments: enrollments.length,
      revenue,
    };
  }, [data]);

  const byCategory = useMemo(() => {
    if (!data) return [];
    const { courses, enrollments, categories } = data;
    const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));
    return categories.map((cat) => ({
      name: cat.name,
      inscripciones: enrollments.filter((e) => courseById[e.idCourse]?.categoryId === cat.id).length,
    }));
  }, [data]);

  const byMonth = useMemo(() => {
    if (!data) return [];
    const counts = {};
    data.enrollments.forEach((e) => {
      const date = new Date(e.enrollmentDate);
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.keys(counts)
      .sort()
      .map((key) => {
        const [year, month] = key.split('-').map(Number);
        return { name: `${MONTH_LABELS[month]} ${String(year).slice(2)}`, inscripciones: counts[key] };
      });
  }, [data]);

  const byLevel = useMemo(() => {
    if (!data) return [];
    const { courses, enrollments, levels } = data;
    const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));
    return levels.map((level) => ({
      name: level.title,
      value: enrollments.filter((e) => courseById[e.idCourse]?.levelId === level.id).length,
    }));
  }, [data]);

  const recent = useMemo(() => {
    if (!data) return [];
    const studentById = Object.fromEntries(data.students.map((s) => [s.id, s]));
    const courseById = Object.fromEntries(data.courses.map((c) => [c.id, c]));
    return [...data.enrollments]
      .sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate))
      .slice(0, 5)
      .map((e) => ({
        ...e,
        studentName: fullName(studentById[e.idStudent]),
        courseTitle: courseById[e.idCourse]?.title || '—',
      }));
  }, [data]);

  if (!data || !stats) return <LoadingSpinner label="Cargando dashboard…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Resumen general de la plataforma LearnHub</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total cursos"
          value={stats.totalCourses}
          subtext={`${data.courses.filter((c) => c.active).length} activos`}
          iconClasses="bg-blue-100 text-primary"
        />
        <StatCard
          icon={Users}
          label="Estudiantes activos"
          value={stats.activeStudents}
          subtext={`${data.students.length} registrados`}
          iconClasses="bg-emerald-100 text-success"
        />
        <StatCard
          icon={GraduationCap}
          label="Inscripciones"
          value={stats.totalEnrollments}
          subtext={`${data.enrollments.filter((e) => e.status === 'COMPLETED').length} completadas`}
          iconClasses="bg-amber-100 text-warning"
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos totales"
          value={formatCurrency(stats.revenue)}
          subtext="Inscripciones sin bajas"
          iconClasses="bg-orange-100 text-accent"
        />
      </div>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-sm font-bold text-slate-800">Inscripciones por categoría</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={75}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }} contentStyle={tooltipStyle} />
                <Bar dataKey="inscripciones" name="Inscripciones" fill={PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-bold text-slate-800">Inscripciones por mes</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byMonth} margin={{ top: 8, right: 12, bottom: 4, left: -20 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="inscripciones"
                  name="Inscripciones"
                  stroke={PRIMARY}
                  strokeWidth={2}
                  dot={{ r: 3, fill: PRIMARY, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Top 5 cursos */}
        <section className="card p-5">
          <h2 className="text-sm font-bold text-slate-800">Top 5 cursos más populares</h2>
          <ol className="mt-4 space-y-3">
            {data.topCourses.map((course, index) => (
              <li key={course.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{course.title}</p>
                  <p className="text-xs text-slate-500">{formatCurrency(course.price)}</p>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums text-slate-700">
                  {course.enrollmentCount}
                  <span className="ml-1 text-xs font-normal text-slate-400">insc.</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Inscripciones recientes */}
        <section className="card p-5">
          <h2 className="text-sm font-bold text-slate-800">Inscripciones recientes</h2>
          <ul className="mt-4 space-y-3.5">
            {recent.map((enrollment) => (
              <li key={enrollment.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{enrollment.studentName}</p>
                  <p className="truncate text-xs text-slate-500">
                    {enrollment.courseTitle} · {formatDate(enrollment.enrollmentDate)}
                  </p>
                </div>
                <StatusBadge status={enrollment.status} />
              </li>
            ))}
          </ul>
        </section>

        {/* Distribución por nivel */}
        <section className="card p-5">
          <h2 className="text-sm font-bold text-slate-800">Distribución por nivel</h2>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byLevel}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {byLevel.map((entry) => (
                    <Cell key={entry.name} fill={LEVEL_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
            {byLevel.map((entry) => (
              <li key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: LEVEL_COLORS[entry.name] || '#94a3b8' }}
                  aria-hidden="true"
                />
                {entry.name} · <span className="font-semibold tabular-nums">{entry.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
