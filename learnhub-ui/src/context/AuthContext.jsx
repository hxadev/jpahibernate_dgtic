import { createContext, useContext, useState } from 'react';

// Sesión simulada: cualquier email funciona.
// Si el email contiene "admin" el rol es administrador; si no, estudiante.
const STORAGE_KEY = 'learnhub_session';

const AuthContext = createContext(null);

const readSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const login = ({ name, email }) => {
    const role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'STUDENT';
    const session = {
      name: name?.trim() || email.split('@')[0],
      email,
      role,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
