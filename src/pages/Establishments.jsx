import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Search, Loader2, X, ChevronRight, ChevronLeft, Image as ImageIcon, Store, Tag } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ColorPicker = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)', transition: '0.2s' }}>
        <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-primary)' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace', textTransform: 'uppercase' }}>{value}</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', boxShadow: `0 4px 12px ${value}40`, transition: '0.3s' }}>
                <input type="color" value={value} onChange={onChange} style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', cursor: 'pointer', opacity: 0 }} />
                <div style={{ width: '100%', height: '100%', backgroundColor: value, transition: '0.3s' }} />
            </div>
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
                name: '', type: 'Restaurante', logo_url: '',
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
            let finalLogoUrl = formData.logo_url;
            
            if (logoFile) {
                const uploadId = isEditing ? editId : Math.random().toString(36).substring(7);
                finalLogoUrl = await api.uploadLogo(logoFile, uploadId);
            }

            const payload = { ...formData, logo_url: finalLogoUrl };
            
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

    if (loading) return <div style={{ padding: '2rem' }}>Carregando...</div>;

    return (
        <div>
            {/* INLINE CSS FOR FOCUS EFFECTS */}
            <style>{`
                .input-wrapper:focus-within { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
                @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes backdropFade { from { opacity: 0; } to { opacity: 1; } }
            `}</style>

            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: '700' }}>Meus Estabelecimentos</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gerencie suas lojas e acompanhe o fluxo geral na plataforma.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '600', display: 'flex', gap: '8px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
                    <Plus size={20} /> Novo Estabelecimento
                </button>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', animation: 'backdropFade 0.3s ease-out' }}>
                    <div style={{ width: '90%', maxWidth: '850px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        
                        {/* Modal Header & Steps */}
                        <div style={{ padding: '1.5rem 2rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{isEditing ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '50%', transition: '0.2s' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 1 ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 1 ? 'var(--primary)' : 'var(--bg-secondary)', color: step >= 1 ? 'white' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>1</div>
                                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Negócio</span>
                                </div>
                                <div style={{ flex: 1, height: '2px', backgroundColor: step >= 2 ? 'var(--primary)' : 'var(--border)', transition: '0.3s' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 2 ? 'var(--primary)' : 'var(--text-tertiary)', transition: '0.3s' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 2 ? 'var(--primary)' : 'var(--bg-secondary)', color: step >= 2 ? 'white' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold', transition: '0.3s' }}>2</div>
                                    <span style={{ fontWeight: '600', fontSize: '0.9rem', transition: '0.3s' }}>Aparência</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', minHeight: '480px', flexDirection: 'row' }}>
                            {/* Left Form Side */}
                            <div style={{ flex: 1, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {step === 1 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'modalFadeIn 0.3s ease-out' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Ponto de Partida</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Defina o nome principal e escolha o segmento ideal para habilitar os recursos vitais.</p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Nome do Estabelecimento <span style={{color:'var(--danger)'}}>*</span></label>
                                                <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', transition: '0.2s' }}>
                                                    <Store size={20} color={formData.name ? 'var(--primary)' : 'var(--text-tertiary)'} style={{transition: '0.2s'}} />
                                                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Pizzaria Consagrado" style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', fontWeight: '500' }} />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Segmento Principal</label>
                                                <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', transition: '0.2s', position: 'relative' }}>
                                                    <Tag size={20} color="var(--primary)" />
                                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', appearance: 'none', cursor: 'pointer', fontWeight: '500' }}>
                                                        <option value="Restaurante">Restaurante Tradicional</option>
                                                        <option value="Bar">Bar / Choperia</option>
                                                        <option value="Pizzaria">Pizzaria Delivery & Salão</option>
                                                        <option value="Balada">Balada / Casa Noturna</option>
                                                        <option value="Adega">Adega / Distribuidora</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'modalFadeIn 0.3s ease-out' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Construção da Marca</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Defina a identidade do app B2C. Seus clientes vão pirar nisso!</p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Logomarca</label>
                                                <div className="input-wrapper" style={{ 
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                    padding: '1.5rem', borderRadius: '16px', border: '2px dashed var(--border)', 
                                                    backgroundColor: 'var(--bg-secondary)', transition: '0.2s', cursor: 'pointer',
                                                    position: 'relative', textAlign: 'center'
                                                }}>
                                                    <input 
                                                        type="file" 
                                                        onChange={handleFileChange} 
                                                        accept="image/*"
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                                                    />
                                                    
                                                    {logoPreview ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                                                            <img src={logoPreview} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                                                            <div style={{ flex: 1, textAlign: 'left' }}>
                                                                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white' }}>{logoFile?.name}</p>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); setLogoFile(null); setLogoPreview(null); }}
                                                                    style={{ fontSize: '0.75rem', color: 'var(--danger)', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 'bold' }}
                                                                >
                                                                    Remover Imagem
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px', marginBottom: '0.75rem' }}>
                                                                <ImageIcon size={24} />
                                                            </div>
                                                            <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white' }}>Upload de Imagem</p>
                                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Arraste aqui ou clique para selecionar</p>
                                                        </>
                                                    )}
                                                </div>
                                                <div style={{ marginTop: '1rem' }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Ou use uma URL pública</label>
                                                    <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', transition: '0.2s' }}>
                                                        <ImageIcon size={18} color={formData.logo_url ? 'var(--primary)' : 'var(--text-tertiary)'} style={{transition: '0.2s'}} />
                                                        <input type="text" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} placeholder="https://exemplo.com/logo.png" style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                                                <ColorPicker label="Acento Primário" value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} />
                                                <ColorPicker label="Acento Secundário" value={formData.theme_secondary_color} onChange={e => setFormData({...formData, theme_secondary_color: e.target.value})} />
                                                <ColorPicker label="Fundo App (B2C)" value={formData.theme_background_color} onChange={e => setFormData({...formData, theme_background_color: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Preview Side (Only in step 2) */}
                            {step === 2 && (
                                <div style={{ flex: '1', minWidth: '340px', backgroundColor: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                                    
                                    {/* Ambient background glow */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', backgroundColor: formData.theme_color, filter: 'blur(80px)', opacity: 0.3, transition: '0.5s' }}></div>

                                    {/* Realistic Device Frame */}
                                    <div style={{ 
                                        width: '270px', height: '540px', borderRadius: '44px', border: '8px solid #334155',
                                        backgroundColor: formData.theme_background_color, overflow: 'hidden', position: 'relative',
                                        boxShadow: `0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 20px ${formData.theme_color}20`, 
                                        display: 'flex', flexDirection: 'column', transition: '0.4s background-color', zIndex: 1
                                    }}>
                                        {/* Dynamic Island / Notch */}
                                        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100px', height: '22px', backgroundColor: '#334155', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 10 }}></div>
                                        
                                        <div style={{ height: '160px', background: `linear-gradient(to bottom, ${formData.theme_color}80, transparent)`, padding: '3rem 1.5rem 1rem', textAlign: 'center', transition: '0.4s background', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            {(logoPreview || formData.logo_url) ? (
                                                <img src={logoPreview || formData.logo_url} alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto', display: 'block', backgroundColor: 'white', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }} />
                                            ) : (
                                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: formData.theme_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', transition: '0.4s background-color' }}>
                                                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'L'}
                                                </div>
                                            )}
                                            <h3 style={{ color: 'white', fontSize: '1.1rem', marginTop: '0.75rem', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                                {formData.name || 'Seu Nome Menu'}
                                            </h3>
                                        </div>
                                        
                                        <div style={{ padding: '0 1.25rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', borderLeft: `4px solid ${formData.theme_secondary_color}`, display: 'flex', gap: '1rem', alignItems: 'center', backdropFilter: 'blur(10px)', transition: '0.4s border-color, 0.4s background-color' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ width: '70%', height: '12px', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '6px', marginBottom: '8px' }}></div>
                                                    <div style={{ width: '40%', height: '10px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px' }}></div>
                                                </div>
                                            </div>
                                            <div style={{ width: '100%', height: '70px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}></div>
                                            <div style={{ width: '100%', height: '70px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}></div>
                                        </div>
                                        
                                        <div style={{ padding: '1rem 1.25rem 1.5rem' }}>
                                            <div style={{ width: '100%', height: '52px', backgroundColor: formData.theme_color, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.4s background-color, 0.4s box-shadow', boxShadow: `0 4px 16px ${formData.theme_color}60` }}>
                                                <span style={{ color: 'white', fontWeight: '700', fontSize: '1rem' }}>Ver Cardápio</span>
                                            </div>
                                        </div>

                                        {/* Phone home indicator */}
                                        <div style={{ position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)', width: '35%', height: '4px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)' }}>
                            {step === 2 ? (
                                <button onClick={() => setStep(1)} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '0.75rem 1.5rem', fontWeight: '600', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ChevronLeft size={18} /> Voltar
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step === 1 ? (
                                <button onClick={() => setStep(2)} className="btn btn-primary" disabled={!formData.name} style={{ padding: '0.75rem 2rem', fontWeight: '600', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)', opacity: !formData.name ? 0.5 : 1 }}>
                                    Ir para Aparência <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button onClick={handleSubmit} className="btn btn-primary" disabled={creating} style={{ backgroundColor: formData.theme_color, padding: '0.75rem 2rem', fontWeight: '600', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: `0 4px 14px ${formData.theme_color}60`, transition: '0.3s' }}>
                                    {creating ? <Loader2 size={18} className="animate-spin" /> : (isEditing ? 'Salvar Alterações' : 'Criar Conta Premium')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: 0, marginTop: '2rem', border: '1px solid var(--border)', borderRadius: '16px', position: 'relative' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="input-wrapper" style={{ position: 'relative', flex: 1, maxWidth: '320px', borderRadius: '10px', overflow: 'hidden' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Buscar estabelecimento..."
                            style={{
                                width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem',
                                border: '1px solid var(--border)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'var(--bg-primary)', color: 'white'
                            }}
                        />
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rede</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tipo</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {establishments.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Store size={32} color="var(--text-tertiary)" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '500', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Nenhum estabelecimento encontrado</p>
                                            <p style={{ fontSize: '0.9rem' }}>Crie sua primeira loja para liberar o sistema completo.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            establishments.map(est => (
                                <tr key={est.id} style={{ borderBottom: '1px solid var(--border)', transition: '0.2s', ':hover': { backgroundColor: 'var(--bg-secondary)' } }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {est.logo_url ? (
                                            <img src={est.logo_url} alt={est.name} style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                                        ) : (
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: est.theme_color || 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                                {(est.name || 'L').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span>{est.name}</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                            color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '700', border: '1px solid rgba(37, 99, 235, 0.2)'
                                        }}>
                                            CONSAGRADO
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                            {est.type || 'Restaurante'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ 
                                            display: 'inline-flex', alignItems: 'center', gap: '6px', 
                                            color: est.status === 'inactive' ? 'var(--text-tertiary)' : '#059669', 
                                            fontSize: '0.85rem', fontWeight: '600', 
                                            backgroundColor: est.status === 'inactive' ? 'var(--bg-secondary)' : 'rgba(16, 185, 129, 0.08)', 
                                            padding: '4px 10px', borderRadius: '99px',
                                            opacity: est.status === 'inactive' ? 0.7 : 1
                                        }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: est.status === 'inactive' ? 'var(--text-tertiary)' : '#059669' }}></div>
                                            {est.status === 'inactive' ? 'Inativo' : 'Ativo'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <button 
                                                onClick={() => handleOpenModal(est)}
                                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', padding: '0.4rem 0.8rem', fontSize: '0.8rem', fontWeight: '600', transition: '0.2s' }}
                                            >
                                                Editar
                                            </button>
                                            
                                            <div style={{ position: 'relative', display: 'flex' }}>
                                                <button 
                                                    onClick={() => {
                                                        setActiveMenuId(activeMenuId === est.id ? null : est.id);
                                                    }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.5rem' }}
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {activeMenuId === est.id && (
                                                    <div style={{ position: 'absolute', right: '0', bottom: '100%', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '0.5rem', zIndex: 100, minWidth: '150px', marginBottom: '8px' }}>
                                                        <button 
                                                            onClick={() => { handleToggleStatus(est); setActiveMenuId(null); }}
                                                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.6rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                                        >
                                                            {est.status === 'inactive' ? 'Ativar' : 'Desativar'}
                                                        </button>
                                                        <button 
                                                            onClick={() => { handleDelete(est.id); setActiveMenuId(null); }}
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Establishments;
