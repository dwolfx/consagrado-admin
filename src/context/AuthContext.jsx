import { createContext, useState, useEffect, useContext } from 'react';
import { supabase, api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // User session state
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserDetails = async (sessionUser) => {
        const role = sessionUser.user_metadata?.role || 'owner';
        let estId = sessionUser.user_metadata?.establishmentId || null;
        let estName = null;
        let hasEst = false;

        if (role !== 'super') {
            const { data } = await supabase.from('establishments').select('id, name').eq('owner_id', sessionUser.id).limit(1);
            if (data && data.length > 0) {
                estId = data[0].id;
                estName = data[0].name;
                hasEst = true;
            }
        } else {
            hasEst = true; // Super admins bypass
        }

        setUser({
            id: sessionUser.id,
            email: sessionUser.email,
            name: sessionUser.user_metadata?.name || 'Usuário',
            role,
            establishmentId: estId,
            establishmentName: estName,
            hasEstablishment: hasEst
        });
        setLoading(false);
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
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
