import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
    DollarSign, CheckCircle, XCircle, ArrowUpRight,
    CreditCard, Save, Info, AlertCircle, TrendingUp,
    Calendar, Download, PieChart, Wallet, ChevronRight, Zap
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const Finance = () => {
    const { user } = useAuth();
    const isSuper = user?.role === 'super';
    
    // States
    const [banking, setBanking] = useState({ pixKey: '', titular: '' });
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('1W');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingPayout: 0,
        netProfit: 0
    });

    useEffect(() => {
        if (user?.establishmentId) {
            // Fetch banking details from establishment
            loadBankingDetails();
        }
    }, [user]);

    const loadBankingDetails = async () => {
        try {
            const { data } = await api.getEstablishmentById(user.establishmentId);
            if (data) {
                setBanking({
                    pixKey: data.pix_key || '',
                    titular: data.name || user.name
                });
            }
        } catch (e) {
            console.error('Error loading banking details:', e);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (user?.establishmentId) {
                await api.updateEstablishment(user.establishmentId, { pix_key: banking.pixKey });
                alert('Dados bancários atualizados com sucesso!');
            }
        } catch (e) {
            alert('Erro ao salvar dados.');
        } finally {
            setLoading(false);
        }
    };

    const chartData = [
        { name: 'Seg', value: 0 },
        { name: 'Ter', value: 0 },
        { name: 'Qua', value: 0 },
        { name: 'Qui', value: 0 },
        { name: 'Sex', value: 0 },
        { name: 'Sáb', value: 0 },
        { name: 'Dom', value: 0 }
    ];

    const transactions = [];

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .fin-card:hover { transform: translateY(-2px); border-color: var(--primary) !important; }
            `}</style>

            <div className="header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Fluxo Financeiro</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Controle de faturamento, taxas e liquidação de repasses.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.6rem 1.25rem', borderRadius: '12px', fontWeight: '600', display: 'flex', gap: '8px' }}>
                        <Download size={18} /> Exportar CSV
                    </button>
                    <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '12px', fontWeight: '700', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
                        Solicitar Saque
                    </button>
                </div>
            </div>

            {/* Top Summaries */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card fin-card" style={{ padding: '1.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle at top right, rgba(99,102,241,0.1), transparent)' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.6rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}><Wallet size={24} /></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '99px' }}>+12% vs. mês ant.</span>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Saldo Total Bruto</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', margin: '0.25rem 0' }}>{stats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Vendas pendentes de liquidação: R$ 0,00</p>
                    </div>
                </div>

                <div className="card fin-card" style={{ padding: '1.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.6rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}><Zap size={24} /></div>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Disponível para Saque</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', margin: '0.25rem 0' }}>{stats.pendingPayout.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Próximo fechamento automático em 2 dias</p>
                    </div>
                </div>

                <div className="card fin-card" style={{ padding: '1.5rem', borderRadius: '24px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.6rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}><CheckCircle size={24} /></div>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Lucro Líquido Estimado</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', margin: '0.25rem 0' }}>{stats.netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Após taxas de plataforma e gateway</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {/* Main Chart */}
                <div className="card" style={{ padding: '2rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Performance Semanal</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Comparação de faturamento diário</p>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px' }}>
                            {['1D', '1W', '1M'].map(r => (
                                <button key={r} onClick={() => setTimeRange(r)} style={{ border: 'none', background: timeRange === r ? 'var(--bg-card)' : 'transparent', color: timeRange === r ? 'var(--primary)' : 'var(--text-tertiary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>{r}</button>
                            ))}
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="finGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="value" stroke="var(--primary)" fillOpacity={1} fill="url(#finGradient)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Banking & Config */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CreditCard size={18} color="var(--primary)" /> Dados de Repasse
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '6px', textTransform: 'uppercase' }}>Chave PIX</label>
                                <input 
                                    type="text" 
                                    value={banking.pixKey}
                                    onChange={e => setBanking({ ...banking, pixKey: e.target.value })}
                                    placeholder="CNPJ ou E-mail"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '6px', textTransform: 'uppercase' }}>Beneficiário</label>
                                <input 
                                    type="text" 
                                    value={banking.titular}
                                    readOnly
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-tertiary)', outline: 'none' }}
                                />
                            </div>
                            <button onClick={handleSave} disabled={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
                                <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(99, 102, 241, 0.03)', border: '1px dashed rgba(99, 102, 241, 0.2)' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Info size={16} /> Taxas Transparentes
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Plataforma</span>
                                <span style={{ fontWeight: '700' }}>2.9%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Gateway PIX</span>
                                <span style={{ fontWeight: '700' }}>R$ 0,95</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '800' }}>
                                <span>Total Médio</span>
                                <span style={{ color: '#ef4444' }}>~5.1%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Movimentações Recentes</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Data</th>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Categoria</th>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'right', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Valor</th>
                            <th style={{ padding: '1.25rem 2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '1.25rem 2rem' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                    <p>Nenhuma movimentação financeira registrada.</p>
                                </td>
                            </tr>
                        ) : (
                            transactions.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: '0.2s' }}>
                                    <td style={{ padding: '1.25rem 2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.date}</td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--primary)' }}><ArrowUpRight size={14} /></div>
                                            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Venda {t.type}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: '800', color: '#10b981' }}>+ {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td style={{ padding: '1.25rem 2rem', textAlign: 'center' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '800', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>EFETIVADO</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><ChevronRight size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Finance;
