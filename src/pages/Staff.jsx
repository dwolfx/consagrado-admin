import { useState } from 'react';
import { staffMembers, freelancers } from '../data/mockData';
import { Users, UserPlus, Phone, Star, Clock, AlertCircle, Briefcase, Zap } from 'lucide-react';

const Staff = () => {
    const [activeTab, setActiveTab] = useState('fixed'); // 'fixed' or 'freela'

    const handleWhatsApp = (phone, name) => {
        const msg = `Olá ${name}, tem disponibilidade para um extra hoje no Bar do Zé?`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div>
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Gestão de Equipe</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Gerencie seus funcionários fixos e encontre talentos extras.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Feature: Adicionar Novo Funcionário')}>
                    <UserPlus size={18} style={{ marginRight: '8px' }} /> Novo Colaborador
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                <button
                    onClick={() => setActiveTab('fixed')}
                    style={{
                        padding: '1rem', background: 'none', border: 'none',
                        borderBottom: activeTab === 'fixed' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'fixed' ? 'var(--primary)' : '#64748b',
                        fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <Users size={18} /> Equipe Fixa
                </button>
                <button
                    onClick={() => setActiveTab('freela')}
                    style={{
                        padding: '1rem', background: 'none', border: 'none',
                        borderBottom: activeTab === 'freela' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'freela' ? 'var(--primary)' : '#64748b',
                        fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <Zap size={18} /> Banco de Freelancers
                </button>
            </div>

            {/* FIXED STAFF CONTENT */}
            {activeTab === 'fixed' && (
                <div>
                    <div className="stat-grid" style={{ marginBottom: '2rem' }}>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: '#eff6ff', color: 'var(--primary)' }}><Users /></div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem' }}>{staffMembers.length}</h3>
                                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Colaboradores</div>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: '#dcfce7', color: 'var(--success)' }}><Briefcase /></div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem' }}>{staffMembers.filter(s => s.status === 'online').length}</h3>
                                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Trabalhando Agora</div>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: '#fefce8', color: 'var(--warning)' }}><AlertCircle /></div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem' }}>1</h3>
                                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Atrasos Hoje</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {staffMembers.map(member => (
                            <div key={member.id} className="card" style={{ borderLeft: member.status === 'online' ? '4px solid var(--success)' : '4px solid #cbd5e1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{member.name}</h3>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>{member.role}</span>
                                    </div>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold',
                                        backgroundColor: member.status === 'online' ? '#dcfce7' : '#f1f5f9',
                                        color: member.status === 'online' ? '#166534' : '#64748b'
                                    }}>
                                        {member.status === 'online' ? 'ONLINE' : 'OFFLINE'}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <Clock size={16} />
                                    <span>Turno: {member.shift}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                    <Phone size={16} />
                                    <span>{member.phone}</span>
                                </div>

                                {member.status === 'offline' && member.name === 'Carlos Souza' && (
                                    <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '4px', fontSize: '0.85rem' }}>
                                        ⚠️ Deveria ter entrado às 19:00
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FREELANCER CONTENT */}
            {activeTab === 'freela' && (
                <div>
                    <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #bfdbfe' }}>
                        <h3 style={{ color: '#1e40af', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={20} /> Precisa de reforço urgente?
                        </h3>
                        <p style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>
                            Estes profissionais já trabalharam na casa ou foram validados pela plataforma. Chame com 1 clique.
                        </p>
                    </div>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.9rem' }}>Nome</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.9rem' }}>Função</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.9rem' }}>Habilidades</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontSize: '0.9rem' }}>Avaliação</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontSize: '0.9rem' }}>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {freelancers.map(freela => (
                                    <tr key={freela.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{freela.name}</td>
                                        <td style={{ padding: '1rem' }}>{freela.role}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {freela.skills.map(skill => (
                                                    <span key={skill} style={{ fontSize: '0.75rem', padding: '2px 6px', backgroundColor: '#f1f5f9', borderRadius: '4px', color: '#475569' }}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Star size={14} fill="#eab308" color="#eab308" />
                                                <span style={{ fontWeight: 'bold' }}>{freela.rating}</span>
                                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({freela.jobs} jobs)</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleWhatsApp(freela.phone, freela.name)}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    padding: '0.5rem 1rem', backgroundColor: '#25D366', color: 'white',
                                                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
                                                }}
                                            >
                                                <Phone size={16} /> Chamar
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
    );
};

export default Staff;
