
export const establishments = [
    { id: 1, name: "Bar do Zé", plan: "Pro", status: "Active", users: 1420, revenue: 45200.00 },
    { id: 2, name: "Balada Night", plan: "Enterprise", status: "Active", users: 510, revenue: 128500.00 },
    { id: 3, name: "Café Colonial", plan: "Starter", status: "Suspended", users: 50, revenue: 1200.00 },
    { id: 4, name: "Boteco da Esquina", plan: "Pro", status: "Active", users: 890, revenue: 25400.00 },
];

export const revenueHistory = [
    { name: 'Jan', value: 40000 },
    { name: 'Fev', value: 35000 },
    { name: 'Mar', value: 50000 },
    { name: 'Abr', value: 80000 },
    { name: 'Mai', value: 120000 },
    { name: 'Jun', value: 160000 },
];

export const globalStats = {
    totalRevenue: 200300.00,
    activeEstablishments: 3,
    totalUsers: 2870
};

export const staffMembers = [
    { id: 1, name: "João Pedro", role: "Garçom Líder", shift: "18:00 - 02:00", phone: "(11) 99999-1111", active: true, status: "online", avatar: null },
    { id: 2, name: "Maria Silva", role: "Atendente", shift: "18:00 - 23:00", phone: "(11) 99999-2222", active: true, status: "online", avatar: null },
    { id: 3, name: "Carlos Souza", role: "Barman", shift: "19:00 - 03:00", phone: "(11) 99999-3333", active: true, status: "offline", lastSeen: "Ontem 03:00" },
];

export const freelancers = [
    { id: 101, name: "Jorge da Silva", role: "Garçom", rating: 4.9, jobs: 12, phone: "5511999998888", skills: ["Bandeja", "Vinhos"] },
    { id: 102, name: "Ana Clara", role: "Bartender", rating: 5.0, jobs: 8, phone: "5511999997777", skills: ["Mixologia", "Agilidade"] },
    { id: 103, name: "Roberto Junior", role: "Cumim", rating: 4.5, jobs: 3, phone: "5511999996666", skills: ["Limpeza", "Organização"] },
];

export const payoutRequests = [
    { id: 101, establishment: "Bar do Zé", amount: 5000.00, date: "09/12/2025", status: "Pending", pix: "123.456.789-00" },
    { id: 102, establishment: "Boteco da Esquina", amount: 2500.00, date: "08/12/2025", status: "Paid", pix: "boteco@email.com" },
    { id: 103, establishment: "Balada Night", amount: 15000.00, date: "07/12/2025", status: "Paid", pix: "99.999.999/0001-99" },
];
