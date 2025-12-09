
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
    { id: 1, name: "João Pedro", pin: "1234", active: true },
    { id: 2, name: "Maria Silva", pin: "5678", active: true },
    { id: 3, name: "Carlos Souza", pin: "0000", active: false },
];

export const payoutRequests = [
    { id: 101, establishment: "Bar do Zé", amount: 5000.00, date: "09/12/2025", status: "Pending", pix: "123.456.789-00" },
    { id: 102, establishment: "Boteco da Esquina", amount: 2500.00, date: "08/12/2025", status: "Paid", pix: "boteco@email.com" },
    { id: 103, establishment: "Balada Night", amount: 15000.00, date: "07/12/2025", status: "Paid", pix: "99.999.999/0001-99" },
];
