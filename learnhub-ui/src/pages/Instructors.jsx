import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, Mail, Plus } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { courseService } from '../services/courseService';
import { instructorService } from '../services/instructorService';
import { mockDb } from '../services/api';
import { formatCurrency, fullName, initials } from '../utils/formatters';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', speciality: '', bio: '', active: true };

export default function Instructors() {
  const [instructors, setInstructors] = useState(null);
  const [courseCounts, setCourseCounts] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Detalle
  const [selected, setSelected] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState(null);

  const load = useCallback(() => {
    instructorService.getAll().then((list) => {
      setInstructors(list);
      const counts = {};
      mockDb.instructorsCourses.forEach((ic) => {
        counts[ic.idInstructor] = (counts[ic.idInstructor] || 0) + 1;
      });
      setCourseCounts(counts);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selected) {
      setSelectedCourses(null);
      return undefined;
    }
    let cancelled = false;
    courseService.getByInstructor(selected.id).then((list) => {
      if (!cancelled) setSelectedCourses(list);
    });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (instructor) => {
    setEditing(instructor);
    setForm({
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      email: instructor.email,
      speciality: instructor.speciality,
      bio: instructor.bio,
      active: instructor.active,
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
    try {
      if (editing) await instructorService.update(editing.id, { ...form, active: !!form.active });
      else await instructorService.create({ ...form, active: true });
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
      await instructorService.delete(toDelete.id);
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
        header: 'Nombre completo',
        render: (row) => (
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {initials(row)}
            </span>
            <span className="font-semibold text-slate-800">{fullName(row)}</span>
          </span>
        ),
      },
      { key: 'email', header: 'Email', className: 'text-slate-500' },
      { key: 'speciality', header: 'Especialidad' },
      {
        key: 'courses',
        header: 'Cursos',
        render: (row) => (
          <span className="inline-flex items-center gap-1 font-semibold tabular-nums text-slate-700">
            <BookOpen size={13} className="text-slate-400" /> {courseCounts[row.id] || 0}
          </span>
        ),
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
    [courseCounts]
  );

  if (!instructors) return <LoadingSpinner label="Cargando instructores…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de instructores</h1>
          <p className="text-sm text-slate-500">Administra el equipo docente de LearnHub</p>
        </div>
        <button type="button" className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nuevo instructor
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={instructors}
        searchKeys={['id', 'firstName', 'lastName', 'email', 'speciality']}
        searchPlaceholder="Buscar instructor…"
        onView={setSelected}
        onEdit={openEdit}
        onDelete={setToDelete}
      />

      {/* Modal de formulario */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar instructor' : 'Nuevo instructor'}
        size="lg"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" form="instructor-form" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="instructor-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nombre" name="firstName" value={form.firstName} onChange={handleChange} required />
          <FormField label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormField label="Especialidad" name="speciality" value={form.speciality} onChange={handleChange} required />
          <div className="sm:col-span-2">
            <FormField label="Bio" name="bio" type="textarea" value={form.bio} onChange={handleChange} rows={4} />
          </div>
        </form>
      </Modal>

      {/* Vista de detalle */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Perfil del instructor" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                {initials(selected)}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900">{fullName(selected)}</h3>
                <p className="text-sm font-medium text-primary">{selected.speciality}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail size={14} /> {selected.email}
                </p>
                <p className="mt-0.5 font-mono text-xs text-slate-400">{selected.id}</p>
              </div>
            </div>

            <p className="rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">{selected.bio}</p>

            <section>
              <h4 className="mb-2 text-sm font-bold text-slate-800">Cursos que imparte</h4>
              {!selectedCourses ? (
                <LoadingSpinner label="Cargando cursos…" />
              ) : selectedCourses.length === 0 ? (
                <EmptyState title="Sin cursos" message="Este instructor aún no tiene cursos asignados." />
              ) : (
                <ul className="space-y-2">
                  {selectedCourses.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{course.title}</p>
                        <p className="text-xs text-slate-500">{course.duration} h</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-slate-700">{formatCurrency(course.price)}</span>
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
        title="¿Eliminar instructor?"
        message={`Se eliminará a ${toDelete ? fullName(toDelete) : ''}. Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
