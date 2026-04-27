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
    const { user, currentEstablishment, establishments, selectEstablishment } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        staffCount: 0,
        inventoryCount: 0,
        revenueToday: 0,
        activeOrders: 0
    });

    useEffect(() => {
        loadStats();
    }, [currentEstablishment, establishments]);

    const loadStats = async () => {
        setLoading(true);
        try {
            if (currentEstablishment) {
                // LOCAL VIEW
                const [staff, inventory] = await Promise.all([
                    api.getStaff(currentEstablishment.id),
                    api.getInventory(currentEstablishment.id)
                ]);
                setStats({
                    staffCount: staff?.length || 0,
                    inventoryCount: inventory?.length || 0,
                    revenueToday: 0,
                    activeOrders: 0
                });
            } else {
                // GLOBAL VIEW
                const results = await Promise.all(establishments.map(async (est) => {
                    const [staff, inventory] = await Promise.all([
                        api.getStaff(est.id),
                        api.getInventory(est.id)
                    ]);
                    return { staffCount: staff?.length || 0, inventoryCount: inventory?.length || 0 };
                }));

                const totals = results.reduce((acc, curr) => ({
                    staffCount: acc.staffCount + curr.staffCount,
                    inventoryCount: acc.inventoryCount + curr.inventoryCount,
                    revenueToday: 0,
                    activeOrders: 0
                }), { staffCount: 0, inventoryCount: 0, revenueToday: 0, activeOrders: 0 });

                setStats(totals);
            }
        } catch (e) {
            console.error('Error loading dashboard stats:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading && stats.staffCount === 0) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Carregando dados da rede...</div>;

    // --- GLOBAL VIEW (ALL UNITS) ---
    if (!currentEstablishment) {
        return (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <div className="header" style={{ 
                    marginBottom: '3rem', padding: '2.5rem', borderRadius: '24px', 
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                    color: 'white', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.3)'
                }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.5rem', color: 'white' }}>
                            Visão Geral <span style={{ opacity: 0.6, fontWeight: '400' }}>da Rede</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>Sincronização em tempo real de {establishments.length} unidades ativas.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem', marginTop: '-4.5rem', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
                    <StatCard title="Receita Consolidada" value="R$ 0,00" subtext="Faturamento total hoje" icon={DollarSign} color="#6366f1" secondaryColor="rgba(99, 102, 241, 0.1)" trend={0} />
                    <StatCard title="Equipe da Rede" value={stats.staffCount} subtext="Colaboradores totais" icon={Users} color="#10b981" secondaryColor="rgba(16, 185, 129, 0.1)" />
                    <StatCard title="Estoque Global" value={stats.inventoryCount} subtext="Itens monitorados" icon={Package} color="#f59e0b" secondaryColor="rgba(245, 158, 11, 0.1)" />
                </div>

                <div style={{ padding: '0 1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b' }}>
                        <div style={{ width: '4px', height: '24px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
                        Unidades Operacionais
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
                        {establishments.map(est => (
                            <div 
                                key={est.id} 
                                onClick={() => selectEstablishment(est.id)}
                                className="card" 
                                style={{ 
                                    padding: '1.25rem', cursor: 'pointer', transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)', 
                                    border: '1px solid var(--border)', borderRadius: '20px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)';
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                                    <div style={{ 
                                        width: '55px', height: '66px', borderRadius: '12px', background: 'var(--bg-secondary)', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                        flexShrink: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                                    }}>
                                        {est.logo_url ? <img src={est.logo_url} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} /> : <Store size={22} color="var(--primary)" />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1e293b', marginBottom: '4px' }}>{est.name}</h3>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '700', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>{est.type || 'Alimentação'}</span>
                                            {est.state && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>• {est.city}{est.city && est.state ? ', ' : ''}{est.state}</span>
                                            )}
                                        </div>
                                        {est.address && (
                                            <p style={{ 
                                                fontSize: '0.75rem', color: 'var(--text-secondary)', 
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                maxWidth: '240px', opacity: 0.8
                                            }}>
                                                📍 {est.address}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', transition: '0.2s' }}>
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- LOCAL VIEW (SELECTED UNIT) ---
    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <div className="header" style={{ 
                marginBottom: '3rem', padding: '2.5rem', borderRadius: '24px', 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: 'white', position: 'relative', overflow: 'hidden',
                boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px #10b981' }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#10b981', letterSpacing: '1.5px' }}>UNIDADE ATIVA</span>
                    </div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.5rem', color: 'white' }}>
                        Dashboard <span style={{ opacity: 0.6, fontWeight: '400' }}>{currentEstablishment.name}</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} • <span style={{ fontWeight: '600' }}>{currentEstablishment.city || 'Operação Local'}</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
                    <button onClick={() => selectEstablishment(null)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1.5rem', borderRadius: '14px', fontWeight: '700', color: 'white', cursor: 'pointer', transition: '0.2s', backdropFilter: 'blur(10px)' }}>Rede Global</button>
                    <button style={{ background: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '14px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', transition: '0.2s', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>Nova Venda</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem', marginTop: '-4.5rem', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
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
                    subtext="Sendo preparados agora" 
                    icon={Zap} 
                    color="#f59e0b" 
                    secondaryColor="rgba(245, 158, 11, 0.15)"
                />
                <StatCard 
                    title="Equipe Local" 
                    value={stats.staffCount} 
                    subtext="Colaboradores em turno" 
                    icon={Users} 
                    color="#10b981" 
                    secondaryColor="rgba(16, 185, 129, 0.15)"
                />
                <StatCard 
                    title="Estoque" 
                    value={stats.inventoryCount} 
                    subtext="Itens disponíveis" 
                    icon={Package} 
                    color="#8b5cf6" 
                    secondaryColor="rgba(139, 92, 246, 0.15)"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontWeight: '700', fontSize: '1.25rem' }}>Fluxo de Vendas</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Progresso financeiro das últimas horas</p>
                        </div>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontWeight: '700', fontSize: '1.1rem' }}>Alertas Notáveis</h3>
                            <AlertCircle size={18} color="#ef4444" />
                        </div>
                        <div style={{ padding: '2rem 1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px dashed var(--border)', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Nenhum alerta crítico no momento.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
