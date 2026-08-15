// Badge de nivel: Beginner=verde, Intermediate=amarillo, Advanced=rojo
const LEVEL_STYLES = {
  BEGINNER: { label: 'Beginner', classes: 'bg-emerald-100 text-emerald-700' },
  INTERMEDIATE: { label: 'Intermediate', classes: 'bg-amber-100 text-amber-700' },
  ADVANCED: { label: 'Advanced', classes: 'bg-red-100 text-red-700' },
};

export default function LevelBadge({ level }) {
  const title = typeof level === 'string' ? level : level?.title;
  const style = LEVEL_STYLES[title] || { label: title || '—', classes: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.classes}`}>
      {style.label}
    </span>
  );
}
