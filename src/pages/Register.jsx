import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData);
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-body)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: '#0f172a', color: 'white', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <UserPlus size={28} />
                    </div>
                    <h2>Seja um Parceiro</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Cadastre-se para gerenciar seu estabelecimento.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Nome Completo</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Profissional</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Senha</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <button type="submit" className="btn" style={{ justifyContent: 'center', marginTop: '0.5rem', backgroundColor: '#0f172a' }}>Criar Conta</button>

                    <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1rem' }}>
                        Já tem conta? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Fazer Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
