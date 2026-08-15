import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { studentService } from '../services/studentService';
import { formatDateTime, fullName } from '../utils/formatters';

const STATUS_OPTIONS = [
  { value: 'ENROLLED', label: 'ENROLLED — Inscrito' },
  { value: 'IN_PROGRESS', label: 'IN_PROGRESS — En progreso' },
  { value: 'COMPLETED', label: 'COMPLETED — Completado' },
  { value: 'DROPPED', label: 'DROPPED — Baja' },
];

const EMPTY_FORM = { idStudent: '', idCourse: '', grade: '', status: 'ENROLLED' };

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    enrollmentService.getAll().then(setEnrollments);
    studentService.getAll().then(setStudents);
    courseService.getAll().then(setCourses);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const studentById = useMemo(() => Object.fromEntries(students.map((s) => [s.id, s])), [students]);
  const courseById = useMemo(() => Object.fromEntries(courses.map((c) => [c.id, c])), [courses]);

  // Filas enriquecidas para que la búsqueda encuentre nombre y curso
  const rows = useMemo(() => {
    if (!enrollments) return [];
    return enrollments.map((e) => ({
      ...e,
      studentName: fullName(studentById[e.idStudent]),
      courseTitle: courseById[e.idCourse]?.title || '—',
    }));
  }, [enrollments, studentById, courseById]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (enrollment) => {
    setEditing(enrollment);
    setForm({
      idStudent: enrollment.idStudent,
      idCourse: enrollment.idCourse,
      grade: enrollment.grade ?? '',
      status: enrollment.status,
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      idStudent: form.idStudent,
      idCourse: Number(form.idCourse),
      grade: form.grade === '' ? null : Number(form.grade),
      status: form.status,
      completionDate: form.status === 'COMPLETED' ? new Date().toISOString().slice(0, 19) : null,
    };
    try {
      if (editing) await enrollmentService.update(editing.id, payload);
      else await enrollmentService.create(payload);
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
      await enrollmentService.delete(toDelete.id);
      setToDelete(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'font-mono text-xs text-slate-500' },
    {
      key: 'studentName',
      header: 'Estudiante',
      render: (row) => <span className="font-semibold text-slate-800">{row.studentName}</span>,
    },
    { key: 'courseTitle', header: 'Curso' },
    {
      key: 'grade',
      header: 'Calificación',
      render: (row) => (
        <span className="font-semibold tabular-nums">{row.grade != null ? Number(row.grade).toFixed(1) : '—'}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'enrollmentDate',
      header: 'Fecha inscripción',
      render: (row) => <span className="text-slate-500">{formatDateTime(row.enrollmentDate)}</span>,
    },
  ];

  if (!enrollments) return <LoadingSpinner label="Cargando inscripciones…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de inscripciones</h1>
          <p className="text-sm text-slate-500">Administra las inscripciones de estudiantes a cursos</p>
        </div>
        <button type="button" className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nueva inscripción
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={['studentName', 'courseTitle', 'status']}
        searchPlaceholder="Buscar por estudiante o curso…"
        onEdit={openEdit}
        onDelete={setToDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar inscripción' : 'Nueva inscripción'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" form="enrollment-form" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="enrollment-form" onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Estudiante"
            name="idStudent"
            type="select"
            value={form.idStudent}
            onChange={handleChange}
            required
            options={students.map((s) => ({ value: s.id, label: `${fullName(s)} (${s.id})` }))}
          />
          <FormField
            label="Curso"
            name="idCourse"
            type="select"
            value={form.idCourse}
            onChange={handleChange}
            required
            options={courses.map((c) => ({ value: c.id, label: c.title }))}
          />
          <FormField
            label="Calificación (0-10)"
            name="grade"
            type="number"
            value={form.grade}
            onChange={handleChange}
            min={0}
            max={10}
            step="0.1"
            hint="Opcional: déjalo vacío si el curso aún no tiene calificación."
          />
          <FormField
            label="Status"
            name="status"
            type="select"
            value={form.status}
            onChange={handleChange}
            required
            options={STATUS_OPTIONS}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="¿Eliminar inscripción?"
        message={`Se eliminará la inscripción #${toDelete?.id} de ${toDelete?.studentName}. Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
