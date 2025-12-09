import { useState } from 'react';
import { staffMembers } from '../data/mockData';
import { Plus, Trash2, Key } from 'lucide-react';

const Staff = () => {
    const [staff, setStaff] = useState(staffMembers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWaiter, setNewWaiter] = useState({ name: '', pin: '' });

    const handleAdd = () => {
        if (!newWaiter.name || !newWaiter.pin) return;
        setStaff([...staff, { id: Date.now(), ...newWaiter, active: true }]);
        setIsModalOpen(false);
        setNewWaiter({ name: '', pin: '' });
    };

    return (
        <div>
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Equipe de Garçons</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gerencie os logins do App do Garçom.</p>
                </div>
                <button className="btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Novo Garçom
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {staff.map(member => (
                    <div key={member.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '4px' }}>{member.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <Key size={12} /> PIN: {member.pin}
                                </div>
                            </div>
                        </div>
                        <button style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'cursor' }}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '400px' }}>
                        <h3>Adicionar Garçom</h3>
                        <div style={{ margin: '1rem 0' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                value={newWaiter.name}
                                onChange={e => setNewWaiter({ ...newWaiter, name: e.target.value })}
                            />
                        </div>
                        <div style={{ margin: '1rem 0' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>PIN de Acesso (4 dígitos)</label>
                            <input
                                type="text"
                                maxLength="4"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                value={newWaiter.pin}
                                onChange={e => setNewWaiter({ ...newWaiter, pin: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button className="btn" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            <button className="btn" onClick={handleAdd}>Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
