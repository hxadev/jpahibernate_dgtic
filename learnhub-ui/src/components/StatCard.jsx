// Tarjeta de estadística: ícono, valor, label y subtexto opcional
export default function StatCard({ icon: Icon, value, label, subtext, iconClasses = 'bg-blue-100 text-primary' }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 truncate text-3xl font-bold text-slate-900">{value}</p>
          {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
        </div>
        {Icon && (
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClasses}`}>
            <Icon size={22} />
          </span>
        )}
      </div>
    </div>
  );
}
