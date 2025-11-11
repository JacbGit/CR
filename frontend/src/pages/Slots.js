import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { playGame } from '../services/gamesService';

const Slots = () => {
  const [betAmount, setBetAmount] = useState('');
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
      const data = await playGame('slots', {
        betAmount: parseFloat(betAmount)
      });
      setResult(data);
      setUser({ ...user, balance: data.newBalance });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al jugar');
    } finally {
      setLoading(false);
    }
  };

  const getSymbol = (symbol) => {
    const symbols = {
      'cherry': '🍒',
      'lemon': '🍋',
      'orange': '🍊',
      'plum': '🍇',
      'bell': '🔔',
      'bar': '💰',
      'seven': '7️⃣'
    };
    return symbols[symbol] || symbol;
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Slots 🎰</h1>
        <p>Balance: ${user?.balance?.toFixed(2)}</p>
        
        {error && <div className="error">{error}</div>}
        
        {result && (
          <div className={`result ${result.won ? 'win' : 'loss'}`}>
            <div className="slots-display">
              {result.result?.reels?.map((reel, idx) => (
                <div key={idx} className="reel">
                  {getSymbol(reel)}
                </div>
              ))}
            </div>
            <p>{result.won ? `¡Ganaste $${result.winAmount?.toFixed(2)}!` : 'Intenta de nuevo'}</p>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Girando...' : 'Girar'}
          </button>
        </form>

        <button onClick={() => navigate('/lobby')} className="btn-secondary">
          Volver al Lobby
        </button>
      </div>
    </div>
  );
};

export default Slots;
