import { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, Star, Clock, AlertCircle, Briefcase, Zap, Search, MoreVertical, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Staff = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('fixed'); // 'fixed' or 'freela'
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (user?.establishmentId) {
            loadStaff();
        }
    }, [user]);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const data = await api.getStaff(user.establishmentId);
            setStaff(data || []);
        } catch (e) {
            console.error('Error loading staff:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsApp = (phone, name) => {
        const estName = user?.establishmentName || 'nosso estabelecimento';
        const msg = `Olá ${name}, tudo bem? Aqui é do ${estName}. Gostaria de verificar sua disponibilidade para um extra conosco!`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // MOCK FREELANCERS (until we have a global database of them)
    const freelancers = [
        { id: 1, name: 'Marcos Vinícius', role: 'Garçom', skills: ['Vinhos', 'Vendas'], rating: 4.9, jobs: 12, phone: '5511999999999' },
        { id: 2, name: 'Ana Beatriz', role: 'Bartender', skills: ['Mixologia', 'Agilidade'], rating: 5.0, jobs: 8, phone: '5511888888880' },
        { id: 3, name: 'Roberto Silva', role: 'Segurança', skills: ['Gestão de Conflito'], rating: 4.7, jobs: 25, phone: '5511777777770' }
    ];

    if (loading) return <div style={{ padding: '2rem' }}>Carregando equipe...</div>;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .tab-btn:hover { background-color: rgba(255,255,255,0.03); }
                .staff-card:hover { transform: translateY(-4px); border-color: var(--primary) !important; }
            `}</style>

            <div className="header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Recursos Humanos</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Gerencie talentos fixos e escale sua operação com freelancers qualificados.
                    </p>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '600', display: 'flex', gap: '8px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
                    <UserPlus size={20} /> Adicionar Colaborador
                </button>
            </div>

            {/* Premium Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', padding: '4px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)', width: 'fit-content' }}>
                <button
                    onClick={() => setActiveTab('fixed')}
                    className="tab-btn"
                    style={{
                        padding: '0.75rem 1.5rem', border: 'none',
                        backgroundColor: activeTab === 'fixed' ? 'var(--bg-card)' : 'transparent',
                        color: activeTab === 'fixed' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: '700', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: activeTab === 'fixed' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none', transition: '0.2s', border: activeTab === 'fixed' ? '1px solid var(--border)' : '1px solid transparent'
                    }}
                >
                    <Users size={18} /> Equipe Fixa
                </button>
                <button
                    onClick={() => setActiveTab('freela')}
                    className="tab-btn"
                    style={{
                        padding: '0.75rem 1.5rem', border: 'none',
                        backgroundColor: activeTab === 'freela' ? 'var(--bg-card)' : 'transparent',
                        color: activeTab === 'freela' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: '700', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: activeTab === 'freela' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none', transition: '0.2s', border: activeTab === 'freela' ? '1px solid var(--border)' : '1px solid transparent'
                    }}
                >
                    <Zap size={18} /> Banco de Freelancers
                </button>
            </div>

            {/* CONTENT AREA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {activeTab === 'fixed' ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderRadius: '20px' }}>
                                <div style={{ padding: '0.75rem', borderRadius: '14px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}><ShieldCheck size={28} /></div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{staff.length}</h3>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Efetivos Ativos</div>
                                </div>
                            </div>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderRadius: '20px' }}>
                                <div style={{ padding: '0.75rem', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Zap size={28} /></div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{staff.filter(s => s.status === 'online').length}</h3>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Operando Agora</div>
                                </div>
                            </div>
                        </div>

                        {staff.length === 0 ? (
                            <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', border: '2px dashed var(--border)', background: 'transparent' }}>
                                <Users size={48} color="var(--text-tertiary)" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Sua equipe ainda está vazia</h3>
                                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>Comece cadastrando seus primeiros funcionários para organizar escalas e permissões.</p>
                                <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}>Cadastrar Primeiro Colaborador</button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {staff.map(member => (
                                    <div key={member.id} className="card staff-card" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: member.status === 'online' ? 'radial-gradient(circle at top right, rgba(16,185,129,0.1), transparent)' : 'none' }}></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800', border: '1px solid var(--border)' }}>
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '2px' }}>{member.name}</h3>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{member.role || 'Colaborador'}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: '800', color: member.status === 'online' ? '#10b981' : 'var(--text-tertiary)', backgroundColor: member.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)', padding: '4px 10px', borderRadius: '99px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: member.status === 'online' ? '#10b981' : 'var(--text-tertiary)' }}></div>
                                                {member.status?.toUpperCase() || 'OFFLINE'}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <Mail size={16} color="var(--text-tertiary)" />
                                                <span>{member.email || 'sem e-mail'}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <Clock size={16} color="var(--text-tertiary)" />
                                                <span>Turno: {member.shift || 'Não definido'}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button className="btn" style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', fontSize: '0.85rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontWeight: '600' }}>Perfil</button>
                                            <button className="btn" style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', fontSize: '0.85rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontWeight: '600' }}>Escala</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                        <div style={{ padding: '2rem', backgroundColor: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', marginBottom: '2.5rem', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' }}>
                                <Zap size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Reforço Instantâneo</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    Conecte-se com profissionais validados que já conhecem o seu negócio ou possuem avaliações de excelência na plataforma.
                                </p>
                            </div>
                        </div>

                        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ position: 'relative', width: '300px' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                    <input type="text" placeholder="Buscar no banco de talentos..." style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', fontSize: '0.85rem', outline: 'none' }} />
                                </div>
                                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', fontWeight: '500' }}>Vistos Recentemente</div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-card)' }}>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Profissional</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Especialidade</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Habilidades</th>
                                        <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Reputação</th>
                                        <th style={{ padding: '1.25rem 2rem' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {freelancers.map(freela => (
                                        <tr key={freela.id} style={{ borderBottom: '1px solid var(--border)', transition: '0.2s', ':hover': { backgroundColor: 'var(--bg-secondary)' } }}>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--primary)', border: '1px solid var(--border)' }}>{freela.name.charAt(0)}</div>
                                                    <span style={{ fontWeight: '600', color: 'white' }}>{freela.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{freela.role}</span>
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    {freela.skills.map(skill => (
                                                        <span key={skill} style={{ fontSize: '0.7rem', padding: '3px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                                    <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'white' }}>{freela.rating}</span>
                                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>({freela.jobs} jobs)</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => handleWhatsApp(freela.phone, freela.name)}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                        padding: '0.6rem 1.25rem', backgroundColor: '#25D366', color: 'white',
                                                        border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
                                                    }}
                                                >
                                                    <Phone size={16} /> Contatar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Staff;
