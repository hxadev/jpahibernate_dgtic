import { useState } from 'react';
import { CheckCircle2, Circle, Lightbulb, Plug, RefreshCw, XCircle } from 'lucide-react';
import { API_BASE, USE_MOCKS } from '../services/api';

// Endpoints REST que el backend Spring Boot + Hibernate debe exponer
const ENDPOINT_GROUPS = [
  {
    entity: 'Cursos',
    endpoints: [
      { method: 'GET', path: '/api/courses' },
      { method: 'GET', path: '/api/courses/{id}' },
      { method: 'POST', path: '/api/courses' },
      { method: 'PUT', path: '/api/courses/{id}' },
      { method: 'DELETE', path: '/api/courses/{id}' },
      { method: 'GET', path: '/api/courses/top-popular' },
    ],
  },
  {
    entity: 'Instructores',
    endpoints: [
      { method: 'GET', path: '/api/instructors' },
      { method: 'GET', path: '/api/instructors/{id}' },
      { method: 'POST', path: '/api/instructors' },
      { method: 'PUT', path: '/api/instructors/{id}' },
      { method: 'DELETE', path: '/api/instructors/{id}' },
    ],
  },
  {
    entity: 'Categorías',
    endpoints: [
      { method: 'GET', path: '/api/categories' },
      { method: 'POST', path: '/api/categories' },
      { method: 'PUT', path: '/api/categories/{id}' },
      { method: 'DELETE', path: '/api/categories/{id}' },
    ],
  },
  {
    entity: 'Estudiantes',
    endpoints: [
      { method: 'GET', path: '/api/students' },
      { method: 'POST', path: '/api/students' },
      { method: 'PUT', path: '/api/students/{id}' },
      { method: 'DELETE', path: '/api/students/{id}' },
    ],
  },
  {
    entity: 'Inscripciones',
    endpoints: [
      { method: 'GET', path: '/api/enrollments' },
      { method: 'POST', path: '/api/enrollments' },
      { method: 'PUT', path: '/api/enrollments/{id}' },
      { method: 'DELETE', path: '/api/enrollments/{id}' },
    ],
  },
  {
    entity: 'Módulos',
    endpoints: [
      { method: 'GET', path: '/api/modules' },
      { method: 'GET', path: '/api/modules/course/{courseId}' },
      { method: 'POST', path: '/api/modules' },
      { method: 'PUT', path: '/api/modules/{id}' },
      { method: 'DELETE', path: '/api/modules/{id}' },
    ],
  },
  {
    entity: 'Reportes',
    endpoints: [
      { method: 'GET', path: '/api/reports/revenue-by-instructor' },
      { method: 'GET', path: '/api/reports/completion-rate' },
      { method: 'GET', path: '/api/reports/average-grade' },
      { method: 'GET', path: '/api/reports/students-by-city' },
    ],
  },
];

const METHOD_COLORS = {
  GET: 'bg-blue-100 text-blue-700',
  POST: 'bg-emerald-100 text-emerald-700',
  PUT: 'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function BackendStatus() {
  // 'unknown' | 'checking' | 'online' | 'offline'
  const [status, setStatus] = useState('unknown');

  const testConnection = async () => {
    setStatus('checking');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${API_BASE}/courses`, { signal: controller.signal });
      clearTimeout(timeout);
      setStatus(response.ok ? 'online' : 'offline');
    } catch {
      setStatus('offline');
    }
  };

  const connected = status === 'online';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Conexión Backend</h1>
        <p className="text-sm text-slate-500">Estado de la integración con tu API REST de Spring Boot + Hibernate</p>
      </div>

      {/* Estado de conexión */}
      <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              connected ? 'bg-emerald-100 text-success' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Plug size={24} />
          </span>
          <div>
            <p className="flex items-center gap-2 font-bold text-slate-900">
              {connected ? (
                <>
                  <CheckCircle2 size={16} className="text-success" /> Conectado
                </>
              ) : status === 'offline' ? (
                <>
                  <XCircle size={16} className="text-danger" /> Desconectado
                </>
              ) : (
                <>
                  <Circle size={16} className="text-slate-400" /> Sin verificar
                </>
              )}
            </p>
            <p className="text-sm text-slate-500">
              API: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">{API_BASE}</code>
              {USE_MOCKS && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  Modo mock activo
                </span>
              )}
            </p>
          </div>
        </div>
        <button type="button" className="btn-primary" onClick={testConnection} disabled={status === 'checking'}>
          <RefreshCw size={16} className={status === 'checking' ? 'animate-spin' : ''} />
          {status === 'checking' ? 'Probando…' : 'Probar conexión'}
        </button>
      </div>

      {/* Explicación del módulo */}
      <div className="card border-l-4 border-l-primary p-5">
        <p className="flex items-center gap-2 font-bold text-slate-800">
          <Lightbulb size={18} className="text-warning" /> ¿Cómo funciona esta integración?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          En la <strong>Sesión 4 del módulo</strong>, conectarás este frontend con tu backend de Hibernate. Hoy la UI
          funciona con datos mock (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">USE_MOCKS = true</code>{' '}
          en <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">src/services/api.js</code>). Cuando tu
          API REST en Spring Boot exponga los endpoints listados abajo, cambia esa bandera a{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">false</code> y toda la aplicación —
          catálogo, CRUDs, dashboard y reportes — consumirá los datos reales que persiste tu base de datos con
          Hibernate.
        </p>
      </div>

      {/* Lista de endpoints */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {ENDPOINT_GROUPS.map((group) => (
          <section key={group.entity} className="card p-5">
            <h2 className="text-sm font-bold text-slate-800">{group.entity}</h2>
            <ul className="mt-3 space-y-2">
              {group.endpoints.map((endpoint) => (
                <li
                  key={`${endpoint.method} ${endpoint.path}`}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-100 px-3 py-2"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${connected ? 'bg-success' : 'bg-slate-300'}`}
                    title={connected ? 'Disponible' : 'No disponible'}
                    aria-label={connected ? 'Disponible' : 'No disponible'}
                  />
                  <span
                    className={`w-16 shrink-0 rounded px-1.5 py-0.5 text-center text-[11px] font-bold ${METHOD_COLORS[endpoint.method]}`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="truncate font-mono text-xs text-slate-600">{endpoint.path}</code>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
