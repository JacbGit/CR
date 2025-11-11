import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameHistory } from '../services/gamesService';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getGameHistory();
        setHistory(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el historial');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="card">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Historial de Juegos</h1>
        
        {error && <div className="error">{error}</div>}
        
        {history.length === 0 ? (
          <p>No hay juegos en el historial</p>
        ) : (
          <div className="history-list">
            {history.map((game) => (
              <div key={game.id} className={`history-item ${game.won ? 'win' : 'loss'}`}>
                <div className="history-header">
                  <span className="game-name">{game.gameType}</span>
                  <span className="game-date">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="history-details">
                  <span>Apuesta: ${game.betAmount?.toFixed(2)}</span>
                  {game.won ? (
                    <span className="win-amount">Ganancia: ${game.winAmount?.toFixed(2)}</span>
                  ) : (
                    <span className="loss-amount">Pérdida: ${game.betAmount?.toFixed(2)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => navigate('/lobby')} className="btn-secondary">
          Volver al Lobby
        </button>
      </div>
    </div>
  );
};

export default History;
