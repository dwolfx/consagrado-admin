import { createContext, useState, useEffect, useContext } from 'react';
import { supabase, api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // User session state
    const [user, setUser] = useState(null);
    const [establishments, setEstablishments] = useState([]);
    const [currentEstablishment, setCurrentEstablishment] = useState(null); // null = Global
    const [loading, setLoading] = useState(true);

    const fetchUserDetails = async (sessionUser) => {
        // Busca do Perfil diretamente da nova estrutura public.profiles ao invés do session metadata
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', sessionUser.id).single();
        const role = profile?.role || 'owner';
        let allEstabs = [];

        if (role !== 'super') {
            const { data } = await supabase.from('establishments').select('*').eq('owner_id', sessionUser.id).order('name');
            allEstabs = data || [];
        }

        setEstablishments(allEstabs);
        
        // Default to Global if multiple, or the only one if single
        // Actually, let's look at localStorage for previous selection
        const savedId = localStorage.getItem('last_est_id');
        const defaultEst = allEstabs.find(e => e.id.toString() === savedId) || null;
        setCurrentEstablishment(defaultEst);

        setUser({
            id: sessionUser.id,
            email: sessionUser.email,
            name: profile?.name || sessionUser.user_metadata?.name || 'Usuário',
            role,
            hasEstablishment: allEstabs.length > 0 || role === 'super'
        });
        setLoading(false);
    };

    const selectEstablishment = (id) => {
        if (!id) {
            setCurrentEstablishment(null);
            localStorage.removeItem('last_est_id');
        } else {
            const est = establishments.find(e => e.id.toString() === id.toString());
            if (est) {
                setCurrentEstablishment(est);
                localStorage.setItem('last_est_id', id);
            }
        }
    };

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await fetchUserDetails(session.user);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchUserDetails(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserDetails(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        await api.loginBase(email, password);
    };

    const register = async (data) => {
        await api.signUpBase(data.email, data.password, { name: data.name, role: 'owner' });
    };

    const logout = async () => {
        await api.logoutBase();
        localStorage.removeItem('last_est_id');
        setUser(null);
        setEstablishments([]);
        setCurrentEstablishment(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, establishments, currentEstablishment, 
            selectEstablishment, login, logout, register, loading, refreshUser 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
