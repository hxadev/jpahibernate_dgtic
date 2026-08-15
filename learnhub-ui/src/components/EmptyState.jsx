import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Sin datos',
  message = 'No hay registros para mostrar.',
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon size={26} />
      </span>
      <p className="mt-1 font-semibold text-slate-700">{title}</p>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
