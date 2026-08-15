import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/formatters';
import Sidebar from './Sidebar';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = user?.role === 'ADMIN' ? 'Administrador' : 'Estudiante';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar escritorio */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Sidebar móvil (overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0">
            <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4">
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 768) setMobileOpen(true);
              else setCollapsed((prev) => !prev);
            }}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="Alternar menú"
          >
            <Menu size={20} />
          </button>

          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar cursos, estudiantes, instructores…"
              className="input-field pl-9"
              aria-label="Búsqueda global"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
              aria-label="Notificaciones"
            >
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {initials(user?.name || '?')}
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">{roleLabel}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-danger"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
