import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Store, Settings as SettingsIcon, LogOut, Users, DollarSign } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Establishments from './pages/Establishments';
import Staff from './pages/Staff';
import Finance from './pages/Finance';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const isSuper = user?.role === 'super';

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'white' }}>
            Admin<span style={{ color: 'var(--primary)' }}>Panel</span>
          </h2>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user?.email}</div>
        </div>

        <nav style={{ flex: 1 }}>
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {isSuper && (
            <NavLink to="/establishments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Store size={20} />
              <span>Estabelecimentos</span>
            </NavLink>
          )}

          {!isSuper && (
            <NavLink to="/staff" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span>Equipe</span>
            </NavLink>
          )}

          <NavLink to="/finance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <DollarSign size={20} />
            <span>Financeiro</span>
          </NavLink>

          {isSuper && (
            <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <SettingsIcon size={20} />
              <span>Configurações</span>
            </NavLink>
          )}
        </nav>

        <button onClick={logout} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'flex-start', paddingLeft: '0' }}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <RequireAuth>
              <Layout><Dashboard /></Layout>
            </RequireAuth>
          } />

          <Route path="/establishments" element={
            <RequireAuth>
              <Layout><Establishments /></Layout>
            </RequireAuth>
          } />

          <Route path="/staff" element={
            <RequireAuth>
              <Layout><Staff /></Layout>
            </RequireAuth>
          } />

          <Route path="/finance" element={
            <RequireAuth>
              <Layout><Finance /></Layout>
            </RequireAuth>
          } />

          <Route path="/settings" element={
            <RequireAuth>
              <Layout><Settings /></Layout>
            </RequireAuth>
          } />

          {/* Catch all - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
