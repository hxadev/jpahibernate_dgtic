import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: BookOpen, text: '12 cursos de tecnología impartidos por expertos' },
  { icon: Users, text: 'Comunidad de estudiantes en todo México' },
  { icon: BarChart3, text: 'Dashboard con métricas y reportes en tiempo real' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError('Ingresa tu email y contraseña.');
      return;
    }
    if (mode === 'signup' && !form.name.trim()) {
      setError('Ingresa tu nombre.');
      return;
    }
    login({ name: form.name, email: form.email });
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Hero izquierdo */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 lg:flex">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 max-w-lg px-12">
          <div className="flex items-center gap-3">
            <span className="text-5xl" aria-hidden="true">
              🎓
            </span>
            <h1 className="text-4xl font-extrabold text-white">LearnHub</h1>
          </div>
          <p className="mt-6 text-xl font-semibold leading-snug text-blue-100">
            La plataforma de cursos en línea para impulsar tu carrera en tecnología.
          </p>
          <ul className="mt-10 space-y-5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4 text-blue-100">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon size={20} />
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-xs text-blue-300/70">
            Módulo 3: Persistencia con Hibernate · Diplomado de Java · DGTIC-UNAM
          </p>
        </div>
      </div>

      {/* Formulario derecho */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="text-3xl" aria-hidden="true">
              🎓
            </span>
            <span className="text-2xl font-extrabold text-white">LearnHub</span>
          </div>

          <div className="rounded-card border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {mode === 'login'
                ? 'Bienvenido de vuelta. Ingresa tus credenciales.'
                : 'Únete a LearnHub y empieza a aprender hoy.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-300">
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="w-full rounded-lg border-2 border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border-2 border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border-2 border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-primary"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {mode === 'login' ? 'Entrar' : 'Registrarme'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-400">
              {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button
                type="button"
                onClick={() => setMode((prev) => (prev === 'login' ? 'signup' : 'login'))}
                className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>

            <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-500">
              <p className="flex items-center gap-1.5 font-semibold text-slate-400">
                <GraduationCap size={14} /> Demo académica
              </p>
              <p className="mt-1">
                Cualquier email funciona. Usa un email que contenga <span className="text-slate-300">admin</span> para
                entrar como administrador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
