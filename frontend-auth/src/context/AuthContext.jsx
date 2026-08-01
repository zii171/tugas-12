import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Saat aplikasi pertama kali dibuka, cek apakah ada token tersimpan di localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setInitializing(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user: loggedInUser } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setToken(accessToken);
    setUser(loggedInUser);

    return loggedInUser;
  }, []);

  const register = useCallback(async (email, name, password) => {
    const response = await api.post('/auth/register', { email, name, password });
    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    initializing,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
