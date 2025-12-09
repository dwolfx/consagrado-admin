import { useState } from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
    const [config, setConfig] = useState({
        platformFee: 1.99,
        feeType: 'fixed',
        pixKey: 'pagamentos@consagrado.com.br',
        supportPhone: '11999999999'
    });

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Configurações Globais</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Definições da plataforma Consagrado.</p>
                </div>
            </div>

            <div className="card">
                <form>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Taxas e Monetização</h3>
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
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Financeiro</h3>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Chave PIX Recebedora (Gateway)</label>
                        <input
                            type="text"
                            name="pixKey"
                            value={config.pixKey} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Suporte</h3>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>WhatsApp de Suporte</label>
                        <input
                            type="text"
                            name="supportPhone"
                            value={config.supportPhone} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <button type="button" className="btn" onClick={() => alert('Configurações salvas!')}>
                        <Save size={18} /> Salvar Alterações
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
