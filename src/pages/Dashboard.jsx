import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, Store, Users, TrendingUp, AlertCircle, Utensils, Clock, CheckCircle, Package, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const StatCard = ({ title, value, subtext, icon: Icon, trend, color, secondaryColor }) => (
    <div className="card" style={{ 
        position: 'relative', overflow: 'hidden', padding: '1.5rem', 
        display: 'flex', flexDirection: 'column', gap: '0.5rem', 
        border: '1px solid var(--border)', borderRadius: '20px', 
        background: 'var(--bg-card)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
    }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `radial-gradient(circle at top right, ${color}15, transparent)`, pointerEvents: 'none' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ padding: '0.75rem', backgroundColor: secondaryColor, borderRadius: '12px', color: color }}>
                <Icon size={24} />
            </div>
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: trend > 0 ? '#10b981' : '#ef4444', backgroundColor: trend > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '700' }}>
                    <TrendingUp size={14} style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div style={{ marginTop: '0.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>{title}</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.25rem 0' }}>{value}</h2>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{subtext}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const isSuper = user?.role === 'super';
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        staffCount: 0,
        inventoryCount: 0,
        revenueToday: 0,
        activeOrders: 0
    });

    useEffect(() => {
        if (user?.establishmentId) {
            loadStats();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadStats = async () => {
        try {
            const [staff, inventory] = await Promise.all([
                api.getStaff(user.establishmentId),
                api.getInventory(user.establishmentId)
            ]);
            setStats({
                staffCount: staff?.length || 0,
                inventoryCount: inventory?.length || 0,
                revenueToday: 0,
                activeOrders: 0
            });
        } catch (e) {
            console.error('Error loading dashboard stats:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Carregando painel...</div>;

    // --- SUPER ADMIN DASHBOARD ---
    if (isSuper) {
        return (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div className="header" style={{ marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>Visão Global (Super)</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Status em tempo real de toda a sua rede.</p>
                    </div>
                </div>

                <div className="stat-grid" style={{ marginBottom: '2rem' }}>
                    <StatCard title="Receita Global" value="R$ 0,00" subtext="Total transacionado hoje" icon={DollarSign} color="#6366f1" secondaryColor="rgba(99, 102, 241, 0.1)" trend={0} />
                    <StatCard title="Parceiros Ativos" value="-" subtext="Estabelecimentos na rede" icon={Store} color="#10b981" secondaryColor="rgba(16, 185, 129, 0.1)" />
                    <StatCard title="Usuários Totais" value="-" subtext="Contas registradas" icon={Users} color="#f59e0b" secondaryColor="rgba(245, 158, 11, 0.1)" />
                </div>
                
                <div className="card" style={{ padding: '2rem', height: '450px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Fluxo de Crescimento</h3>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[]}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }} />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }

    // --- OWNER OPERATIONAL DASHBOARD ---
    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            
            <div className="header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px #10b981' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', letterSpacing: '1px' }}>AO VIVO</span>
                    </div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        Dashboard <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>{user?.establishmentName || 'da Unidade'}</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} • <span style={{ fontWeight: '600', color: 'var(--text-tertiary)' }}>Sistema Online</span></p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: '600' }}>Relatórios</button>
                    <button className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: '600' }}>Nova Venda</button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <StatCard 
                    title="Receita (Hoje)" 
                    value={stats.revenueToday.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                    subtext="Faturamento diário real" 
                    icon={DollarSign} 
                    color="#6366f1" 
                    secondaryColor="rgba(99, 102, 241, 0.15)"
                    trend={0}
                />
                <StatCard 
                    title="Pedidos Ativos" 
                    value={stats.activeOrders} 
                    subtext="Sendo preparados na cozinha" 
                    icon={Zap} 
                    color="#f59e0b" 
                    secondaryColor="rgba(245, 158, 11, 0.15)"
                />
                <StatCard 
                    title="Equipe" 
                    value={stats.staffCount} 
                    subtext="Colaboradores cadastrados" 
                    icon={Users} 
                    color="#10b981" 
                    secondaryColor="rgba(16, 185, 129, 0.15)"
                />
                <StatCard 
                    title="Estoque" 
                    value={stats.inventoryCount} 
                    subtext="Itens no inventário" 
                    icon={Package} 
                    color="#8b5cf6" 
                    secondaryColor="rgba(139, 92, 246, 0.15)"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Visual Chart */}
                <div className="card" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontWeight: '700', fontSize: '1.25rem' }}>Fluxo de Vendas</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Progresso financeiro das últimas horas</p>
                        </div>
                        <select style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                            <option>Hoje</option>
                            <option>Semana</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Panel: Recent Alerts / Activity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontWeight: '700', fontSize: '1.1rem' }}>Alertas Notáveis</h3>
                            <AlertCircle size={18} color="#ef4444" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ padding: '2rem 1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px dashed var(--border)', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Nenhum alerta crítico no momento.</p>
                            </div>
                        </div>
                        <button style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: 'none', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            Ver Todos <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', flex: 1, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                            <Zap size={18} color="#f59e0b" />
                            <h3 style={{ fontWeight: '700', fontSize: '1.1rem' }}>Performance</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tempo Prep. Médio</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>-- min</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                                <div style={{ width: '0%', height: '100%', background: '#6366f1', borderRadius: '2px' }}></div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Avaliação Média</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>-- ★</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                                <div style={{ width: '0%', height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
