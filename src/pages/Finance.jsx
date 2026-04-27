import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
    DollarSign, CheckCircle, XCircle, ArrowUpRight,
    CreditCard, Save, Info, AlertCircle, TrendingUp,
    Calendar, Download, PieChart, Wallet, ChevronRight, Zap, ArrowDownRight, TrendingDown
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const Finance = () => {
    const { user, currentEstablishment, establishments } = useAuth();
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
        if (currentEstablishment) {
            loadLocalFinance();
        } else {
            loadGlobalFinance();
        }
    }, [currentEstablishment, establishments]);

    const loadLocalFinance = async () => {
        setLoading(true);
        try {
            const { data } = await api.getEstablishmentById(currentEstablishment.id);
            if (data) {
                setBanking({
                    pixKey: data.pix_key || '',
                    titular: data.name || user.name
                });
            }
        } catch (e) {
            console.error('Error loading banking details:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadGlobalFinance = async () => {
        setLoading(true);
        setStats({
            totalRevenue: 0,
            pendingPayout: 0,
            netProfit: 0
        });
        setBanking({ pixKey: 'Visão Global', titular: 'Selecione uma unidade' });
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentEstablishment) return;
        setLoading(true);
        try {
            await api.updateEstablishment(currentEstablishment.id, { pix_key: banking.pixKey });
            alert('Dados bancários atualizados com sucesso!');
        } catch (e) {
            alert('Erro ao salvar dados.');
        } finally {
            setLoading(false);
        }
    };

    const chartData = [
        { name: 'Seg', value: 3200 },
        { name: 'Ter', value: 4100 },
        { name: 'Qua', value: 2900 },
        { name: 'Qui', value: 5400 },
        { name: 'Sex', value: 8200 },
        { name: 'Sáb', value: 12000 },
        { name: 'Dom', value: 9500 }
    ];

    const transactions = [
        { id: 1, date: '18/03/2026', type: 'Consumo Local', amount: 450.00, status: 'EFETIVADO' },
        { id: 2, date: '17/03/2026', type: 'Takeaway', amount: 125.50, status: 'EFETIVADO' },
        { id: 3, date: '17/03/2026', type: 'Consumo Local', amount: 890.00, status: 'PENDENTE' },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .fin-card:hover { transform: translateY(-5px); border-color: #6366f1 !important; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
                .transaction-row:hover { background-color: #f8fafc; }
            `}</style>

            <div className="header" style={{ 
                marginBottom: '4rem', padding: '3rem', borderRadius: '32px', 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: 'white', position: 'relative', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                            <Wallet size={20} color="#818cf8" />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', color: '#818cf8', textTransform: 'uppercase' }}>Gestão Financeira</span>
                    </div>
                    <h1 style={{ fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'white', lineHeight: '1.1' }}>
                        Fluxo de Caixa {currentEstablishment ? `• ${currentEstablishment.name}` : '(Rede)'}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', lineHeight: '1.6' }}>
                        {currentEstablishment ? `Controle de faturamento, taxas e repasses da unidade ${currentEstablishment.name}.` : 'Dashboard financeiro consolidado de toda a sua operação.'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '700', color: 'white', cursor: 'pointer', display: 'flex', gap: '10px' }}>
                        <Download size={20} /> Exportar
                    </button>
                    <button className="btn" style={{ background: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', transition: '0.3s', boxShadow: '0 15px 25px -5px rgba(0,0,0,0.2)' }}>
                        Solicitar Saque
                    </button>
                </div>
            </div>

            {/* OVERLAY STAT CARDS */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '-5.5rem', marginBottom: '3.5rem', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>
                <div className="card fin-card" style={{ flex: 1, padding: '2rem', borderRadius: '28px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.8rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '16px' }}><Wallet size={28} /></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <TrendingUp size={14} /> +12%
                        </span>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saldo Total Bruto</p>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', margin: '0.5rem 0', letterSpacing: '-0.03em' }}>{stats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                        <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden', marginTop: '1rem' }}>
                            <div style={{ width: '65%', height: '100%', background: '#6366f1' }}></div>
                        </div>
                    </div>
                </div>

                <div className="card fin-card" style={{ flex: 1, padding: '2rem', borderRadius: '28px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '16px' }}><Zap size={28} /></div>
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700' }}>Em 48h úteis</span>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Disponível p/ Saque</p>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', margin: '0.5rem 0', letterSpacing: '-0.03em' }}>{stats.pendingPayout.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '1rem' }}>Próximo repasse automático: 21/03</p>
                    </div>
                </div>

                <div className="card fin-card" style={{ flex: 1, padding: '2rem', borderRadius: '28px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.8rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '16px' }}><CheckCircle size={28} /></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b' }}>Taxa média 5.1%</span>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lucro Líquido Est.</p>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', margin: '0.5rem 0', letterSpacing: '-0.03em' }}>{stats.netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500', marginTop: '1rem' }}>Cálculo pós-taxas de gateway</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem', padding: '0 1rem' }}>
                {/* PERFORMANCE CHART */}
                <div className="card" style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border)', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.02em' }}>Performance Financeira</h3>
                            <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>Acompanhamento de receita semestral e diária</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '16px' }}>
                            {['1D', '1W', '1M', '1Y'].map(r => (
                                <button key={r} onClick={() => setTimeRange(r)} style={{ border: 'none', background: timeRange === r ? 'white' : 'transparent', color: timeRange === r ? '#1e293b' : '#64748b', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '800', transition: '0.2s', boxShadow: timeRange === r ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none' }}>{r}</button>
                            ))}
                        </div>
                    </div>
                    <div style={{ height: '350px', marginLeft: '-20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="finGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} tickFormatter={(val) => `R$${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: 'white', padding: '12px 16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#818cf8', fontWeight: '800' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#finGradient)" strokeWidth={4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* BANKING & DETAILS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', borderRadius: '32px', border: '1px solid var(--border)', background: 'white' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1e293b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CreditCard size={24} color="#6366f1" /> Repasses Bancários
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chave PIX Principal</label>
                                <input 
                                    type="text" 
                                    value={banking.pixKey}
                                    onChange={e => setBanking({ ...banking, pixKey: e.target.value })}
                                    placeholder="Ex: 00.000.000/0001-00"
                                    style={{ width: '100%', padding: '1.1rem 1.25rem', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', fontSize: '1rem', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titular / Beneficiário</label>
                                <div style={{ width: '100%', padding: '1.1rem 1.25rem', borderRadius: '16px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#94a3b8', fontWeight: '600', fontSize: '1rem' }}>
                                    {banking.titular}
                                </div>
                            </div>
                            <button onClick={handleSave} disabled={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '1.1rem', borderRadius: '18px', background: '#1e293b', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                                <Save size={20} /> {loading ? 'Sincronizando...' : 'Salvar Configurações'}
                            </button>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem', borderRadius: '32px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)', border: '1px dashed rgba(99, 102, 241, 0.2)' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '900', color: '#6366f1', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Info size={18} /> Resumo de Taxas
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                <span style={{ color: '#64748b', fontWeight: '500' }}>Plataforma Consagrado</span>
                                <span style={{ fontWeight: '800', color: '#1e293b' }}>2.9%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                <span style={{ color: '#64748b', fontWeight: '500' }}>Gateway Transacional</span>
                                <span style={{ fontWeight: '800', color: '#1e293b' }}>R$ 0,95 / transação</span>
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '900' }}>
                                <span style={{ color: '#1e293b' }}>Custo Médio</span>
                                <span style={{ color: '#ef4444' }}>5.1%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div style={{ padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.02em' }}>Movimentações Recentes</h3>
                    <button style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer' }}>Ver Extrato Completo</button>
                </div>
                
                <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '32px', border: '1px solid var(--border)', background: 'white' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1.5rem 2.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Data & Hora</th>
                                <th style={{ padding: '1.5rem 2.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Descrição / Origem</th>
                                <th style={{ padding: '1.5rem 2.5rem', textAlign: 'right', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Valor</th>
                                <th style={{ padding: '1.5rem 2.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Status</th>
                                <th style={{ padding: '1.5rem 2.5rem' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '6rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '24px', backgroundColor: '#f8fafc', marginBottom: '1.5rem' }}>
                                            <Wallet size={48} style={{ opacity: 0.2 }} />
                                        </div>
                                        <p style={{ fontWeight: '600' }}>Nenhuma movimentação para exibir no momento.</p>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(t => (
                                    <tr key={t.id} className="transaction-row" style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s' }}>
                                        <td style={{ padding: '1.5rem 2.5rem', fontSize: '1rem', color: '#64748b', fontWeight: '600' }}>{t.date} <span style={{ fontSize: '0.8rem', fontWeight: '500', marginLeft: '8px' }}>14:30</span></td>
                                        <td style={{ padding: '1.5rem 2.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#f8fafc', color: '#10b981', border: '1px solid #e2e8f0' }}><ArrowUpRight size={18} /></div>
                                                <div>
                                                    <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#1e293b', display: 'block' }}>Venda {t.type}</span>
                                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>ID: TRN-283{t.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2.5rem', textAlign: 'right', fontWeight: '900', color: '#10b981', fontSize: '1.1rem' }}>
                                            + {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td style={{ padding: '1.5rem 2.5rem', textAlign: 'center' }}>
                                            <span style={{ padding: '8px 16px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '900', backgroundColor: t.status === 'EFETIVADO' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: t.status === 'EFETIVADO' ? '#10b981' : '#f59e0b', border: '1px solid transparent' }}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem 2.5rem', textAlign: 'right' }}>
                                            <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#94a3b8', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}><ChevronRight size={20} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Finance;
