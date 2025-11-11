import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Roulette from './pages/Roulette';
import Craps from './pages/Craps';
import Slots from './pages/Slots';
import History from './pages/History';
import Header from './components/Header';
import './styles/index.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="container">Cargando...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby" element={<PrivateRoute><Lobby /></PrivateRoute>} />
        <Route path="/game/roulette" element={<PrivateRoute><Roulette /></PrivateRoute>} />
        <Route path="/game/craps" element={<PrivateRoute><Craps /></PrivateRoute>} />
        <Route path="/game/slots" element={<PrivateRoute><Slots /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/lobby" />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
