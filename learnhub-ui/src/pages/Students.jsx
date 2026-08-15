import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { studentService } from '../services/studentService';
import { formatDate, fullName, initials } from '../utils/formatters';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  birthDate: '',
  city: '',
  state: '',
  country: 'MEX',
  active: true,
};

export default function Students() {
  const [students, setStudents] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Detalle
  const [selected, setSelected] = useState(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState(null);

  const load = useCallback(() => {
    studentService.getAll().then(setStudents);
    enrollmentService.getAll().then(setEnrollments);
    courseService.getAll().then(setCourses);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selected) {
      setSelectedEnrollments(null);
      return undefined;
    }
    let cancelled = false;
    enrollmentService.getByStudent(selected.id).then((list) => {
      if (!cancelled) setSelectedEnrollments(list);
    });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const enrollmentCounts = useMemo(() => {
    return enrollments.reduce((acc, e) => {
      acc[e.idStudent] = (acc[e.idStudent] || 0) + 1;
      return acc;
    }, {});
  }, [enrollments]);

  const courseById = useMemo(() => Object.fromEntries(courses.map((c) => [c.id, c])), [courses]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      birthDate: student.birthDate,
      city: student.city,
      state: student.state,
      country: student.country,
      active: student.active,
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'country' ? String(value).toUpperCase().slice(0, 3) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editing) await studentService.update(editing.id, { ...form, active: !!form.active });
      else await studentService.create({ ...form, active: true });
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await studentService.delete(toDelete.id);
      setToDelete(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: 'id', header: 'ID', className: 'font-mono text-xs text-slate-500' },
      {
        key: 'firstName',
        header: 'Nombre',
        render: (row) => (
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
              {initials(row)}
            </span>
            <span className="font-semibold text-slate-800">{fullName(row)}</span>
          </span>
        ),
      },
      { key: 'email', header: 'Email', className: 'text-slate-500' },
      { key: 'city', header: 'Ciudad' },
      { key: 'country', header: 'País', className: 'font-mono text-xs' },
      {
        key: 'enrollments',
        header: 'Inscripciones',
        render: (row) => <span className="font-semibold tabular-nums">{enrollmentCounts[row.id] || 0}</span>,
      },
      {
        key: 'active',
        header: 'Estado',
        render: (row) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              row.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {row.active ? 'Activo' : 'Inactivo'}
          </span>
        ),
      },
    ],
    [enrollmentCounts]
  );

  if (!students) return <LoadingSpinner label="Cargando estudiantes…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de estudiantes</h1>
          <p className="text-sm text-slate-500">Administra los estudiantes registrados en LearnHub</p>
        </div>
        <button type="button" className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nuevo estudiante
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={students}
        searchKeys={['id', 'firstName', 'lastName', 'email', 'city', 'state']}
        searchPlaceholder="Buscar estudiante…"
        onView={setSelected}
        onEdit={openEdit}
        onDelete={setToDelete}
      />

      {/* Modal de formulario */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar estudiante' : 'Nuevo estudiante'}
        size="lg"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" form="student-form" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="student-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nombre" name="firstName" value={form.firstName} onChange={handleChange} required />
          <FormField label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormField
            label="Fecha de nacimiento"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            required
          />
          <FormField label="Ciudad" name="city" value={form.city} onChange={handleChange} required />
          <FormField label="Estado" name="state" value={form.state} onChange={handleChange} required />
          <FormField
            label="País (código de 3 letras)"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            maxLength={3}
            hint="Código ISO 3166-1 alfa-3, p. ej. MEX"
          />
        </form>
      </Modal>

      {/* Vista de detalle */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Perfil del estudiante" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xl font-bold text-white">
                {initials(selected)}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900">{fullName(selected)}</h3>
                <p className="text-sm text-slate-500">{selected.email}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={14} /> {selected.city}, {selected.state} · {selected.country}
                </p>
                <p className="mt-0.5 font-mono text-xs text-slate-400">
                  {selected.id} · Nació el {formatDate(selected.birthDate)}
                </p>
              </div>
            </div>

            <section>
              <h4 className="mb-2 text-sm font-bold text-slate-800">Inscripciones y calificaciones</h4>
              {!selectedEnrollments ? (
                <LoadingSpinner label="Cargando inscripciones…" />
              ) : selectedEnrollments.length === 0 ? (
                <EmptyState title="Sin inscripciones" message="Este estudiante aún no se inscribe a ningún curso." />
              ) : (
                <ul className="space-y-2">
                  {selectedEnrollments.map((enrollment) => (
                    <li
                      key={enrollment.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {courseById[enrollment.idCourse]?.title || '—'}
                        </p>
                        <p className="text-xs text-slate-500">Inscrito el {formatDate(enrollment.enrollmentDate)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-bold tabular-nums text-slate-700">
                          {enrollment.grade != null ? enrollment.grade.toFixed(1) : '—'}
                        </span>
                        <StatusBadge status={enrollment.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="¿Eliminar estudiante?"
        message={`Se eliminará a ${toDelete ? fullName(toDelete) : ''}. Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
