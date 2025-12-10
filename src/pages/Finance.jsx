import { useState, useEffect } from 'react';
import { payoutRequests } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
    DollarSign, CheckCircle, XCircle, ArrowUpRight,
    CreditCard, Save, Info, AlertCircle, TrendingUp
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

const Finance = () => {
    const { user } = useAuth();
    const isSuper = user?.role === 'super';
    const [payouts, setPayouts] = useState(payoutRequests);

    // Banking State
    const [banking, setBanking] = useState({ pixKey: '00.000.000/0001-00', titular: 'Seu Bar LTDA' });
    const [loading, setLoading] = useState(false);

    // Chart State
    const [timeRange, setTimeRange] = useState('1W');

    // Mock Data Generator for Chart
    const getChartData = (range) => {
        const base = 1000;
        const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        switch (range) {
            case '1D':
                return [
                    { name: '18h', value: random(0, 200) }, { name: '19h', value: random(200, 500) },
                    { name: '20h', value: random(500, 1200) }, { name: '21h', value: random(1000, 2500) },
                    { name: '22h', value: random(1500, 3000) }, { name: '23h', value: random(1000, 2000) },
                    { name: '00h', value: random(500, 1000) }, { name: '01h', value: random(0, 500) }
                ];
            case '1M':
                return Array.from({ length: 15 }, (_, i) => ({
                    name: `Dia ${i * 2 + 1}`,
                    value: base + random(-500, 2000) + (i * 100)
                }));
            case '1YA':
                return [
                    { name: 'Jan', value: 45000 }, { name: 'Fev', value: 52000 },
                    { name: 'Mar', value: 48000 }, { name: 'Abr', value: 61000 },
                    { name: 'Mai', value: 55000 }, { name: 'Jun', value: 67000 },
                    { name: 'Jul', value: 72000 }, { name: 'Ago', value: 85000 },
                    { name: 'Set', value: 91000 }, { name: 'Out', value: 88000 },
                    { name: 'Nov', value: 95000 }, { name: 'Dez', value: 120000 }
                ];
            case '1W': // Default fallback
            default:
                return [
                    { name: 'Seg', value: 1200 }, { name: 'Ter', value: 1500 },
                    { name: 'Qua', value: 3200 }, { name: 'Qui', value: 4500 },
                    { name: 'Sex', value: 8900 }, { name: 'Sáb', value: 12500 },
                    { name: 'Dom', value: 6700 }
                ];
        }
    };

    const chartData = getChartData(timeRange);

    useEffect(() => {
        if (user?.name && !isSuper) {
            setBanking(prev => ({ ...prev, titular: user.name }));
        }
    }, [user, isSuper]);

    const handleSave = async () => {
        setLoading(true);
        if (user?.establishmentId) {
            await api.updateEstablishment(user.establishmentId, { pix_key: banking.pixKey });
        }
        setTimeout(() => {
            setLoading(false);
            alert('Dados bancários atualizados com sucesso!');
        }, 1000);
    };

    const handleApprove = (id) => {
        setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
    };

    // --- OWNER VIEW (Bar Owner) ---
    if (!isSuper) {
        return (
            <div>
                <div className="header">
                    <div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Financeiro</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Performance, saldo e configurações de recebimento.
                        </p>
                    </div>
                    <button className="btn">
                        <ArrowUpRight size={18} /> Solicitar Antecipação
                    </button>
                </div>

                {/* Performance Chart */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                                <TrendingUp size={20} color="var(--success)" /> Performance de Vendas
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Faturamento Bruto no período
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                            {['1D', '1W', '1M', '1YA'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setTimeRange(r)}
                                    style={{
                                        border: 'none', background: timeRange === r ? 'white' : 'transparent',
                                        boxShadow: timeRange === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
                                        fontWeight: timeRange === r ? '600' : '400', color: timeRange === r ? 'var(--primary)' : '#64748b',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    tickFormatter={(value) => `R$${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Banking Config Card */}
                <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={20} color="var(--primary)" /> Dados de Recebimento
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chave PIX (CNPJ/CPF)</label>
                            <input
                                type="text"
                                value={banking.pixKey}
                                onChange={e => setBanking({ ...banking, pixKey: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Titular da Conta</label>
                            <input
                                type="text"
                                value={banking.titular}
                                readOnly
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', color: '#64748b' }}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: '500' }}>
                            <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Configuração'}
                        </button>
                    </div>
                </div>

                {/* Fee Breakdown Simulation */}
                <div className="card" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Info size={16} /> Entenda suas Taxas (Simulação Transparente)
                    </h3>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Exemplo de uma Venda:</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>R$ 100,00</p>
                        </div>
                        <div style={{ fontSize: '1.5rem', color: '#cbd5e1' }}>→</div>

                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '500' }}>Sua Parte (Líquido)</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>R$ 97,01</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                <span>Taxa da Plataforma (Fixo)</span>
                                <span>- R$ 1,99</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                                <span>Taxa Bancária (Gateway ~1%)</span>
                                <span>- R$ 1,00</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: '#e0f2fe', borderRadius: '8px', fontSize: '0.85rem', color: '#0369a1', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>O cliente final pagará taxas de serviço adicionais para cobrir esses custos, garantindo que sua margem seja preservada.</span>
                    </div>
                </div>

                {/* Payout History */}
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Histórico de Repasses</h3>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f1f5f9' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>Data</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>Valor Líquido</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.filter(p => p.establishment === 'Bar do Zé').map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '1rem' }}>{p.date}</td>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600',
                                                backgroundColor: p.status === 'Paid' ? '#dcfce7' : '#fef9c3',
                                                color: p.status === 'Paid' ? '#166534' : '#854d0e'
                                            }}>
                                                {p.status === 'Paid' ? 'PAGO' : 'PROCESSANDO'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // --- SUPER ADMIN VIEW ---
    // (Kept separate return for cleaner code structure, though above if statement handles it)
    return (
        <div>
            {/* Fallback to Super Admin view logic if needed, but the if(!isSuper) return covers the user request. 
               This part handles the 'else' implicitly or can be structured to handle isSuper explicitly. 
               Wait, the previous return is inside if(!isSuper). So this is the 'else' block. OK. 
           */}
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Financeiro Global</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Aprovação de saques e repasses dos estabelecimentos.
                    </p>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Estabelecimento</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Data</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Valor</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Chave PIX</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem' }}>{p.establishment}</td>
                                <td style={{ padding: '1rem' }}>{p.date}</td>
                                <td style={{ padding: '1rem' }}>{p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{p.pix}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600',
                                        backgroundColor: p.status === 'Paid' ? '#dcfce7' : '#fefce8',
                                        color: p.status === 'Paid' ? '#166534' : '#ca8a04'
                                    }}>
                                        {p.status === 'Paid' ? 'Pago' : 'Pendente'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {p.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleApprove(p.id)} style={{ color: 'var(--success)', border: 'none', background: 'none', cursor: 'pointer' }}>
                                                <CheckCircle size={20} />
                                            </button>
                                            <button style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer' }}>
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Finance;
