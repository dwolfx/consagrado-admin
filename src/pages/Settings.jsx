import { useState } from 'react';
import { Save, Store, Wifi, CreditCard, Palette, Image as ImageIcon, Clock } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [config, setConfig] = useState({
        // Profile
        name: 'Bar do Zé',
        description: 'O melhor happy hour da cidade. Cerveja gelada e petiscos de boteco.',
        logoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop',
        brandColor: '#3b82f6',

        // Operations
        wifiSsid: 'BarDoZe_Clientes',
        wifiPass: 'cervejagelada123',
        tableCount: 20,
        openingHours: 'Ter-Dom: 18h às 02h',

        // Finance
        platformFee: 1.99,
        feeType: 'fixed',
        pixKey: 'pagamentos@bardoze.com.br',
        supportPhone: '11999999999'
    });

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Here we would save to API
        alert('Configurações atualizadas com sucesso!');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="card animate-fade-in">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Store size={20} className="text-primary" /> Identidade Visual
                        </h3>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }}>
                                <div style={{
                                    width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden',
                                    border: '4px solid var(--bg-tertiary)', flexShrink: 0
                                }}>
                                    <img src={config.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>URL do Logo</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <ImageIcon size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
                                            <input
                                                name="logoUrl" value={config.logoUrl} onChange={handleChange}
                                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                            />
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                        Esta imagem aparecerá no topo do cardápio digital.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome do Estabelecimento</label>
                                    <input
                                        name="name" value={config.name} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cor da Marca</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <input
                                            type="color" name="brandColor" value={config.brandColor} onChange={handleChange}
                                            style={{ width: '50px', height: '45px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{config.brandColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bio / Descrição Curta</label>
                                <textarea
                                    name="description" value={config.description} onChange={handleChange} rows={3}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'operation':
                return (
                    <div className="card animate-fade-in">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Wifi size={20} className="text-primary" /> Operação & WiFi
                        </h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome da Rede WiFi (SSID)</label>
                                    <input
                                        name="wifiSsid" value={config.wifiSsid} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Senha do WiFi</label>
                                    <input
                                        name="wifiPass" value={config.wifiPass} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                💡 Essas informações ficarão disponíveis para os clientes no Cardápio Digital.
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantidade de Mesas</label>
                                    <input
                                        type="number" name="tableCount" value={config.tableCount} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Horário de Funcionamento</label>
                                    <div style={{ position: 'relative' }}>
                                        <Clock size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
                                        <input
                                            name="openingHours" value={config.openingHours} onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'finance':
                return (
                    <div className="card animate-fade-in">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CreditCard size={20} className="text-primary" /> Financeiro e Taxas
                        </h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tipo de Taxa</label>
                                    <select
                                        name="feeType"
                                        value={config.feeType} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    >
                                        <option value="fixed">Fixo (R$)</option>
                                        <option value="percent">Porcentagem (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Valor da Taxa</label>
                                    <input
                                        type="number"
                                        name="platformFee"
                                        value={config.platformFee} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Chave PIX (Para Recebimento)</label>
                                <input
                                    name="pixKey" value={config.pixKey} onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Telefone de Suporte</label>
                                <input
                                    name="supportPhone" value={config.supportPhone} onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Configurações</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gerencie a identidade e operação do seu negócio.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                    <Save size={18} style={{ marginRight: '8px' }} /> Salvar Alterações
                </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                {/* Sidebar Navigation */}
                <div className="card" style={{ width: '250px', padding: '0.5rem', flexShrink: 0 }}>
                    {[
                        { id: 'profile', label: 'Perfil & Marca', icon: Palette },
                        { id: 'operation', label: 'Operação & WiFi', icon: Wifi },
                        { id: 'finance', label: 'Financeiro', icon: CreditCard },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '1rem', border: 'none', background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                                borderRadius: '8px', cursor: 'pointer', fontWeight: activeTab === tab.id ? 600 : 400,
                                textAlign: 'left', transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1 }}>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;
