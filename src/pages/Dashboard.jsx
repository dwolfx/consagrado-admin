import { globalStats, revenueHistory } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Store, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    return (
        <div>
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Visão Geral</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Bem-vindo ao God Mode do Consagrado.</p>
                </div>
                <button className="btn">
                    <TrendingUp size={18} /> Baixar Relatório
                </button>
            </div>

            {/* KPI Cards */}
            <div className="stat-grid">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Receita Total (Mensal)</p>
                            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>
                                {globalStats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </h2>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '8px', color: 'var(--primary)' }}>
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--success)' }}>+12% vs mês passado</p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Estabelecimentos Ativos</p>
                            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{globalStats.activeEstablishments}</h2>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '8px', color: 'var(--success)' }}>
                            <Store size={24} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Usuários Cadastrados</p>
                            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{globalStats.totalUsers}</h2>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#fefce8', borderRadius: '8px', color: 'var(--warning)' }}>
                            <Users size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="card" style={{ height: '400px' }}>
                <h3 style={{ marginBottom: '2rem' }}>Evolução de Faturamento</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={revenueHistory}
                        margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `R$${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f1f5f9' }}
                        />
                        <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
