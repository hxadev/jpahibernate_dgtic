import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { categoryService } from '../services/categoryService';
import { courseService } from '../services/courseService';

const EMPTY_FORM = { name: '', description: '', active: true };

export default function Categories() {
  const [categories, setCategories] = useState(null);
  const [courses, setCourses] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    categoryService.getAll().then(setCategories);
    courseService.getAll().then(setCourses);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const courseCounts = useMemo(() => {
    return courses.reduce((acc, course) => {
      acc[course.categoryId] = (acc[course.categoryId] || 0) + 1;
      return acc;
    }, {});
  }, [courses]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({ name: category.name, description: category.description, active: category.active });
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
      if (editing) await categoryService.update(editing.id, { ...form, active: !!form.active });
      else await categoryService.create({ ...form, active: true });
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
      await categoryService.delete(toDelete.id);
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
        key: 'name',
        header: 'Nombre',
        render: (row) => <span className="font-semibold text-slate-800">{row.name}</span>,
      },
      { key: 'description', header: 'Descripción', className: 'text-slate-500' },
      {
        key: 'courses',
        header: 'Cursos',
        render: (row) => <span className="font-semibold tabular-nums">{courseCounts[row.id] || 0}</span>,
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
            {row.active ? 'Activa' : 'Inactiva'}
          </span>
        ),
      },
    ],
    [courseCounts]
  );

  if (!categories) return <LoadingSpinner label="Cargando categorías…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de categorías</h1>
          <p className="text-sm text-slate-500">Organiza los cursos por áreas de conocimiento</p>
        </div>
        <button type="button" className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={categories}
        searchKeys={['name', 'description']}
        searchPlaceholder="Buscar categoría…"
        onEdit={openEdit}
        onDelete={setToDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar categoría' : 'Nueva categoría'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" form="category-form" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nombre" name="name" value={form.name} onChange={handleChange} required />
          <FormField
            label="Descripción"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="¿Eliminar categoría?"
        message={`Se eliminará la categoría "${toDelete?.name}". Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
