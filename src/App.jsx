import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Settings, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Establishments from './pages/Establishments';

function App() {
  return (
    <Router>
      <div className="admin-layout">
        <aside className="sidebar">
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'white' }}>
              Admin<span style={{ color: 'var(--primary)' }}>Panel</span>
            </h2>
          </div>

          <nav style={{ flex: 1 }}>
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/establishments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Store size={20} />
              <span>Estabelecimentos</span>
            </NavLink>
            <div className="nav-item" style={{ marginTop: '2rem', opacity: 0.5, cursor: 'not-allowed' }}>
              <Settings size={20} />
              <span>Configurações</span>
            </div>
          </nav>

          <button className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'flex-start', paddingLeft: '0' }}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/establishments" element={<Establishments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
