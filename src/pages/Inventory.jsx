import { useState } from 'react';
import { Package, AlertTriangle, CheckCircle, ShoppingCart, MessageCircle, TrendingDown } from 'lucide-react';
import { inventoryItems } from '../data/mockData';

const Inventory = () => {
    const [items, setItems] = useState(inventoryItems);

    const getStatus = (item) => {
        if (item.stock <= item.min) return { label: 'CRÍTICO', color: 'var(--danger)', bg: '#fef2f2', icon: AlertTriangle };
        if (item.stock <= item.min * 1.2) return { label: 'BAIXO', color: 'var(--warning)', bg: '#fefce8', icon: TrendingDown };
        return { label: 'OK', color: 'var(--success)', bg: '#f0fdf4', icon: CheckCircle };
    };

    const handleOrder = (item) => {
        const qtyNeeded = Math.ceil((item.min * 1.5) - item.stock);
        const msg = `Olá ${item.supplier}, preciso de um pedido urgente de *${item.name}*. \nEstoque Atual: ${item.stock}${item.unit}. \nPreciso de aprox: ${qtyNeeded}${item.unit}.`;
        window.open(`https://wa.me/${item.phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const totalValue = items.reduce((acc, item) => acc + (item.stock * item.price), 0);
    const lowStockCount = items.filter(i => i.stock <= i.min * 1.2).length;

    return (
        <div>
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Estoque Inteligente</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Monitoramento em tempo real com reposição automática.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="card" style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Valor em Estoque</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </div>

            {/* Alert Banner for Low Stock */}
            {lowStockCount > 0 && (
                <div style={{
                    padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: '8px', color: '#991b1b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <AlertTriangle />
                    <div>
                        <strong>Atenção:</strong> {lowStockCount} produtos precisam de reposição imediata.
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Produto</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Atual</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Mínimo</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)', paddingLeft: '2rem' }}>Fornecedor</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.sort((a, b) => a.stock - b.stock).map(item => {
                            const status = getStatus(item);
                            const StatusIcon = status.icon;

                            return (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold',
                                            backgroundColor: status.bg, color: status.color, border: `1px solid ${status.color}30`,
                                            display: 'inline-flex', alignItems: 'center', gap: '6px'
                                        }}>
                                            <StatusIcon size={12} /> {status.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                                        {item.stock} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.unit}</span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                        {item.min} {item.unit}
                                    </td>
                                    <td style={{ padding: '1rem', paddingLeft: '2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                                {item.supplier.charAt(0)}
                                            </div>
                                            {item.supplier}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleOrder(item)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                                backgroundColor: item.stock <= item.min * 1.2 ? '#25D366' : 'transparent',
                                                color: item.stock <= item.min * 1.2 ? 'white' : 'var(--text-secondary)',
                                                fontWeight: '600',
                                                border: item.stock <= item.min * 1.2 ? 'none' : '1px solid var(--border)'
                                            }}
                                        >
                                            {item.stock <= item.min * 1.2 ? (
                                                <><MessageCircle size={16} /> Pedir Reposição</>
                                            ) : (
                                                <span style={{ fontSize: '0.8rem' }}>Estoque Cheio</span>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
