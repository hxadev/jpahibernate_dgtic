// Badge de estado de inscripción.
// ENROLLED=azul, IN_PROGRESS=amarillo, COMPLETED=verde, DROPPED=rojo
const STATUS_STYLES = {
  ENROLLED: { label: 'Inscrito', classes: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'En progreso', classes: 'bg-amber-100 text-amber-700' },
  COMPLETED: { label: 'Completado', classes: 'bg-emerald-100 text-emerald-700' },
  DROPPED: { label: 'Baja', classes: 'bg-red-100 text-red-700' },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { label: status, classes: 'bg-slate-100 text-slate-600' };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.classes}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {style.label}
    </span>
  );
}
