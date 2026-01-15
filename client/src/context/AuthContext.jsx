import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in localStorage
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    // Verify token and get user data
                    // Ideally we would hit /api/auth/profile here, but for now we decode or just trust localstorage + API verify
                    // Let's implement fetch profile to be safe
                    const { data } = await axios.get('/api/auth/profile', config);
                    setUser({ ...data, token });
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post('/api/auth/register', userData);
            localStorage.setItem('token', data.token);
            setUser(data);
            return { success: true };
            return { success: true };
        } catch (error) {
            console.error("Registration Error Details:", error);
            const message = error.response?.data?.message || error.message || 'Registration failed';
            return {
                success: false,
                message: message
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
