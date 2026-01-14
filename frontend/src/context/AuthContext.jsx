import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, cartAPI } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authAPI.getMe()
                .then(data => {
                    if (data.username) {
                        setUser(data);
                    } else {
                        localStorage.removeItem('token');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        const data = await authAPI.login(credentials);
        if (data.token) {
            localStorage.setItem('token', data.token);
            setUser(data.user || data);
            await cartAPI.merge();
            return data;
        } else {
            throw new Error(data.message || 'Invalid credentials');
        }
    };

    const register = async (userData) => {
        const data = await authAPI.register(userData);
        if (data.token) {
            localStorage.setItem('token', data.token);
            setUser(data.user || data);
            await cartAPI.merge();
            return data;
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
