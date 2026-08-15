import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Pencil, Search, Trash2 } from 'lucide-react';
import EmptyState from './EmptyState';

// Tabla genérica con columnas dinámicas, búsqueda, paginación y acciones.
// columns: [{ key, header, render?: (row) => node, className? }]
// searchKeys: campos sobre los que filtra la búsqueda (si se omite, usa todos los valores)
// onView / onEdit / onDelete: si se definen, agregan la columna de acciones
export default function DataTable({
  columns,
  rows,
  searchKeys = null,
  searchPlaceholder = 'Buscar…',
  pageSize = 8,
  onView = null,
  onEdit = null,
  onDelete = null,
  toolbar = null,
  emptyTitle = 'Sin registros',
  emptyMessage = 'No hay datos que coincidan con la búsqueda.',
  getRowId = (row) => row.id,
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => {
      const values = searchKeys ? searchKeys.map((key) => row[key]) : Object.values(row);
      return values.some((value) => String(value ?? '').toLowerCase().includes(term));
    });
  }, [rows, search, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasActions = onView || onEdit || onDelete;

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
            className="input-field pl-9"
            aria-label="Buscar en la tabla"
          />
        </div>
        {toolbar}
      </div>

      {pageRows.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                {columns.map((col) => (
                  <th key={col.key} className={`px-4 py-3 font-semibold ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
                {hasActions && <th className="px-4 py-3 text-right font-semibold">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, index) => (
                <tr
                  key={getRowId(row)}
                  className={`border-t border-slate-100 transition-colors hover:bg-blue-50/50 ${
                    index % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {onView && (
                          <button
                            type="button"
                            onClick={() => onView(row)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-100 hover:text-primary"
                            title="Ver detalle"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-amber-100 hover:text-amber-600"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(row)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-100 hover:text-danger"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
        <span>
          {filtered.length} registro{filtered.length !== 1 && 's'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-lg border border-slate-200 p-1.5 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="tabular-nums">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-slate-200 p-1.5 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
