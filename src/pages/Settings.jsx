import { useState, useEffect } from 'react';
import { Save, Store, Wifi, CreditCard, Palette, Image as ImageIcon, Clock, User, Bell, ShieldCheck, HelpCircle, Building2, Globe, Phone, Ticket, Music, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Settings = () => {
    const { user, currentEstablishment, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(false);
    
    const isGlobal = !currentEstablishment;

    const [formData, setFormData] = useState({
        // User Account
        userName: user?.name || '',
        userEmail: user?.email || '',
        
        // Unit Specific (from currentEstablishment)
        name: '',
        type: '',
        wifi_ssid: '',
        wifi_password: '',
        table_count: 0,
        opening_hours: '',
        pix_key: '',
        logo_url: '',
        theme_color: '#6366f1',
        support_phone: '',
        
        // Events & Fees (Unit Specific)
        has_couvert: false,
        couvert_value: 0,
        entrance_male: 0,
        entrance_female: 0,
        event_schedule: '',

        // Global / Network (Mocking or using meta)
        networkName: 'Rede Consagrado',
        networkLogo: '',
        globalFee: 1.99,
        globalSupport: '0800 123 4567'
    });

    useEffect(() => {
        if (currentEstablishment) {
            setFormData(prev => ({
                ...prev,
                name: currentEstablishment.name || '',
                type: currentEstablishment.type || '',
                wifi_ssid: currentEstablishment.wifi_ssid || '',
                wifi_password: currentEstablishment.wifi_password || '',
                table_count: currentEstablishment.table_count || 0,
                opening_hours: currentEstablishment.opening_hours || '',
                pix_key: currentEstablishment.pix_key || '',
                logo_url: currentEstablishment.logo_url || '',
                theme_color: currentEstablishment.theme_color || '#6366f1',
                support_phone: currentEstablishment.support_phone || '',
                has_couvert: currentEstablishment.has_couvert || false,
                couvert_value: currentEstablishment.couvert_value || 0,
                entrance_male: currentEstablishment.entrance_male || 0,
                entrance_female: currentEstablishment.entrance_female || 0,
                event_schedule: currentEstablishment.event_schedule || ''
            }));
            setActiveTab('operation'); 
        } else {
            setActiveTab('network'); 
        }
    }, [currentEstablishment]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (!isGlobal && currentEstablishment) {
                // Save Unit Settings
                await api.updateEstablishment(currentEstablishment.id, {
                    wifi_ssid: formData.wifi_ssid,
                    wifi_password: formData.wifi_password,
                    table_count: parseInt(formData.table_count) || 0,
                    opening_hours: formData.opening_hours,
                    pix_key: formData.pix_key,
                    support_phone: formData.support_phone,
                    theme_color: formData.theme_color,
                    has_couvert: formData.has_couvert,
                    couvert_value: parseFloat(formData.couvert_value) || 0,
                    entrance_male: parseFloat(formData.entrance_male) || 0,
                    entrance_female: parseFloat(formData.entrance_female) || 0,
                    event_schedule: formData.event_schedule
                });
                alert('Configurações da unidade atualizadas!');
            } else {
                alert('Configurações da rede salvas com sucesso!');
            }
            if (refreshUser) await refreshUser();
        } catch (e) {
            alert('Erro ao salvar: ' + e.message);
        }
        setLoading(false);
    };

    const cardStyle = {
        padding: '2.5rem',
        borderRadius: '32px',
        border: '1px solid var(--border)',
        background: 'white',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '800',
        color: '#64748b',
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    const inputStyle = {
        width: '100%',
        padding: '1.1rem 1.25rem',
        borderRadius: '16px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        color: '#1e293b',
        fontSize: '1rem',
        fontWeight: '600',
        outline: 'none',
        transition: '0.2s'
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'network':
                return (
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Building2 size={24} color="#6366f1" /> Identidade da Rede
                        </h3>
                        <div style={{ display: 'grid', gap: '2.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Nome da Marca / Rede</label>
                                    <input name="networkName" value={formData.networkName} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>SAC Central (Global)</label>
                                    <input name="globalSupport" value={formData.globalSupport} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'operation':
                return (
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Wifi size={24} color="#6366f1" /> Operação & WiFi (Local)
                        </h3>
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Rede WiFi (SSID)</label>
                                    <input name="wifi_ssid" value={formData.wifi_ssid} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Senha do WiFi</label>
                                    <input name="wifi_password" value={formData.wifi_password} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Capacidade de Mesas</label>
                                    <input type="number" name="table_count" value={formData.table_count} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Horário de Funcionamento</label>
                                    <input name="opening_hours" value={formData.opening_hours} onChange={handleChange} style={inputStyle} placeholder="Ter-Dom: 18h às 02h" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'events':
                return (
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Ticket size={24} color="#6366f1" /> Eventos & Cobranças
                        </h3>
                        <div style={{ display: 'grid', gap: '2.5rem' }}>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ padding: '10px', background: 'white', borderRadius: '12px', color: '#6366f1' }}><Music size={20} /></div>
                                    <div>
                                        <h4 style={{ fontWeight: '800', color: '#1e293b' }}>Couvert Artístico</h4>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Habilitar cobrança de música ao vivo.</p>
                                    </div>
                                </div>
                                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                    <input type="checkbox" name="has_couvert" checked={formData.has_couvert} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: formData.has_couvert ? '#6366f1' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}>
                                        <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: formData.has_couvert ? '28px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                    </span>
                                </label>
                            </div>

                            {formData.has_couvert && (
                                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                    <label style={labelStyle}>Valor do Couvert (R$)</label>
                                    <input type="number" name="couvert_value" value={formData.couvert_value} onChange={handleChange} style={inputStyle} />
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                                <div>
                                    <label style={labelStyle}>Entrada Masculina (R$)</label>
                                    <input type="number" name="entrance_male" value={formData.entrance_male} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Entrada Feminina (R$)</label>
                                    <input type="number" name="entrance_female" value={formData.entrance_female} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Programação de Cobrança (Dias/Horas)</label>
                                <textarea name="event_schedule" value={formData.event_schedule} onChange={handleChange} style={{ ...inputStyle, height: '100px', resize: 'none' }} placeholder="Ex: Sex e Sab após as 21h" />
                            </div>
                        </div>
                    </div>
                );
            case 'transparency':
                return (
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Info size={24} color="#6366f1" /> Transparência de Taxas
                        </h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', color: 'white' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: '800', color: '#818cf8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Plano Atual</p>
                                <h4 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem' }}>Consagrado Premium</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span>Taxa de Plataforma</span>
                                    <span style={{ fontWeight: '900', color: '#818cf8' }}>{formData.globalFee}% / transação</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span>Taxa de Gateway (PIX)</span>
                                    <span style={{ fontWeight: '900', color: '#10b981' }}>Gratuito</span>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>Dúvidas sobre o seu contrato? Entre em contato com o suporte comercial.</p>
                        </div>
                    </div>
                );
            case 'account':
                return (
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <User size={24} color="#6366f1" /> Perfil de Administrador
                        </h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Seu Nome</label>
                                <input name="userName" value={formData.userName} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email de Acesso</label>
                                <input name="userEmail" value={formData.userEmail} onChange={handleChange} style={{ ...inputStyle, opacity: 0.6 }} disabled />
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .tab-btn:hover { background-color: #f8fafc !important; color: #1e293b !important; }
            `}</style>

            <div className="header" style={{ 
                marginBottom: '4rem', padding: '3rem', borderRadius: '32px', 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: 'white', position: 'relative', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                            <Globe size={20} color="#818cf8" />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', color: '#818cf8', textTransform: 'uppercase' }}>
                            {isGlobal ? 'Configurações da Rede' : `Configurações: ${currentEstablishment.name}`}
                        </span>
                    </div>
                    <h1 style={{ fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'white' }}>Preferências</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem' }}>
                        {isGlobal ? 'Gerencie os parâmetros globais de toda a sua rede.' : 'Ajuste os detalhes e cobranças específicas desta unidade.'}
                    </p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    style={{ 
                        background: 'white', border: 'none', padding: '1.1rem 2.25rem', borderRadius: '18px', 
                        fontWeight: '900', color: '#0f172a', cursor: 'pointer', transition: '0.3s', 
                        boxShadow: '0 15px 30px -5px rgba(0,0,0,0.3)', display: 'flex', gap: '10px',
                        fontSize: '1rem', position: 'relative', zIndex: 1, opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? <Clock size={22} className="animate-spin" /> : <Save size={22} />}
                    Salvar Alterações
                </button>
            </div>

            <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', padding: '0 1rem', marginTop: '-1.5rem' }}>
                <div className="card" style={{ width: '300px', padding: '1.25rem', flexShrink: 0, borderRadius: '28px', border: '1px solid var(--border)', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', position: 'relative', zIndex: 2 }}>
                    <div style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu de Configuração</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {isGlobal ? (
                            <>
                                <button onClick={() => setActiveTab('network')} className="tab-btn" style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '1.1rem 1.25rem', border: 'none',
                                    background: activeTab === 'network' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                                    color: activeTab === 'network' ? 'white' : '#64748b', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s'
                                }}>
                                    <Building2 size={20} /> Identidade da Rede
                                </button>
                                <button onClick={() => setActiveTab('transparency')} className="tab-btn" style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '1.1rem 1.25rem', border: 'none',
                                    background: activeTab === 'transparency' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                                    color: activeTab === 'transparency' ? 'white' : '#64748b', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s'
                                }}>
                                    <Info size={20} /> Transparência
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setActiveTab('operation')} className="tab-btn" style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '1.1rem 1.25rem', border: 'none',
                                    background: activeTab === 'operation' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                                    color: activeTab === 'operation' ? 'white' : '#64748b', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s'
                                }}>
                                    <Wifi size={20} /> Operação
                                </button>
                                <button onClick={() => setActiveTab('events')} className="tab-btn" style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '1.1rem 1.25rem', border: 'none',
                                    background: activeTab === 'events' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                                    color: activeTab === 'events' ? 'white' : '#64748b', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s'
                                }}>
                                    <Ticket size={20} /> Eventos & Taxas
                                </button>
                            </>
                        )}
                        <button onClick={() => setActiveTab('account')} className="tab-btn" style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '1.1rem 1.25rem', border: 'none',
                            background: activeTab === 'account' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                            color: activeTab === 'account' ? 'white' : '#64748b', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s'
                        }}>
                            <User size={20} /> Minha Conta
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;
