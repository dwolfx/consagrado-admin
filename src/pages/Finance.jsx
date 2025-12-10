import { useState, useEffect } from 'react';
import { payoutRequests } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DollarSign, CheckCircle, XCircle, ArrowUpRight, CreditCard, Save, Info, AlertCircle } from 'lucide-react';

const Finance = () => {
    const { user } = useAuth();
    const isSuper = user?.role === 'super';
    const [payouts, setPayouts] = useState(payoutRequests);

    // Banking State
    const [banking, setBanking] = useState({ pixKey: '00.000.000/0001-00', titular: 'Seu Bar LTDA' });
    const [loading, setLoading] = useState(false);

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
        // Artificial delay for UX
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
                            Configure seus dados de recebimento e acompanhe repasses.
                        </p>
                    </div>
                    <button className="btn">
                        <ArrowUpRight size={18} /> Solicitar Antecipação
                    </button>
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
    return (
        <div>
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
