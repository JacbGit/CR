import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { playGame } from '../services/gamesService';

const Craps = () => {
  const [betAmount, setBetAmount] = useState('');
  const [betType, setBetType] = useState('pass');
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
      const data = await playGame('craps', {
        betAmount: parseFloat(betAmount),
        betType
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
        <h1>Craps 🎲</h1>
        <p>Balance: ${user?.balance?.toFixed(2)}</p>
        
        {error && <div className="error">{error}</div>}
        
        {result && (
          <div className={`result ${result.won ? 'win' : 'loss'}`}>
            <h2>Dados: {result.result?.dice1} + {result.result?.dice2} = {result.result?.total}</h2>
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
            <label htmlFor="betType">Tipo de apuesta</label>
            <select
              id="betType"
              value={betType}
              onChange={(e) => setBetType(e.target.value)}
            >
              <option value="pass">Pass Line</option>
              <option value="dontpass">Don't Pass</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Lanzando...' : 'Lanzar Dados'}
          </button>
        </form>

        <button onClick={() => navigate('/lobby')} className="btn-secondary">
          Volver al Lobby
        </button>
      </div>
    </div>
  );
};

export default Craps;
