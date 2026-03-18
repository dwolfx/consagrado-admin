import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Smartphone, Utensils, Star } from 'lucide-react';

const Landing = () => {
    return (
        <div style={{ backgroundColor: '#09090b', color: 'white', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
            {/* Header */}
            <header style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '1.5rem 5%', borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'sticky', top: 0, backgroundColor: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(12px)', zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/src/assets/logo.png" alt="Consagrado Logo" style={{ height: '36px', filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/login" style={{ 
                        color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.5rem 1rem', 
                        fontWeight: '500', transition: '0.2s', borderRadius: '8px'
                    }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>
                        Entrar
                    </Link>
                    <Link to="/register" style={{ 
                        backgroundColor: 'var(--primary)', color: 'white', textDecoration: 'none', 
                        padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: '500', 
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)', transition: 'transform 0.2s'
                    }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
                        Criar Conta <ArrowRight size={16} />
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{ 
                padding: '6rem 5% 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' 
            }}>
                {/* Visual Flair Background */}
                <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
                
                <h1 style={{ 
                    fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', 
                    background: 'linear-gradient(to right, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    position: 'relative', zIndex: 1
                }}>
                    O Sistema Definitivo <br /> para o seu Restaurante
                </h1>
                <p style={{ 
                    fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6',
                    position: 'relative', zIndex: 1
                }}>
                    Aumente suas vendas, otimize sua equipe e ofereça autoatendimento de ponta para seus clientes. Tudo em um único painel.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                    <Link to="/register" style={{ 
                        backgroundColor: 'white', color: '#0f172a', padding: '1rem 2rem', borderRadius: '12px', 
                        fontWeight: '700', fontSize: '1.125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        transition: '0.2s transform'
                    }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                        Começar Agora
                    </Link>
                    <Link to="/login" style={{ 
                        backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', 
                        fontWeight: '600', fontSize: '1.125rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                        transition: '0.2s background'
                    }} onMouseOver={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                        Já sou parceiro
                    </Link>
                </div>
            </section>

            {/* Features Preview */}
            <section style={{ padding: '5rem 5%', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.2)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#818cf8' }}>
                        <Smartphone size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600' }}>Cardápio Digital</h3>
                    <p style={{ color: '#94a3b8', lineHeight: '1.5' }}>Gere QR Codes paras as mesas. Seu cliente acessa o app B2C hiper imersivo sem instalar nada e faz o pedido direto para a cozinha.</p>
                </div>

                <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#34d399' }}>
                        <BarChart3 size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600' }}>Gestão de Múltiplas Lojas</h3>
                    <p style={{ color: '#94a3b8', lineHeight: '1.5' }}>Ideal para franquias ou empreendedores com vários estabelecimentos. Controle o financeiro de cada unidade no painel Master.</p>
                </div>

                <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.2)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#fbbf24' }}>
                        <Utensils size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600' }}>Painel Chefia (B2B)</h3>
                    <p style={{ color: '#94a3b8', lineHeight: '1.5' }}>Seus garçons, caixas e cozinheiros têm acesso ao melhor sistema de acompanhamento ao vivo. 100% atualizado em tempo real.</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ textAlign: 'center', padding: '3rem 5%', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: '0.875rem' }}>
                <p>&copy; {new Date().getFullYear()} Consagrado Sistemas. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Landing;
