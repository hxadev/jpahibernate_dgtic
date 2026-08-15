import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

// Diálogo de confirmación para acciones destructivas (eliminar)
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = '¿Eliminar registro?',
  message = 'Esta acción no se puede deshacer.',
  confirmLabel = 'Eliminar',
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-danger">
          <AlertTriangle size={20} />
        </span>
        <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      </div>
    </Modal>
  );
}
