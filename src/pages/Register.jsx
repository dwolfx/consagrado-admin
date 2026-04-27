import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (error) {
            alert('Erro ao criar conta: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient background glow */}
            <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

            <div style={{ 
                width: '100%', maxWidth: '460px', background: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(20px)', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative', zIndex: 1
            }}>
                <style>{`
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; }
                `}</style>
                
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ 
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                        color: 'white', width: '64px', height: '64px', borderRadius: '20px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        margin: '0 auto 1.5rem', boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.5)'
                    }}>
                        <UserPlus size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>Parceria Consagrado</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', fontWeight: '500' }}>Inicie sua jornada digital hoje mesmo.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Nome Completo</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input
                                type="text"
                                required
                                placeholder="Seu nome"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ 
                                    width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '16px', 
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                                    color: 'white', fontSize: '1rem', outline: 'none', transition: '0.3s'
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Profissional</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input
                                type="email"
                                required
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ 
                                    width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '16px', 
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                                    color: 'white', fontSize: '1rem', outline: 'none', transition: '0.3s'
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '800', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Senha Segura</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                style={{ 
                                    width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '16px', 
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                                    color: 'white', fontSize: '1rem', outline: 'none', transition: '0.3s'
                                }}
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{ 
                            background: 'white', color: '#0f172a', border: 'none', padding: '1.1rem', 
                            borderRadius: '16px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            marginTop: '1rem', boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.3)', transition: '0.3s'
                        }}
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : <>Criar Minha Rede <ArrowRight size={20} /></>}
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '0.95rem', marginTop: '1.5rem', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
                        Já possui acesso? <Link to="/login" style={{ color: '#c7d2fe', textDecoration: 'none', fontWeight: '700' }}>Entrar no painel</Link>
                    </div>
                </form>
            </div>
            
            <div style={{ position: 'fixed', bottom: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px' }}>
                AO SE CADASTRAR VOCÊ CONCORDA COM OS TERMOS DE USO.
            </div>
        </div>
    );
};

export default Register;
