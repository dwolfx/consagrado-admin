import { globalStats, revenueHistory, establishments } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Store, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const isSuper = user?.role === 'super';

    // Mock Owner Data
    const myStats = {
        revenue: 45200.00,
        activeTables: 12,
        calls: 3
    };

    return (
        <div>
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        {isSuper ? 'Visão Global (Super Admin)' : `Olá, ${user.name}`}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isSuper ? 'Monitoramento completo da plataforma.' : 'Resumo do seu estabelecimento.'}
                    </p>
                </div>
                <button className="btn">
                    <TrendingUp size={18} /> {isSuper ? 'Relatório Geral' : 'Meu Faturamento'}
                </button>
            </div>

            {/* KPI Cards Logic */}
            <div className="stat-grid">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {isSuper ? 'Receita Total (Plataforma)' : 'Sua Receita (Mês)'}
                            </p>
                            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>
                                {isSuper
                                    ? globalStats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                    : myStats.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                }
                            </h2>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '8px', color: 'var(--primary)' }}>
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {isSuper ? 'Estabelecimentos Ativos' : 'Mesas Ocupadas Agora'}
                            </p>
                            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>
                                {isSuper ? globalStats.activeEstablishments : myStats.activeTables}
                            </h2>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '8px', color: 'var(--success)' }}>
                            <Store size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {isSuper ? 'Total de Usuários' : 'Chamados de Garçom'}
                            </p>
                            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>
                                {isSuper ? globalStats.totalUsers : myStats.calls}
                            </h2>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#fefce8', borderRadius: '8px', color: 'var(--warning)' }}>
                            {isSuper ? <Users size={24} /> : <AlertCircle size={24} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {isSuper && (
                <div className="card" style={{ height: '400px' }}>
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
            )}

            {!isSuper && (
                <div className="card">
                    <h3>Meus Bares</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Você gerencia 1 estabelecimento.</p>
                    {establishments.slice(0, 1).map(est => (
                        <div key={est.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{est.name}</strong>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Plano {est.plan} • {est.status}</div>
                            </div>
                            <button className="btn">Gerenciar</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
