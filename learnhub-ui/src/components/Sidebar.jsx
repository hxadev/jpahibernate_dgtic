import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Library,
  Plug,
  UserCheck,
  Users,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/catalog', label: 'Catálogo', icon: Library },
  { to: '/courses', label: 'Cursos', icon: BookOpen },
  { to: '/instructors', label: 'Instructores', icon: UserCheck },
  { to: '/categories', label: 'Categorías', icon: FolderKanban },
  { to: '/students', label: 'Estudiantes', icon: Users },
  { to: '/enrollments', label: 'Inscripciones', icon: GraduationCap },
  { to: '/reports', label: 'Reportes', icon: BarChart3 },
  { to: '/backend-status', label: 'Conexión Backend', icon: Plug },
];

export default function Sidebar({ collapsed, onNavigate }) {
  return (
    <aside
      className={`flex h-full flex-col bg-sidebar text-slate-300 transition-all duration-200 ${
        collapsed ? 'w-[68px]' : 'w-60'
      }`}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700/60 px-4">
        <span className="text-2xl" aria-hidden="true">
          🎓
        </span>
        {!collapsed && <span className="truncate text-lg font-bold text-white">LearnHub</span>}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onNavigate}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <Icon size={19} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-slate-700/60 px-4 py-4 text-center">
        {collapsed ? (
          <span className="text-xs text-slate-500">🇲🇽</span>
        ) : (
          <>
            <p className="text-xs font-medium text-slate-400">DGTIC-UNAM · Ed. 20</p>
            <p className="mt-0.5 text-xs text-slate-500">hxadev.tech</p>
          </>
        )}
      </div>
    </aside>
  );
}
