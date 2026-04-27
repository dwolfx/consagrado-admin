import { useState, useEffect } from 'react';
import { Package, AlertTriangle, CheckCircle, ShoppingCart, MessageCircle, TrendingDown, Search, Filter, ArrowUpRight, BarChart3, MoreVertical, Plus, ShoppingBag, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Inventory = () => {
    const { user, currentEstablishment, establishments } = useAuth();
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
        loadInventory();
        loadSuppliers();
    }, [currentEstablishment, establishments]);

    const loadInventory = async () => {
        setLoading(true);
        try {
            if (currentEstablishment) {
                const data = await api.getInventory(currentEstablishment.id);
                setItems(data || []);
            } else {
                // GLOBAL: Sum up inventory from all units
                const allInvPromises = establishments.map(est => api.getInventory(est.id));
                const allInvArrays = await Promise.all(allInvPromises);
                
                // Add establishment name to each item for reference
                const combined = allInvArrays.flatMap((arr, idx) => 
                    arr.map(item => ({ ...item, establishment_name: establishments[idx].name }))
                );
                setItems(combined);
            }
        } catch (e) {
            console.error('Error loading inventory:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadSuppliers = async () => {
        try {
            const data = await api.getSuppliers();
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
        const supplier = item.suppliers;
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

    if (loading) return <div style={{ padding: '2rem', color: '#64748b', fontWeight: '500' }}>Carregando inventário inteligente...</div>;

    return (
        <div style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .inv-row:hover { background-color: #f8fafc; }
                .action-btn:hover { background-color: #f1f5f9; transform: scale(1.05); }
                .tab-btn:hover { background-color: rgba(255,255,255,0.05); }
            `}</style>

            <div className="header" style={{ 
                marginBottom: '4rem', padding: '3rem', borderRadius: '32px', 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: 'white', position: 'relative', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
                <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                            <Package size={20} color="#818cf8" />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', color: '#818cf8', textTransform: 'uppercase' }}>Gestão de Insumos</span>
                    </div>
                    <h1 style={{ fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'white', lineHeight: '1.1' }}>
                        Estoque {currentEstablishment ? `• ${currentEstablishment.name}` : '(Rede)'}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', lineHeight: '1.6' }}>
                        {currentEstablishment ? `Monitoramento em tempo real e reposição inteligente para ${currentEstablishment.name}.` : 'Painel administrativo centralizado com visão global do seu patrimônio em estoque.'}
                    </p>
                </div>
                <button 
                    className="btn" 
                    onClick={() => handleOpenModal()} 
                    style={{ 
                        background: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '16px', 
                        fontWeight: '800', color: '#0f172a', cursor: 'pointer', transition: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
                        boxShadow: '0 15px 25px -5px rgba(0,0,0,0.2)', display: 'flex', gap: '10px', position: 'relative', zIndex: 1,
                        fontSize: '1rem'
                    }}
                >
                    <Plus size={22} /> Novo Item
                </button>
            </div>

            {/* OVERLAY STAT CARDS */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '-5.5rem', marginBottom: '3.5rem', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>
                <div className="card" style={{ flex: 1, padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '20px' }}><BarChart3 size={32} /></div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Patrimônio em Estoque</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b' }}>{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </div>
                </div>
                <div className="card" style={{ flex: 1, padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '20px' }}><ShoppingBag size={32} /></div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Alertas de Ruptura</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ef4444' }}>{criticalCount} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>itens críticos</span></div>
                    </div>
                </div>
                <div className="card" style={{ flex: 1, padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '1rem', borderRadius: '20px' }}><Layers size={32} /></div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Catalogados</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b' }}>{items.length} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>produtos</span></div>
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTERS SECTION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', padding: '0 1rem', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', padding: '6px', backgroundColor: 'rgba(241, 245, 249, 0.5)', backdropFilter: 'blur(8px)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <button onClick={() => setFilter('all')} style={{ padding: '0.75rem 1.5rem', border: 'none', background: filter === 'all' ? '#1e293b' : 'transparent', color: filter === 'all' ? 'white' : '#64748b', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s', fontSize: '0.9rem', boxShadow: filter === 'all' ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none' }}>Todos</button>
                    <button onClick={() => setFilter('low')} style={{ padding: '0.75rem 1.5rem', border: 'none', background: filter === 'low' ? '#f59e0b' : 'transparent', color: filter === 'low' ? 'white' : '#64748b', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s', fontSize: '0.9rem', boxShadow: filter === 'low' ? '0 10px 15px -3px rgba(245, 158, 11, 0.2)' : 'none' }}>Baixo</button>
                    <button onClick={() => setFilter('critical')} style={{ padding: '0.75rem 1.5rem', border: 'none', background: filter === 'critical' ? '#ef4444' : 'transparent', color: filter === 'critical' ? 'white' : '#64748b', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s', fontSize: '0.9rem', boxShadow: filter === 'critical' ? '0 10px 15px -3px rgba(239, 68, 68, 0.2)' : 'none' }}>Crítico</button>
                </div>
                
                <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Pesquisar produto ou fornecedor..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '1rem 1.5rem 1rem 3.5rem', backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '20px', color: '#1e293b', fontSize: '1rem', outline: 'none', transition: '0.3s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }} 
                    />
                </div>
            </div>

            {/* MAIN TABLE */}
            <div className="card" style={{ padding: 0, borderRadius: '28px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Insumo</th>
                            {!currentEstablishment && <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Unidade</th>}
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Status Saúde</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'right', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Qtd. Atual</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'right', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Preço Custo</th>
                            <th style={{ padding: '1.5rem 2rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Fornecedor</th>
                            <th style={{ padding: '1.5rem 2rem' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={currentEstablishment ? "6" : "7"} style={{ padding: '6rem', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ display: 'inline-flex', padding: '2rem', borderRadius: '32px', backgroundColor: '#f8fafc', border: '1px dashed #e2e8f0', marginBottom: '1.5rem' }}>
                                        <Package size={64} style={{ opacity: 0.2 }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Nenhum item encontrado</h3>
                                    <p style={{ color: '#64748b' }}>Tente ajustar seus filtros ou busca.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredItems.sort((a, b) => a.stock - b.stock).map(item => {
                                const status = getStatus(item);
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={item.id} className="inv-row" style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s' }}>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Package size={22} /></div>
                                                <div>
                                                    <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.05rem', display: 'block', marginBottom: '2px' }}>{item.name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Ref: #IN-{item.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        {!currentEstablishment && (
                                            <td style={{ padding: '1.5rem 2rem' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: '800' }}>{item.establishment_name}</span>
                                            </td>
                                        )}
                                        <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '8px 16px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '900',
                                                backgroundColor: status.bg, color: status.color, border: `1px solid ${status.color}20`,
                                                display: 'inline-flex', alignItems: 'center', gap: '8px'
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: status.color }}></div>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.15rem', fontWeight: '900', color: item.stock <= (item.min_stock || 10) ? '#ef4444' : '#1e293b' }}>
                                                {item.stock} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>{item.unit || 'un'}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Mín: {item.min_stock || 10}</div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>
                                                {item.price ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'white', fontWeight: '900', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)' }}>
                                                    {item.suppliers?.name?.charAt(0) || 'F'}
                                                </div>
                                                <span style={{ color: '#475569', fontWeight: '700', fontSize: '0.95rem' }}>{item.suppliers?.name || 'Não vinculado'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                <button
                                                    onClick={() => handleOrder(item)}
                                                    className="btn"
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                        padding: '0.75rem 1.25rem', borderRadius: '12px', cursor: 'pointer',
                                                        backgroundColor: item.stock <= (item.min_stock || 10) * 1.5 ? '#25D366' : 'transparent',
                                                        color: item.stock <= (item.min_stock || 10) * 1.5 ? 'white' : '#64748b',
                                                        border: item.stock <= (item.min_stock || 10) * 1.5 ? 'none' : '1px solid #e2e8f0',
                                                        fontWeight: '800', fontSize: '0.85rem', transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)', 
                                                        boxShadow: item.stock <= (item.min_stock || 10) * 1.5 ? '0 10px 15px -3px rgba(37, 211, 102, 0.2)' : 'none'
                                                    }}
                                                >
                                                    {item.stock <= (item.min_stock || 10) * 1.5 ? (
                                                        <><MessageCircle size={16} /> Repor</>
                                                    ) : (
                                                        <><ShoppingCart size={16} /> Solicitar</>
                                                    )}
                                                </button>
                                                
                                                <div style={{ position: 'relative' }}>
                                                    <button 
                                                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                                                        className="action-btn"
                                                        style={{ padding: '0.75rem', background: 'transparent', border: '1px solid #e2e8f0', color: '#94a3b8', cursor: 'pointer', borderRadius: '12px', transition: '0.2s' }}
                                                    >
                                                        <MoreVertical size={20} />
                                                    </button>

                                                    {activeMenuId === item.id && (
                                                        <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '0.75rem', zIndex: 100, minWidth: '180px', marginTop: '10px', animation: 'fadeIn 0.2s ease-out' }}>
                                                            <button 
                                                                onClick={() => { handleOpenModal(item); setActiveMenuId(null); }}
                                                                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.8rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#1e293b', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}
                                                            >
                                                                Editar Insumo
                                                            </button>
                                                            <button 
                                                                onClick={() => { handleDelete(item.id); setActiveMenuId(null); }}
                                                                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.8rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#ef4444', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}
                                                            >
                                                                Excluir Registro
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

            {/* PREMIUM MODAL */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', animation: 'backdropFade 0.4s ease-out' }}>
                    <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '650px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.25)', animation: 'modalFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        <div style={{ padding: '2.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.02em' }}>{isEditing ? 'Editar Insumo' : 'Novo Insumo'}</h2>
                                <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>Complete as informações para um controle preciso.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', padding: '0.75rem', borderRadius: '14px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome do Item</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Carne de Sol, Coca-Cola 350ml..." style={{ width: '100%', padding: '1.1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', fontWeight: '600', outline: 'none', transition: '0.2s' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qtd. Atual</label>
                                    <input required type="number" step="0.01" value={formData.stock} onChange={e => setFormData({...formData, stock: parseFloat(e.target.value)})} style={{ width: '100%', padding: '1.1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#1e293b', fontSize: '1.1rem', fontWeight: '900', outline: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mínimo Segurança</label>
                                    <input required type="number" step="0.01" value={formData.min_stock} onChange={e => setFormData({...formData, min_stock: parseFloat(e.target.value)})} style={{ width: '100%', padding: '1.1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#1e293b', fontSize: '1.1rem', fontWeight: '900', outline: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unidade de Medida</label>
                                    <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} style={{ width: '100%', padding: '1.1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', fontWeight: '700', outline: 'none' }}>
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
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custo por Unidade (R$)</label>
                                    <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} style={{ width: '100%', padding: '1.1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#1e293b', fontSize: '1.1rem', fontWeight: '900', outline: 'none' }} />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vincular Fornecedor</label>
                                    <select 
                                        value={formData.supplier_id} 
                                        onChange={e => setFormData({...formData, supplier_id: e.target.value})} 
                                        style={{ width: '100%', padding: '1.1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#1e293b', fontSize: '1rem', fontWeight: '700', outline: 'none' }}
                                    >
                                        <option value="">Sem fornecedor vinculado</option>
                                        {suppliers.map(sup => (
                                            <option key={sup.id} value={sup.id}>{sup.name} ({sup.category})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginTop: '3.5rem', display: 'flex', gap: '1.25rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '1.25rem', borderRadius: '18px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '800', cursor: 'pointer', fontSize: '1rem', transition: '0.2s' }}>Cancelar</button>
                                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '1.25rem', borderRadius: '18px', border: 'none', background: '#1e293b', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem', transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.2)' }}>
                                    {submitting ? 'Processando...' : isEditing ? 'Atualizar Inventário' : 'Efetivar Cadastro'}
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
