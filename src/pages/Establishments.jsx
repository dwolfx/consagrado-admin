import { establishments } from '../data/mockData';
import { Plus, MoreVertical, Search } from 'lucide-react';

const Establishments = () => {
    return (
        <div>
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Estabelecimentos</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gerencie seus clientes e planos.</p>
                </div>
                <button className="btn">
                    <Plus size={18} /> Novo Cliente
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Toolbar */}
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Buscar estabelecimento..."
                            style={{
                                width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                                border: '1px solid var(--border)', borderRadius: '6px',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                            <th>Nome</th>
                            <th>Plano</th>
                            <th>Status</th>
                            <th>Usuários</th>
                            <th>Receita (Mês)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {establishments.map(est => (
                            <tr key={est.id}>
                                <td style={{ fontWeight: 500 }}>{est.name}</td>
                                <td>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9',
                                        color: '#475569', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #e2e8f0'
                                    }}>
                                        {est.plan}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${est.status.toLowerCase()}`}>
                                        {est.status === 'Active' ? 'Ativo' : 'Suspenso'}
                                    </span>
                                </td>
                                <td>{est.users}</td>
                                <td>{est.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Establishments;
