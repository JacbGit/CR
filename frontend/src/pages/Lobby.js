import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Lobby = () => {
  const { user } = useAuth();

  const games = [
    { name: 'Ruleta', path: '/roulette', icon: '🎰', description: 'Apuesta a tu número favorito' },
    { name: 'Craps', path: '/craps', icon: '🎲', description: 'Lanza los dados y gana' },
    { name: 'Slots', path: '/slots', icon: '🎰', description: 'Máquinas tragamonedas' }
  ];

  return (
    <div className="container">
      <div className="card">
        <h1>Bienvenido, {user?.username}!</h1>
        <p>Balance: ${user?.balance?.toFixed(2) || '0.00'}</p>
        <h2>Selecciona un juego</h2>
        <div className="games-grid">
          {games.map((game) => (
            <Link to={game.path} key={game.path} className="game-card">
              <div className="game-icon">{game.icon}</div>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </Link>
          ))}
        </div>
        <Link to="/history" className="btn-secondary">
          Ver Historial
        </Link>
      </div>
    </div>
  );
};

export default Lobby;
