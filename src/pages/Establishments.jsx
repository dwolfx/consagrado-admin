import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Search, Loader2, X, ChevronRight, ChevronLeft, Image as ImageIcon, Store, Tag, MapPin, Globe, Shield } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ColorPicker = ({ value, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', transition: '0.2s' }}>
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: '700' }}>{value}</span>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', overflow: 'hidden', border: '2px solid white', cursor: 'pointer', position: 'relative', boxShadow: `0 4px 12px ${value}40`, transition: '0.3s' }}>
            <input type="color" value={value} onChange={onChange} style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', cursor: 'pointer', opacity: 0 }} />
            <div style={{ width: '100%', height: '100%', backgroundColor: value, transition: '0.3s' }} />
        </div>
    </div>
);

const Establishments = () => {
    const { user, refreshUser } = useAuth();
    const [establishments, setEstablishments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Restaurante',
        address: '',
        city: '',
        state: '',
        logo_url: '',
        theme_color: '#6366f1',
        theme_secondary_color: '#f59e0b',
        theme_background_color: '#09090b'
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [creating, setCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        try {
            const ownerId = user?.role === 'super' ? null : user?.id;
            const data = await api.getEstablishments(ownerId);
            setEstablishments(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenModal = (est = null) => {
        if (est) {
            setIsEditing(true);
            setEditId(est.id);
            setFormData({
                name: est.name,
                type: est.type || 'Restaurante',
                address: est.address || '',
                city: est.city || '',
                state: est.state || '',
                logo_url: est.logo_url || '',
                theme_color: est.theme_color || '#6366f1',
                theme_secondary_color: est.theme_secondary_color || '#f59e0b',
                theme_background_color: est.theme_background_color || '#09090b'
            });
            setLogoPreview(est.logo_url);
        } else {
            setIsEditing(false);
            setEditId(null);
            setFormData({
                name: '', type: 'Restaurante', address: '', city: '', state: '', logo_url: '',
                theme_color: '#6366f1', theme_secondary_color: '#f59e0b', theme_background_color: '#09090b'
            });
            setLogoPreview(null);
        }
        setLogoFile(null);
        setStep(1);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;
        setCreating(true);
        try {
            const payload = { 
                name: formData.name, 
                theme_color: formData.theme_color || '#6366f1',
                theme_secondary_color: formData.theme_secondary_color || '#4338ca'
            };
            
            if (isEditing) {
                await api.updateEstablishment(editId, payload);
            } else {
                await api.createEstablishment(payload, user.id);
            }
            
            setShowModal(false);
            loadData();
            if (refreshUser) await refreshUser();
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar estabelecimento: ' + e.message);
        }
        setCreating(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este estabelecimento? Esta ação é irreversível.')) {
            try {
                await api.deleteEstablishment(id);
                loadData();
                if (refreshUser) refreshUser();
            } catch (e) {
                alert('Erro ao excluir: ' + e.message);
            }
        }
    };

    const handleToggleStatus = async (est) => {
        const newStatus = est.status === 'inactive' ? 'active' : 'inactive';
        try {
            await api.updateEstablishment(est.id, { status: newStatus });
            loadData();
        } catch (e) {
            alert('Erro ao alterar status: ' + e.message);
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: '#64748b', fontWeight: '500' }}>Sincronizando unidades...</div>;

    return (
        <div className="page-wrapper" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: '"Inter", sans-serif', animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .est-row:hover { background-color: #f8fafc; }
                .device-preview { transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                
                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                  .responsive-modal-container { padding: 1rem !important; }
                  .responsive-modal-content { flex-direction: column !important; width: 100% !important; max-width: 100% !important; max-height: 95vh !important; overflow-y: auto !important; border-radius: 24px !important; }
                  .responsive-modal-left { padding: 2rem 1.5rem !important; }
                  .responsive-modal-right { width: 100% !important; padding: 2.5rem 1rem !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.4) !important; }
                  .responsive-color-inputs { flex-direction: column !important; gap: 1rem !important; }
                  .responsive-table-wrapper { overflow-x: auto !important; }
                  
                  /* Table adjustments */
                  .responsive-table-wrapper table th, .responsive-table-wrapper table td { padding: 1rem !important; font-size: 0.9rem !important; }
                  .responsive-table-wrapper table td div { gap: 0.75rem !important; }

                  /* Page layout adjustments */
                  .page-wrapper { padding: 1rem !important; }
                  .page-header { flex-direction: column !important; padding: 2rem 1.5rem !important; gap: 1.5rem !important; align-items: stretch !important; text-align: left !important; }
                  .page-header h1 { fontSize: '2rem' !important; }
                  .page-header p { fontSize: '1rem' !important; }
                  .page-header button { width: 100% !important; justify-content: center !important; }
                  .quick-stats-container { flex-direction: column !important; margin-top: -2rem !important; padding: 0 0.5rem !important; gap: 1rem !important; }
                  .search-area { justify-content: center !important; padding: 0 !important; }
                  .search-area div { max-width: 100% !important; }
                }
            `}</style>

            <div className="page-header" style={{ 
                marginBottom: '4rem', padding: '3rem', borderRadius: '32px', 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: 'white', position: 'relative', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                            <Store size={20} color="#818cf8" />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2.5px', color: '#818cf8', textTransform: 'uppercase' }}>Gestão de Unidades</span>
                    </div>
                    <h1 style={{ fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'white', lineHeight: '1.1' }}>
                        Meus Estabelecimentos
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem', lineHeight: '1.6' }}>
                        Gerencie suas marcas, configure a identidade visual e acompanhe a saúde operacional decada unidade da sua rede.
                    </p>
                </div>
                <button 
                    className="btn" 
                    onClick={() => handleOpenModal()} 
                    style={{ 
                        background: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '16px', 
                        fontWeight: '800', color: '#0f172a', cursor: 'pointer', transition: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
                        boxShadow: '0 20px 30px -5px rgba(0,0,0,0.25)', display: 'flex', gap: '10px', position: 'relative', zIndex: 1,
                        fontSize: '1rem'
                    }}
                >
                    <Plus size={22} /> Novo Estabelecimento
                </button>
            </div>

            {/* QUICK STATS (OVERLAYING HEADER) */}
            <div className="quick-stats-container" style={{ display: 'flex', gap: '2rem', marginTop: '-5.5rem', marginBottom: '3.5rem', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>
                <div className="card" style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '28px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '1rem', borderRadius: '20px' }}><Store size={32} /></div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total de Unidades</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b' }}>{establishments.length} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>estabelecimentos</span></div>
                    </div>
                </div>
                <div className="card" style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '28px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '20px' }}><Shield size={32} /></div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unidades Ativas</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#10b981' }}>{establishments.filter(e => e.status !== 'inactive').length} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>pontos de venda</span></div>
                    </div>
                </div>
            </div>

            {/* SEARCH AREA */}
            <div className="search-area" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem', padding: '0 1rem' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Pesquisar por nome ou cidade..." 
                        style={{ width: '100%', padding: '1rem 1.5rem 1rem 3.5rem', backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '20px', color: '#1e293b', fontSize: '1rem', outline: 'none', transition: '0.3s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }} 
                    />
                </div>
            </div>

            {/* MAIN TABLE */}
            <div className="card" style={{ padding: 0, borderRadius: '28px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.5rem 2.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Estabelecimento</th>
                            <th style={{ padding: '1.5rem 2.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Tipo / Segmento</th>
                            <th style={{ padding: '1.5rem 2.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Localização</th>
                            <th style={{ padding: '1.5rem 2.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Status</th>
                            <th style={{ padding: '1.5rem 2.5rem' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {establishments.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '8rem', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ display: 'inline-flex', padding: '2rem', borderRadius: '32px', backgroundColor: '#f8fafc', border: '1px dashed #e2e8f0', marginBottom: '1.5rem' }}>
                                        <Store size={64} style={{ opacity: 0.2 }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.75rem' }}>Nenhuma unidade cadastrada</h3>
                                    <p style={{ fontSize: '1rem', color: '#64748b' }}>Comece registrando seu primeiro estabelecimento para operar.</p>
                                </td>
                            </tr>
                        ) : (
                            establishments.map(est => (
                                <tr key={est.id} className="est-row" style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s' }}>
                                    <td style={{ padding: '1.5rem 2.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            {est.logo_url ? (
                                                <img src={est.logo_url} alt={est.name} style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                                            ) : (
                                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: est.theme_color || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.25rem', boxShadow: `0 8px 16px ${est.theme_color || '#6366f1'}30` }}>
                                                    {(est.name || 'L').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.15rem', display: 'block', marginBottom: '4px' }}>{est.name}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rede Consagrado</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ padding: '6px', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}><Tag size={16} /></div>
                                            <span style={{ fontSize: '1rem', color: '#475569', fontWeight: '700' }}>{est.type || 'Restaurante'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <MapPin size={16} color="#94a3b8" />
                                            <div>
                                                <span style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: '800', display: 'block' }}>{est.city || '—'}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>{est.state || 'BRASIL'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2.5rem', textAlign: 'center' }}>
                                        <span style={{ 
                                            display: 'inline-flex', alignItems: 'center', gap: '8px', 
                                            color: est.status === 'inactive' ? '#94a3b8' : '#10b981', 
                                            fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase',
                                            backgroundColor: est.status === 'inactive' ? '#f1f5f9' : 'rgba(16, 185, 129, 0.1)', 
                                            padding: '8px 16px', borderRadius: '99px',
                                            border: `1px solid ${est.status === 'inactive' ? '#e2e8f0' : 'rgba(16, 185, 129, 0.2)'}`
                                        }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: est.status === 'inactive' ? '#94a3b8' : '#10b981' }}></div>
                                            {est.status === 'inactive' ? 'Inativo' : 'Operacional'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 2.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <button 
                                                onClick={() => handleOpenModal(est)}
                                                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', color: '#1e293b', padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: '800', transition: '0.2s' }}
                                            >
                                                Configurar
                                            </button>
                                            
                                            <div style={{ position: 'relative' }}>
                                                <button 
                                                    onClick={() => setActiveMenuId(activeMenuId === est.id ? null : est.id)}
                                                    style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', color: '#94a3b8', padding: '0.6rem' }}
                                                >
                                                    <MoreVertical size={20} />
                                                </button>

                                                {activeMenuId === est.id && (
                                                    <div style={{ position: 'absolute', right: '0', top: '100%', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '0.75rem', zIndex: 100, minWidth: '180px', marginTop: '10px', animation: 'fadeIn 0.2s ease-out' }}>
                                                        <button 
                                                            onClick={() => { handleToggleStatus(est); setActiveMenuId(null); }}
                                                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.8rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#1e293b', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}
                                                        >
                                                            {est.status === 'inactive' ? 'Ativar Vendas' : 'Suspender Vendas'}
                                                        </button>
                                                        <button 
                                                            onClick={() => { handleDelete(est.id); setActiveMenuId(null); }}
                                                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.8rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: '#ef4444', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}
                                                        >
                                                            Excluir Permanentemente
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL SIMPLIFICADA GLASSMORPHISM COM PREVIEW */}
            {showModal && (
                <div className="responsive-modal-container" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
                    <div className="responsive-modal-content" style={{ position: 'relative', display: 'flex', width: '100%', maxWidth: '850px', backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.3)', overflow: 'hidden', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.25)' }}>
                        
                        {/* Botão de Fechar no Extremo Direito da Modal */}
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', cursor: 'pointer', color: '#64748b', padding: '0.6rem', borderRadius: '12px', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <X size={20} />
                        </button>

                        {/* Formulário (Esquerda) */}
                        <div className="responsive-modal-left" style={{ flex: 1, padding: '3.5rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '3rem' }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.02em' }}>{isEditing ? 'Editar Marca' : 'Criar Marca'}</h2>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500', marginTop: '0.5rem' }}>Defina a identidade premium do seu espaço.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', flex: 1 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome do Local</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Bar do Hexa" style={{ width: '100%', padding: '1.1rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', color: '#1e293b', fontSize: '1.1rem', fontWeight: '700', outline: 'none' }} />
                                </div>

                                <div className="responsive-color-inputs" style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cor Principal</label>
                                        <ColorPicker value={formData.theme_color || '#6366f1'} onChange={e => setFormData({...formData, theme_color: e.target.value})} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cor de Apoio</label>
                                        <ColorPicker value={formData.theme_secondary_color || '#4338ca'} onChange={e => setFormData({...formData, theme_secondary_color: e.target.value})} />
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                                    <button 
                                        type="submit"
                                        disabled={!formData.name || creating} 
                                        style={{ 
                                            width: '100%', backgroundColor: formData.theme_color || '#1e293b', 
                                            padding: '1.25rem', fontWeight: '900', color: 'white', borderRadius: '16px', border: 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: '0.3s',
                                            boxShadow: `0 10px 20px -5px ${(formData.theme_color || '#1e293b')}60`,
                                            opacity: (!formData.name || creating) ? 0.7 : 1
                                        }}
                                    >
                                        {creating ? <Loader2 size={22} className="animate-spin" /> : (isEditing ? 'Salvar Alterações' : 'Concluir Criação')}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview Mockup (Direita) */}
                        <div className="responsive-modal-right" style={{ width: '420px', backgroundColor: 'rgba(15, 23, 42, 0.02)', borderLeft: '1px solid rgba(255,255,255,0.4)', padding: '3.5rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                            {/* Blur ambient glow */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '250px', height: '250px', backgroundColor: formData.theme_color || '#6366f1', filter: 'blur(90px)', opacity: 0.15, transition: '0.5s' }}></div>
                            
                            {/* Celular Frame */}
                            <div style={{ width: '280px', height: '560px', backgroundColor: '#ffffff', borderRadius: '44px', border: '12px solid #1e293b', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                
                                {/* Celular Notch */}
                                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '26px', backgroundColor: '#1e293b', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px', zIndex: 20 }}></div>

                                {/* Dynamic Header */}
                                <div style={{ padding: '3.5rem 1rem 2rem', background: `linear-gradient(135deg, ${formData.theme_color || '#6366f1'}, ${formData.theme_secondary_color || '#4338ca'})`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                                    <div style={{ width: '64px', height: '64px', backgroundColor: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: formData.theme_color || '#6366f1', fontSize: '1.75rem', fontWeight: '900', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }}>
                                        {(formData.name || 'C').charAt(0)}
                                    </div>
                                    <h3 style={{ color: 'white', fontWeight: '800', marginTop: '1.25rem', fontSize: '1.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{formData.name || 'Sua Marca'}</h3>
                                </div>

                                {/* Mock Content (No Scroll) */}
                                <div style={{ flex: 1, padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', backgroundColor: '#f8fafc', overflowY: 'hidden' }}>
                                    <div style={{ minHeight: '52px', backgroundColor: 'white', borderRadius: '12px', padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center', borderLeft: `4px solid ${formData.theme_secondary_color || '#4338ca'}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                        <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ width: '65%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', marginBottom: '6px' }}></div>
                                            <div style={{ width: '35%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ minHeight: '52px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}></div>
                                    <div style={{ minHeight: '52px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}></div>
                                </div>

                                {/* Dynamic App Button (Fixed at Bottom, smaller and more elegant) */}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 1rem 1.25rem', background: 'linear-gradient(to top, #f8fafc 90%, transparent)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '160px', height: '40px', backgroundColor: formData.theme_color || '#6366f1', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px -4px ${(formData.theme_color || '#6366f1')}80` }}>
                                        <span style={{ color: 'white', fontWeight: '800', fontSize: '0.85rem' }}>Ver Cardápio</span>
                                    </div>
                                    {/* Celular bottom home indicator */}
                                    <div style={{ width: '40%', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px', marginTop: '0.85rem' }}></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Establishments;
