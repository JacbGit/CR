import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { playGame } from '../services/gamesService';

const Roulette = () => {
  const [betAmount, setBetAmount] = useState('');
  const [betNumber, setBetNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handlePlay = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await playGame('roulette', {
        betAmount: parseFloat(betAmount),
        betNumber: parseInt(betNumber)
      });
      setResult(data);
      setUser({ ...user, balance: data.newBalance });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al jugar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Ruleta 🎰</h1>
        <p>Balance: ${user?.balance?.toFixed(2)}</p>
        
        {error && <div className="error">{error}</div>}
        
        {result && (
          <div className={`result ${result.won ? 'win' : 'loss'}`}>
            <h2>Número ganador: {result.result}</h2>
            <p>{result.won ? `¡Ganaste $${result.winAmount?.toFixed(2)}!` : 'Perdiste'}</p>
            <p>Nuevo balance: ${result.newBalance?.toFixed(2)}</p>
          </div>
        )}

        <form onSubmit={handlePlay}>
          <div className="form-group">
            <label htmlFor="betAmount">Cantidad a apostar</label>
            <input
              type="number"
              id="betAmount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min="1"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="betNumber">Número (0-36)</label>
            <input
              type="number"
              id="betNumber"
              value={betNumber}
              onChange={(e) => setBetNumber(e.target.value)}
              min="0"
              max="36"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Jugando...' : 'Jugar'}
          </button>
        </form>

        <button onClick={() => navigate('/lobby')} className="btn-secondary">
          Volver al Lobby
        </button>
      </div>
    </div>
  );
};

export default Roulette;
