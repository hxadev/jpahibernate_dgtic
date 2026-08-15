import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import BackendStatus from './pages/BackendStatus';
import Catalog from './pages/Catalog';
import Categories from './pages/Categories';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import Enrollments from './pages/Enrollments';
import Instructors from './pages/Instructors';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Students from './pages/Students';

function ProtectedRoutes() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/students" element={<Students />} />
        <Route path="/enrollments" element={<Enrollments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/backend-status" element={<BackendStatus />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
