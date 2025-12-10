import { globalStats, revenueHistory, establishments } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Store, Users, TrendingUp, AlertCircle, Utensils, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const isSuper = user?.role === 'super';

    // Mock Real-time Operations Data (Pulse Check)
    const opsStats = {
        revenueToday: 3850.00,
        revenueYesterday: 3200.00,
        activeTables: 14,
        totalTables: 20,
        staffOnline: 5,
        totalStaff: 7,
        topProduct: 'Gin Tônica',
        recentActivity: [
            { id: 1, time: '2 min', msg: 'Mesa 04 pediu Fechamento de Conta', type: 'alert' },
            { id: 2, time: '5 min', msg: 'Mesa 12 fez um pedido (R$ 89,90)', type: 'order' },
            { id: 3, time: '12 min', msg: 'Carlos (Garçom) iniciou o turno', type: 'staff' },
            { id: 4, time: '25 min', msg: 'Mesa 08 pagou R$ 150,00 via Pix', type: 'payment' }
        ]
    };

    const growth = ((opsStats.revenueToday - opsStats.revenueYesterday) / opsStats.revenueYesterday) * 100;

    // --- SUPER ADMIN DASHBOARD ---
    if (isSuper) {
        return (
            <div>
                <div className="header">
                    <div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Visão Global (Super Admin)</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Monitoramento completo da plataforma.</p>
                    </div>
                </div>

                <div className="stat-grid">
                    {/* ... Existing Super Admin Cards ... */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)' }}>Receita Total</p>
                                <h2 style={{ fontSize: '2rem' }}>{globalStats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                            </div>
                            <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '8px', color: 'var(--primary)' }}><DollarSign size={24} /></div>
                        </div>
                    </div>
                    {/* Simplified for brevity in this specific replacement call, essentially keeping the structure logic */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)' }}>Bares Ativos</p>
                                <h2 style={{ fontSize: '2rem' }}>{globalStats.activeEstablishments}</h2>
                            </div>
                            <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '8px', color: 'var(--success)' }}><Store size={24} /></div>
                        </div>
                    </div>
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)' }}>Usuários</p>
                                <h2 style={{ fontSize: '2rem' }}>{globalStats.totalUsers}</h2>
                            </div>
                            <div style={{ padding: '0.75rem', backgroundColor: '#fefce8', borderRadius: '8px', color: 'var(--warning)' }}><Users size={24} /></div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ height: '400px', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '2rem' }}>Crescimento da Plataforma</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueHistory} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `R$${value / 1000}k`} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f1f5f9' }} />
                            <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    // --- OWNER OPERATIONAL DASHBOARD ---
    return (
        <div>
            <div className="header" style={{ marginBottom: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '1.5rem' }}>Visão Operacional</h1>
                        <span style={{
                            backgroundColor: '#fee2e2', color: '#ef4444',
                            fontSize: '0.75rem', fontWeight: 'bold',
                            padding: '2px 8px', borderRadius: '99px',
                            display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                            <span className="pulse" style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                            AO VIVO
                        </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        O que está acontecendo no <strong>Bar do Zé</strong> hoje, {new Date().toLocaleDateString()}.
                    </p>
                </div>
            </div>

            {/* Ops Grid */}
            <div className="stat-grid" style={{ marginBottom: '2rem' }}>
                {/* Card 1: Revenue Today */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Faturamento (Hoje)</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>
                                {opsStats.revenueToday.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </h2>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#ecfdf5', borderRadius: '8px', color: '#059669' }}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <span style={{ color: '#059669', fontWeight: 'bold' }}>+{growth.toFixed(1)}%</span>
                        <span style={{ color: '#64748b' }}>vs. ontem (R$ {opsStats.revenueYesterday.toLocaleString('pt-BR')})</span>
                    </div>
                </div>

                {/* Card 2: Occupancy */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Ocupação Agora</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>
                                {opsStats.activeTables} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: '400' }}>/ {opsStats.totalTables}</span>
                            </h2>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
                            <Store size={24} />
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(opsStats.activeTables / opsStats.totalTables) * 100}%`, height: '100%', backgroundColor: '#2563eb' }}></div>
                    </div>
                </div>

                {/* Card 3: Top Product */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Estrela do Dia 🏆</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', margin: '0.5rem 0' }}>
                                {opsStats.topProduct}
                            </h2>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Mais pedido hoje</p>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#fff7ed', borderRadius: '8px', color: '#c2410c' }}>
                            <Utensils size={24} />
                        </div>
                    </div>
                </div>

                {/* Card 4: Staff */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Equipe Online</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>
                                {opsStats.staffOnline}
                            </h2>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Garçons ativos</p>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#f5f3ff', borderRadius: '8px', color: '#7c3aed' }}>
                            <Users size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={20} color="var(--text-secondary)" /> Atividade Recente
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {opsStats.recentActivity.map(act => (
                        <div key={act.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', minWidth: '60px' }}>{act.time}</span>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {act.type === 'alert' && <AlertCircle size={16} color="var(--danger)" />}
                                {act.type === 'payment' && <CheckCircle size={16} color="var(--success)" />}
                                {act.type === 'order' && <Utensils size={16} color="var(--primary)" />}
                                {act.type === 'staff' && <Users size={16} color="var(--warning)" />}
                                <span style={{ color: '#334155' }}>{act.msg}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
