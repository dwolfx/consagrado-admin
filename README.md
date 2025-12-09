# Super Admin (SaaS Panel) 👑

Painel centralizado para gestão da plataforma (Franqueadora) e dos donos de estabelecimento.

## 🛠️ Tecnologias
- **Frontend**: React (Vite)
- **Backend/Database**: Supabase (PostgreSQL + Realtime)
- **Estilização**: CSS Modules (Vanilla)
- **Icons**: Lucide React
- **Charts**: Recharts

## 🚀 Como Rodar
```bash
# Instalar dependências
npm install

# Rodar localmente
npm run dev

# Build de produção
npm run build
```

---

## 👑 God Mode SaaS
Painel com **Dupla Visão** (Role-Based Access Control):

### 🅰️ Visão Super Admin (Você/Dono da Plataforma)
1.  **Dashboard Global**: Faturamento somado de TODAS as franquias.
2.  **Gestão de Tenants**: Cadastre e suspenda estabelecimentos com 1 clique.
3.  **Configurações Globais**: Defina a taxa da plataforma (1.99% ou R$ 2,00) e chave Pix recebedora.
4.  **Auditoria Financeira**: Aprove solicitações de saque dos donos de bar.

### 🅱️ Visão Owner (Dono do Bar)
1.  **Meu Faturamento**: Gráficos exclusivos do seu estabelecimento.
2.  **Gestão de Equipe**:
    *   **Crie Garçons**: Cadastre nomes, gerencie PINs e dados completos (CPF, Pix, Endereço).
    *   **Monitoramento**: Veja quem está online e logs de turno.
3.  **Financeiro**:
    *   Veja saldo disponível.
    *   **Solicitar Saque**: Envie pedido de repasse para a plataforma.
