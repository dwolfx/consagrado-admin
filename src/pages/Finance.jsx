import { useState } from 'react';
import { payoutRequests } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { DollarSign, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';

const Finance = () => {
    const { user } = useAuth();
    const isSuper = user?.role === 'super';
    const [payouts, setPayouts] = useState(payoutRequests);

    const handleApprove = (id) => {
        setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
    };

    return (
        <div>
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Financeiro</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isSuper ? 'Aprovação de saques e repasses.' : 'Seu saldo e solicitações de saque.'}
                    </p>
                </div>
                {!isSuper && (
                    <button className="btn">
                        <ArrowUpRight size={18} /> Solicitar Saque
                    </button>
                )}
            </div>

            {!isSuper && (
                <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                            <DollarSign size={32} />
                        </div>
                        <div>
                            <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>Saldo Disponível</p>
                            <h2 style={{ fontSize: '2.5rem' }}>R$ 12.450,00</h2>
                        </div>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: 0 }}>
                <table>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                            {isSuper && <th>Estabelecimento</th>}
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Chave PIX</th>
                            <th>Status</th>
                            {isSuper && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.map(p => (
                            <tr key={p.id}>
                                {isSuper && <td>{p.establishment}</td>}
                                <td>{p.date}</td>
                                <td>{p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td style={{ fontFamily: 'monospace' }}>{p.pix}</td>
                                <td>
                                    <span className={`status-badge ${p.status === 'Paid' ? 'active' : 'suspended'}`} style={{ backgroundColor: p.status === 'Pending' ? '#fefce8' : undefined, color: p.status === 'Pending' ? '#ca8a04' : undefined }}>
                                        {p.status === 'Paid' ? 'Pago' : 'Pendente'}
                                    </span>
                                </td>
                                {isSuper && p.status === 'Pending' && (
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleApprove(p.id)} style={{ color: 'var(--success)', border: 'none', background: 'none', cursor: 'pointer' }}>
                                                <CheckCircle size={20} />
                                            </button>
                                            <button style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer' }}>
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                                {isSuper && p.status !== 'Pending' && <td>-</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Finance;
