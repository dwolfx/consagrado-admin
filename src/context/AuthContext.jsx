import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Roles: 'guest', 'super', 'owner'
    // User: { id, name, role, email, establishmentId (if owner) }
    const [user, setUser] = useState(null);

    const login = (role) => {
        if (role === 'super') {
            setUser({
                id: 1,
                name: "Super Admin",
                email: "admin@consagrado.com",
                role: 'super'
            });
        } else {
            setUser({
                id: 2,
                name: "Dono do Bar",
                email: "owner@bardozé.com",
                role: 'owner',
                establishmentId: 1
            });
        }
    };

    const register = (data) => {
        // Simulating registration as Owner
        setUser({
            id: Math.random(),
            name: data.name,
            email: data.email,
            role: 'owner',
            establishmentId: null // Pending assignment
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
