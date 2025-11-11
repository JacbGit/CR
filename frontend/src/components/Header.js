import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/lobby" className="logo">
          Casino Royale
        </Link>
        <nav className="nav">
          <Link to="/lobby">Lobby</Link>
          <Link to="/history">Historial</Link>
          <span className="balance">Balance: ${user.balance?.toFixed(2)}</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
