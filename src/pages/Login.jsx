import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock Logic: If email contains 'admin', treat as Super Admin, else Owner
        if (email.includes('admin')) {
            login('super');
        } else {
            login('owner');
        }
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-body)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <ShieldCheck size={28} />
                    </div>
                    <h2>Admin Panel</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Acesse sua conta para gerenciar.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                        <input
                            type="email"
                            required
                            placeholder="ex: admin@consagrado.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <button type="submit" className="btn" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>Entrar</button>

                    <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1rem' }}>
                        Não tem conta? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Cadastre-se como Dono</Link>
                    </div>

                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                        <strong>Dica para Teste:</strong><br />
                        Use "admin@..." para **Super Admin**.<br />
                        Use qualquer outro para **Owner**.
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
