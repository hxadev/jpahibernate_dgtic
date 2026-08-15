export default function LoadingSpinner({ label = 'Cargando…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}
