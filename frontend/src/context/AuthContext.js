import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    
    // Actualizar saldo periódicamente
    const interval = setInterval(async () => {
      if (currentUser) {
        try {
          const response = await api.get('/users/profile');
          const updatedUser = { ...currentUser, balance: response.data.balance };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Error al actualizar saldo:', error);
        }
      }
    }, 30000); // cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
  };

  const register = async (userData) => {
    await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateBalance = (newBalance) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
