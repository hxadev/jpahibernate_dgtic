import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Star } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import LevelBadge from '../components/LevelBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { categoryService } from '../services/categoryService';
import { courseService } from '../services/courseService';
import { levelService } from '../services/levelService';
import { formatCurrency } from '../utils/formatters';

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  duration: '',
  levelId: '',
  categoryId: '',
  ranking: 3,
  active: true,
};

export default function Courses() {
  const [courses, setCourses] = useState(null);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // curso en edición o null (nuevo)
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    courseService.getAll().then(setCourses);
  }, []);

  useEffect(() => {
    load();
    categoryService.getAll().then(setCategories);
    levelService.getAll().then(setLevels);
  }, [load]);

  const categoryById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const levelById = useMemo(() => Object.fromEntries(levels.map((l) => [l.id, l])), [levels]);

  const filtered = useMemo(() => {
    if (!courses) return [];
    if (!categoryFilter) return courses;
    return courses.filter((c) => c.categoryId === Number(categoryFilter));
  }, [courses, categoryFilter]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      title: course.title,
      description: course.description,
      price: course.price,
      duration: course.duration,
      levelId: course.levelId,
      categoryId: course.categoryId,
      ranking: course.ranking,
      active: course.active,
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
      ...form,
      price: Number(form.price),
      duration: Number(form.duration),
      levelId: Number(form.levelId),
      categoryId: Number(form.categoryId),
      ranking: Number(form.ranking),
      active: !!form.active,
    };
    try {
      if (editing) await courseService.update(editing.id, payload);
      else await courseService.create(payload);
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
      await courseService.delete(toDelete.id);
      setToDelete(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  if (!courses) return <LoadingSpinner label="Cargando cursos…" />;

  const columns = [
    {
      key: 'title',
      header: 'Título',
      render: (row) => <span className="font-semibold text-slate-800">{row.title}</span>,
    },
    {
      key: 'categoryId',
      header: 'Categoría',
      render: (row) => categoryById[row.categoryId]?.name || '—',
    },
    {
      key: 'price',
      header: 'Precio',
      render: (row) => <span className="tabular-nums">{formatCurrency(row.price)}</span>,
    },
    { key: 'duration', header: 'Duración', render: (row) => `${row.duration} h` },
    {
      key: 'levelId',
      header: 'Nivel',
      render: (row) => <LevelBadge level={levelById[row.levelId]} />,
    },
    {
      key: 'ranking',
      header: 'Rating',
      render: (row) => (
        <span className="inline-flex items-center gap-0.5" aria-label={`${row.ranking} de 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={13} className={n <= row.ranking ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
          ))}
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de cursos</h1>
          <p className="text-sm text-slate-500">Administra el catálogo de cursos de LearnHub</p>
        </div>
        <button type="button" className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nuevo curso
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        searchKeys={['title', 'description']}
        searchPlaceholder="Buscar curso…"
        onEdit={openEdit}
        onDelete={setToDelete}
        toolbar={
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="input-field sm:w-56"
            aria-label="Filtrar por categoría"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        }
      />

      {/* Modal de formulario */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar curso' : 'Nuevo curso'}
        size="lg"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" form="course-form" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="course-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField label="Título" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="sm:col-span-2">
            <FormField
              label="Descripción"
              name="description"
              type="textarea"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>
          <FormField
            label="Precio (MXN)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            min={0}
            step="0.01"
          />
          <FormField
            label="Duración (horas)"
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
            required
            min={1}
          />
          <FormField
            label="Nivel"
            name="levelId"
            type="select"
            value={form.levelId}
            onChange={handleChange}
            required
            options={levels.map((level) => ({ value: level.id, label: level.title }))}
          />
          <FormField
            label="Categoría"
            name="categoryId"
            type="select"
            value={form.categoryId}
            onChange={handleChange}
            required
            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
          />
          <FormField
            label="Ranking (1-5)"
            name="ranking"
            type="number"
            value={form.ranking}
            onChange={handleChange}
            required
            min={1}
            max={5}
          />
          <FormField label="Activo" name="active" type="toggle" value={form.active} onChange={handleChange} />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="¿Eliminar curso?"
        message={`Se eliminará el curso "${toDelete?.title}". Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
