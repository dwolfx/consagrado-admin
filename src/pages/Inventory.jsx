import { useState, useEffect } from 'react';
import { Package, AlertTriangle, CheckCircle, ShoppingCart, MessageCircle, TrendingDown, Search, Filter, ArrowUpRight, BarChart3, MoreVertical, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Inventory = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        stock: 0,
        min_stock: 10,
        unit: 'un',
        price: 0,
        supplier_id: ''
    });

    useEffect(() => {
        if (user?.establishmentId) {
            loadInventory();
            loadSuppliers();
        }
    }, [user]);

    const loadInventory = async () => {
        setLoading(true);
        try {
            const data = await api.getInventory(user.establishmentId);
            setItems(data || []);
        } catch (e) {
            console.error('Error loading inventory:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadSuppliers = async () => {
        try {
            const data = await api.getSuppliers(user.establishmentId);
            setSuppliers(data || []);
        } catch (e) {
            console.error('Error loading suppliers:', e);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setIsEditing(true);
            setEditId(item.id);
            setFormData({
                name: item.name,
                stock: item.stock,
                min_stock: item.min_stock,
                unit: item.unit || 'un',
                price: item.price || 0,
                supplier_id: item.supplier_id || ''
            });
        } else {
            setIsEditing(false);
            setEditId(null);
            setFormData({
                name: '',
                stock: 0,
                min_stock: 10,
                unit: 'un',
                price: 0,
                supplier_id: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData, establishment_id: parseInt(user.establishmentId) };
            // Ensure numeric values
            payload.stock = parseFloat(payload.stock);
            payload.min_stock = parseFloat(payload.min_stock);
            payload.price = parseFloat(payload.price);
            if (payload.supplier_id) {
                payload.supplier_id = parseInt(payload.supplier_id);
            } else {
                delete payload.supplier_id;
            }

            if (isEditing) {
                await api.updateInventoryItem(editId, payload);
            } else {
                await api.createInventoryItem(payload);
            }
            setShowModal(false);
            loadInventory();
        } catch (e) {
            alert('Erro ao salvar item: ' + e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excluir este item permanentemente?')) {
            try {
                await api.deleteInventoryItem(id);
                loadInventory();
            } catch (e) {
                alert('Erro ao excluir: ' + e.message);
            }
        }
    };

    const getStatus = (item) => {
        const min = item.min_stock || 10;
        if (item.stock <= min) return { label: 'CRÍTICO', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: AlertTriangle };
        if (item.stock <= min * 1.5) return { label: 'BAIXO', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: TrendingDown };
        return { label: 'ESTOQUE OK', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: CheckCircle };
    };

    const handleOrder = (item) => {
        const min = item.min_stock || 10;
        const qtyNeeded = Math.ceil((min * 2) - item.stock);
        const estName = user?.establishmentName || 'nosso estabelecimento';
        const supplier = item.suppliers; // From join
        const msg = `Olá! 👋 Aqui é do ${estName}.\nGostaria de solicitar a reposição de *${item.name}*.\n\n📊 *Status Atual:* ${item.stock} ${item.unit || 'un'}\n📦 *Pedido Estimado:* ~${qtyNeeded} ${item.unit || 'un'}\n\nConsegue nos atender para hoje?`;
        
        const phone = supplier?.phone || '5511999999999';
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const filteredItems = items.filter(item => {
        const nameMatch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const supplierMatch = (item.suppliers?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSearch = nameMatch || supplierMatch;

        const status = getStatus(item);
        if (filter === 'low') return matchesSearch && status.label === 'BAIXO';
        if (filter === 'critical') return matchesSearch && status.label === 'CRÍTICO';
        return matchesSearch;
    });

    const totalValue = items.reduce((acc, item) => acc + (item.stock * (item.price || 0)), 0);
    const criticalCount = items.filter(i => i.stock <= (i.min_stock || 10)).length;

    if (loading) return <div style={{ padding: '2rem' }}>Carregando inventário...</div>;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .inv-row:hover { background-color: rgba(255,255,255,0.02); }
                .filter-btn:hover { background-color: var(--bg-card); }
            `}</style>

            <div className="header" style={{ marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Gestão de Estoque</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Controle inteligente de insumos e reposição automatizada.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '10px' }}><BarChart3 size={20} /></div>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Patrimônio Líquido</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', display: 'flex', gap: '8px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
                        <Plus size={20} /> Novo Item
                    </button>
                </div>
            </div>

            {/* QUICK FILTERS & SEARCH */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', padding: '4px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <button onClick={() => setFilter('all')} className="filter-btn" style={{ padding: '0.5rem 1rem', border: 'none', background: filter === 'all' ? 'var(--bg-card)' : 'transparent', color: filter === 'all' ? 'var(--primary)' : 'var(--text-secondary)', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', fontSize: '0.85rem' }}>Todos</button>
                    <button onClick={() => setFilter('low')} className="filter-btn" style={{ padding: '0.5rem 1rem', border: 'none', background: filter === 'low' ? 'var(--bg-card)' : 'transparent', color: filter === 'low' ? '#f59e0b' : 'var(--text-secondary)', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', fontSize: '0.85rem' }}>Baixo</button>
                    <button onClick={() => setFilter('critical')} className="filter-btn" style={{ padding: '0.5rem 1rem', border: 'none', background: filter === 'critical' ? 'var(--bg-card)' : 'transparent', color: filter === 'critical' ? '#ef4444' : 'var(--text-secondary)', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', fontSize: '0.85rem' }}>Crítico</button>
                </div>
                
                <div style={{ position: 'relative', width: '350px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input 
                        type="text" 
                        placeholder="Pesquisar produto ou fornecedor..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '0.9rem', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
                    />
                </div>
            </div>

            {/* ALERT BOX */}
            {criticalCount > 0 && (
                <div style={{
                    padding: '1.25rem 1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '16px', color: '#ef4444', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)' }}><AlertTriangle size={20} /></div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '800', marginBottom: '2px', fontSize: '1rem' }}>Alerta de Ruptura de Estoque</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Existem <strong>{criticalCount} itens</strong> que atingiram o nível crítico. Recomendamos a reposição imediata para evitar falhas na operação.</p>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: 0, borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', position: 'relative' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Insumo</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Status Saúde</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Qtd. Atual</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Mín. Segurança</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Fornecedor Primário</th>
                            <th style={{ padding: '1.25rem 1.5rem' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                    <Package size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                    <p>Nenhum item encontrado com estes critérios.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredItems.sort((a, b) => a.stock - b.stock).map(item => {
                                const status = getStatus(item);
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={item.id} className="inv-row" style={{ borderBottom: '1px solid var(--border)', transition: '0.2s' }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}><Package size={20} /></div>
                                                <span style={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>{item.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '6px 14px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '800',
                                                backgroundColor: status.bg, color: status.color, border: `1px solid ${status.color}20`,
                                                display: 'inline-flex', alignItems: 'center', gap: '8px'
                                            }}>
                                                <StatusIcon size={14} /> {status.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: item.stock <= (item.min_stock || 10) ? '#ef4444' : 'white' }}>
                                                {item.stock} <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '400' }}>{item.unit || 'un'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                                            {item.min_stock || 10} {item.unit || 'un'}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'white', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                    {item.suppliers?.name?.charAt(0) || 'F'}
                                                </div>
                                                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{item.suppliers?.name || 'Não vinculado'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleOrder(item)}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                        padding: '0.6rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                        backgroundColor: item.stock <= (item.min_stock || 10) * 1.5 ? '#25D366' : 'var(--bg-secondary)',
                                                        color: item.stock <= (item.min_stock || 10) * 1.5 ? 'white' : 'var(--text-secondary)',
                                                        fontWeight: '700', fontSize: '0.85rem', transition: '0.3s', boxShadow: item.stock <= (item.min_stock || 10) * 1.5 ? '0 4px 12px rgba(37, 211, 102, 0.2)' : 'none'
                                                    }}
                                                >
                                                    {item.stock <= (item.min_stock || 10) * 1.5 ? (
                                                        <><MessageCircle size={16} /> Repor</>
                                                    ) : (
                                                        <>Detalhes <ArrowUpRight size={14} /></>
                                                    )}
                                                </button>
                                                
                                                <div style={{ position: 'relative' }}>
                                                    <button 
                                                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                                                        style={{ padding: '0.6rem', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>

                                                    {activeMenuId === item.id && (
                                                        <div style={{ position: 'absolute', right: 0, bottom: '100%', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '0.5rem', zIndex: 100, minWidth: '150px', marginBottom: '8px' }}>
                                                            <button 
                                                                onClick={() => { handleOpenModal(item); setActiveMenuId(null); }}
                                                                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.6rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                            >
                                                                Editar Item
                                                            </button>
                                                            <button 
                                                                onClick={() => { handleDelete(item.id); setActiveMenuId(null); }}
                                                                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.6rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--danger)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                            >
                                                                Excluir
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* CREATE/EDIT MODAL */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', animation: 'backdropFade 0.3s ease-out' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '600px', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'modalFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>{isEditing ? 'Editar Item' : 'Novo Insumo'}</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{isEditing ? 'Atualize as informações do produto.' : 'Adicione um novo item ao seu controle de estoque.'}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '12px', cursor: 'pointer' }}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Nome do Item</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Carne de Sol, Coca-Cola 350ml..." style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Qtd. Atual</label>
                                    <input required type="number" step="0.01" value={formData.stock} onChange={e => setFormData({...formData, stock: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Mínimo de Segurança</label>
                                    <input required type="number" step="0.01" value={formData.min_stock} onChange={e => setFormData({...formData, min_stock: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Unidade</label>
                                    <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}>
                                        <option value="un">Unidade (un)</option>
                                        <option value="kg">Quilo (kg)</option>
                                        <option value="g">Grama (g)</option>
                                        <option value="l">Litro (l)</option>
                                        <option value="ml">Mililitro (ml)</option>
                                        <option value="cx">Caixa (cx)</option>
                                        <option value="fardo">Fardo</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Preço de Custo (R$)</label>
                                    <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                                        Fornecedor
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: '400' }}>Gerenciado via B2B</span>
                                    </h3>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Vincular Fornecedor</label>
                                    <select 
                                        value={formData.supplier_id} 
                                        onChange={e => setFormData({...formData, supplier_id: e.target.value})} 
                                        style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}
                                    >
                                        <option value="">Sem fornecedor vinculado</option>
                                        {suppliers.map(sup => (
                                            <option key={sup.id} value={sup.id}>{sup.name} ({sup.category})</option>
                                        ))}
                                    </select>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                        Os dados de contato e categoria são puxados automaticamente do B2B.
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'transparent', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '1rem', borderRadius: '14px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
                                    {submitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
