import { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, Star, Clock, AlertCircle, Briefcase, Zap, Search, MoreVertical, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Staff = () => {
    const { user, currentEstablishment, establishments } = useAuth();
    const [activeTab, setActiveTab] = useState('fixed'); // 'fixed' or 'freela'
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStaff();
    }, [currentEstablishment, establishments]);

    const loadStaff = async () => {
        setLoading(true);
        try {
            if (currentEstablishment) {
                const data = await api.getStaff(currentEstablishment.id);
                setStaff(data || []);
            } else {
                // GLOBAL: Sum up staff from all units
                const allStaffPromises = establishments.map(est => api.getStaff(est.id));
                const allStaffArrays = await Promise.all(allStaffPromises);
                
                // Add establishment name to each member
                const combined = allStaffArrays.flatMap((arr, idx) => 
                    arr.map(member => ({ ...member, establishment_name: establishments[idx].name }))
                );
                setStaff(combined);
            }
        } catch (e) {
            console.error('Error loading staff:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsApp = (phone, name) => {
        const estName = currentEstablishment?.name || 'nossas unidades';
        const msg = `Olá ${name}, tudo bem? Aqui é do ${estName}. Gostaria de verificar sua disponibilidade para um extra conosco!`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // MOCK FREELANCERS
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

            <div className="header" style={{ 
                marginBottom: '3rem', padding: '2.5rem', borderRadius: '24px', 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: 'white', position: 'relative', overflow: 'hidden',
                boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.5rem', color: 'white' }}>
                        Equipe <span style={{ opacity: 0.6, fontWeight: '400' }}>{currentEstablishment ? `• ${currentEstablishment.name}` : '(Rede)'}</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>
                        {currentEstablishment ? `Gerencie o time da unidade ${currentEstablishment.name}.` : 'Visão administrativa de todos os colaboradores da sua rede.'}
                    </p>
                </div>
                <button className="btn" style={{ background: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '14px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', transition: '0.2s', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', gap: '8px', position: 'relative', zIndex: 1 }}>
                    <UserPlus size={20} /> Adicionar Colaborador
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', marginTop: '-1.5rem', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', gap: '1rem', padding: '6px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '18px', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', width: 'fit-content' }}>
                    <button
                        onClick={() => setActiveTab('fixed')}
                        className="tab-btn"
                        style={{
                            padding: '0.75rem 1.5rem', border: 'none',
                            backgroundColor: activeTab === 'fixed' ? '#1e293b' : 'transparent',
                            color: activeTab === 'fixed' ? 'white' : 'var(--text-secondary)',
                            fontWeight: '700', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                            transition: '0.2s', boxShadow: activeTab === 'fixed' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                        }}
                    >
                        <Users size={18} /> Equipe Fixa
                    </button>
                    <button
                        onClick={() => setActiveTab('freela')}
                        className="tab-btn"
                        style={{
                            padding: '0.75rem 1.5rem', border: 'none',
                            backgroundColor: activeTab === 'freela' ? '#1e293b' : 'transparent',
                            color: activeTab === 'freela' ? 'white' : 'var(--text-secondary)',
                            fontWeight: '700', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                            transition: '0.2s', boxShadow: activeTab === 'freela' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                        }}
                    >
                        <Zap size={18} /> Banco de Freelancers
                    </button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {activeTab === 'fixed' ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                                <div style={{ padding: '0.875rem', borderRadius: '16px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}><ShieldCheck size={28} /></div>
                                <div>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b' }}>{staff.length}</h3>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Efetivos Ativos</div>
                                </div>
                            </div>
                            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                                <div style={{ padding: '0.875rem', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Zap size={28} /></div>
                                <div>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b' }}>{staff.filter(s => s.status === 'online').length}</h3>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Em Turno Agora</div>
                                </div>
                            </div>
                        </div>

                        {staff.length === 0 ? (
                            <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', border: '2px dashed var(--border)', background: 'transparent', borderRadius: '24px' }}>
                                <Users size={48} color="var(--text-tertiary)" style={{ marginBottom: '1.25rem' }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>Sua equipe ainda está vazia</h3>
                                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem', fontWeight: '500' }}>Comece cadastrando seus primeiros funcionários para organizar escalas e permissões.</p>
                                <button className="btn" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: '#1e293b', color: 'white', fontWeight: '700' }}>Cadastrar Primeiro Colaborador</button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem', padding: '0 1.5rem' }}>
                                {staff.map(member => (
                                    <div key={member.id} className="card staff-card" style={{ 
                                        padding: '1.75rem', borderRadius: '24px', border: '1px solid var(--border)', 
                                        transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer', position: 'relative', 
                                        overflow: 'hidden', background: 'white',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                                    }}>
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: member.status === 'online' ? 'radial-gradient(circle at top right, rgba(16,185,129,0.08), transparent)' : 'none' }}></div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: '900', color: '#1e293b', border: '1px solid var(--border)' }}>
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>{member.name}</h3>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: '700', textTransform: 'uppercase' }}>{member.role || 'Colaborador'}</span>
                                                        {!currentEstablishment && member.establishment_name && (
                                                            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800' }}>• {member.establishment_name}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: '800', color: member.status === 'online' ? '#10b981' : 'var(--text-tertiary)', backgroundColor: member.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : '#f1f5f9', padding: '6px 12px', borderRadius: '99px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: member.status === 'online' ? '#10b981' : 'var(--text-tertiary)' }}></div>
                                                {member.status?.toUpperCase() || 'OFFLINE'}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.85rem' }}>
                                                <Mail size={16} color="#94a3b8" />
                                                <span>{member.email || 'sem e-mail'}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.85rem' }}>
                                                <Clock size={16} color="#94a3b8" />
                                                <span>{member.shift || 'Não definido'}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button className="btn" style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', background: 'white', border: '1px solid var(--border)', fontWeight: '700', color: '#1e293b' }}>Perfil</button>
                                            <button className="btn" style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', background: 'white', border: '1px solid var(--border)', fontWeight: '700', color: '#1e293b' }}>Escala</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ padding: '0 1.5rem' }}>
                        <div style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)', borderRadius: '24px', marginBottom: '2.5rem', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, boxShadow: '0 8px 16px rgba(15, 23, 42, 0.2)' }}>
                                <Zap size={32} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.25rem' }}>Reforço Instantâneo</h3>
                                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6' }}>
                                    Conecte-se com profissionais validados que já conhecem o seu negócio. {currentEstablishment ? 'Prontos para atuar na unidade ' + currentEstablishment.name : 'Disponíveis para toda a sua rede.'}
                                </p>
                            </div>
                            <button className="btn" style={{ background: '#1e293b', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '14px', fontWeight: '700', fontSize: '0.9rem' }}>Ver Marketplace</button>
                        </div>

                        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ position: 'relative', width: '350px' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input type="text" placeholder="Buscar no banco de talentos..." style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '14px', color: '#1e293b', fontSize: '0.9rem', outline: 'none', transition: '0.2s' }} />
                                </div>
                                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Filtros Avançados</div>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc' }}>
                                            <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Profissional</th>
                                            <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Especialidade</th>
                                            <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Habilidades</th>
                                            <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Reputação</th>
                                            <th style={{ padding: '1.25rem 2rem' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {freelancers.map(freela => (
                                            <tr key={freela.id} style={{ borderBottom: '1px solid var(--border)', transition: '0.2s' }}>
                                                <td style={{ padding: '1.25rem 2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--primary)', border: '1px solid var(--border)' }}>{freela.name.charAt(0)}</div>
                                                        <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>{freela.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem 2rem' }}>
                                                    <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>{freela.role}</span>
                                                </td>
                                                <td style={{ padding: '1.25rem 2rem' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        {freela.skills.map(skill => (
                                                            <span key={skill} style={{ fontSize: '0.7rem', padding: '4px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px', color: '#64748b', fontWeight: '700', border: '1px solid var(--border)' }}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem 2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                                        <span style={{ fontWeight: '900', fontSize: '1rem', color: '#1e293b' }}>{freela.rating}</span>
                                                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500' }}>({freela.jobs} jobs)</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => handleWhatsApp(freela.phone, freela.name)}
                                                        className="btn"
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                            padding: '0.75rem 1.5rem', backgroundColor: '#25D366', color: 'white',
                                                            border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800', fontSize: '0.85rem', boxShadow: '0 10px 15px -3px rgba(37, 211, 102, 0.2)', transition: '0.2s'
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default Staff;
