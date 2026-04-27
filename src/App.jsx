import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Settings as SettingsIcon, LogOut, Users, DollarSign, Package, Menu, X } from 'lucide-react';
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
  const { logout, user, establishments, currentEstablishment, selectEstablishment } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isSuper = user?.role === 'super';

  return (
    <div className="admin-layout">
      {/* Mobile Header Hamburger */}
      <div className="mobile-header">
        <img src={logoUrl} alt="Consagrado Logo" style={{ height: '28px' }} />
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <img src={logoUrl} alt="Consagrado Logo" style={{ height: '36px', filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' }} />
            {/* Close Button on Mobile Sidebar */}
            <button className="mobile-menu-btn hide-desktop-btn" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          {/* Establishment Switcher */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seletor de Unidade</label>
            <select 
              value={currentEstablishment?.id || 'all'} 
              onChange={(e) => selectEstablishment(e.target.value === 'all' ? null : e.target.value)}
              style={{ 
                width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--border)', borderRadius: '12px', color: 'white', 
                fontSize: '0.85rem', outline: 'none', cursor: 'pointer', fontWeight: '600'
              }}
            >
              <option value="all" style={{ background: '#0f172a' }}>🌐 Visão Global (Rede)</option>
              {establishments.map(est => (
                <option key={est.id} value={est.id} style={{ background: '#0f172a' }}>
                  🏢 {est.name} {(est.city || est.state) ? `(${est.city}${est.city && est.state ? ', ' : ''}${est.state})` : ''}
                </option>
              ))}
            </select>
          </div>
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
