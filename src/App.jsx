import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Settings as SettingsIcon, LogOut, Users, DollarSign, Package } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Establishments from './pages/Establishments';
import Staff from './pages/Staff';
import Finance from './pages/Finance';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import { AuthProvider, useAuth } from './context/AuthContext';
import logoUrl from './assets/logo.png';

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const RequireEstablishment = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!user.hasEstablishment && user.role !== 'super') return <Navigate to="/establishments" />;
  return children;
};

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const isSuper = user?.role === 'super';

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div style={{ marginBottom: '3rem' }}>
          <img src={logoUrl} alt="Consagrado Logo" style={{ height: '40px', marginBottom: '0.5rem', filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' }} />
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user?.email}</div>
        </div>

        <nav style={{ flex: 1 }}>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {(isSuper || user?.role === 'owner') && (
            <NavLink to="/establishments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Store size={20} />
              <span>Estabelecimentos</span>
            </NavLink>
          )}

          {(isSuper || user?.role === 'owner') && (
            <NavLink to="/staff" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span>Equipe</span>
            </NavLink>
          )}

          <NavLink to="/finance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <DollarSign size={20} />
            <span>Financeiro</span>
          </NavLink>

          <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={20} />
            <span>Estoque</span>
          </NavLink>

          {(isSuper || user?.role === 'owner') && (
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

          <Route path="/" element={<Landing />} />
          
          <Route path="/dashboard" element={
            <RequireEstablishment>
              <Layout><Dashboard /></Layout>
            </RequireEstablishment>
          } />

          <Route path="/establishments" element={
            <RequireAuth>
              <Layout><Establishments /></Layout>
            </RequireAuth>
          } />

          <Route path="/staff" element={
            <RequireEstablishment>
              <Layout><Staff /></Layout>
            </RequireEstablishment>
          } />

          <Route path="/finance" element={
            <RequireEstablishment>
              <Layout><Finance /></Layout>
            </RequireEstablishment>
          } />

          <Route path="/inventory" element={
            <RequireEstablishment>
              <Layout><Inventory /></Layout>
            </RequireEstablishment>
          } />

          <Route path="/settings" element={
            <RequireEstablishment>
              <Layout><Settings /></Layout>
            </RequireEstablishment>
          } />

          {/* Catch all - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
