'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { soundManager } from '@/lib/soundManager';
import { RouletteWheel } from './components/RouletteWheel';
import { BettingTable } from './components/BettingTable';
import { CHIP_VALUES, RED_NUMBERS } from './utils/constants';
import { calculateWinnings, getTotalBet } from './utils/gameLogic';

export default function EuropeanRoulette() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  
  const [balance, setBalance] = useState(0);
  const [bets, setBets] = useState<Map<string, number>>(new Map());
  const [selectedChip, setSelectedChip] = useState(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHistory, setShowHistory] = useState<number[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setBalance(typeof user.balance === 'number' ? user.balance : parseFloat(user.balance || '0'));
    }
  }, [user, loading, router]);

  const placeBet = (betKey: string, amount: number) => {
    if (isSpinning) {
      setMessage('Espera a que termine el giro');
      return;
    }
    
    if (balance < amount) {
      setMessage('Saldo insuficiente');
      return;
    }

    const newBets = new Map(bets);
    const currentBet = newBets.get(betKey) || 0;
    newBets.set(betKey, currentBet + amount);
    setBets(newBets);
    setBalance(balance - amount);
    setMessage('');
  };

  const clearBets = () => {
    if (isSpinning) return;
    
    const totalRefund = getTotalBet(bets);
    setBalance(balance + totalRefund);
    setBets(new Map());
    setLastWin(0);
    setMessage('Apuestas eliminadas');
  };

  const spin = () => {
    if (isSpinning) return;
    if (getTotalBet(bets) === 0) {
      setMessage('Coloca una apuesta primero');
      return;
    }

    setIsSpinning(true);
    setMessage('');
    
    soundManager.initializeAudio();
    soundManager.playRouletteSpinning();
    
    const randomNumber = Math.floor(Math.random() * 37);
    setWinningNumber(randomNumber);
  };

  const onSpinEnd = async () => {
    if (winningNumber !== null) {
      const winnings = calculateWinnings(winningNumber, bets);
      const newBalance = balance + winnings;
      
      setBalance(newBalance);
      setLastWin(winnings);
      
      if (winnings > 0) {
        setMessage(`¡Ganaste $${winnings}! Número: ${winningNumber}`);
        soundManager.playJackpotSound();
        soundManager.playMoneyFall();
      } else {
        setMessage(`Número ganador: ${winningNumber}. Mejor suerte la próxima vez`);
        soundManager.playLosSound();
      }
      
      setShowHistory([winningNumber, ...showHistory.slice(0, 9)]);
      setBets(new Map());
      
      // Actualizar balance en el servidor
      await refreshUser();
    }
    
    setIsSpinning(false);
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-green-900 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-yellow-400 text-center mb-8 shadow-text">
          Ruleta Europea
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel izquierdo - Rueda */}
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-gradient-to-br from-amber-800 to-amber-900 p-8 rounded-2xl shadow-2xl">
              <RouletteWheel 
                isSpinning={isSpinning} 
                winningNumber={winningNumber}
                onSpinEnd={onSpinEnd}
              />
              
              {/* Controles */}
              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
                <button
                  onClick={() => setShowHistory([])}
                  className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors"
                  title="Información"
                >
                  ℹ️
                </button>
              </div>

              {/* Chips de selección */}
              <div className="mt-6 flex gap-3 justify-center">
                {CHIP_VALUES.map((value) => (
                  <button
                    key={value}
                    onClick={() => setSelectedChip(value)}
                    className={`relative w-16 h-16 rounded-full border-4 font-bold text-white transition-all ${
                      selectedChip === value 
                        ? 'scale-110 shadow-lg' 
                        : 'hover:scale-105'
                    } ${
                      value === 1 ? 'bg-blue-600 border-blue-800' :
                      value === 5 ? 'bg-red-600 border-red-800' :
                      value === 25 ? 'bg-green-600 border-green-800' :
                      'bg-purple-600 border-purple-800'
                    }`}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>

            {/* Historial */}
            {showHistory.length > 0 && (
              <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white font-bold mb-2">Últimos números:</h3>
                <div className="flex gap-2">
                  {showHistory.map((num, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        num === 0 ? 'bg-green-600' :
                        RED_NUMBERS.includes(num) ? 'bg-red-600' : 'bg-black'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel derecho - Mesa de apuestas */}
          <div className="flex-1">
            <BettingTable 
              bets={bets}
              onPlaceBet={placeBet}
              selectedChip={selectedChip}
            />
            
            {/* Panel de control */}
            <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="text-white">
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-2xl font-bold text-yellow-400 ml-2">${balance}</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-400">Apuesta Total:</span>
                  <span className="text-2xl font-bold text-orange-400 ml-2">${getTotalBet(bets)}</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-400">Última Ganancia:</span>
                  <span className="text-2xl font-bold text-green-400 ml-2">${lastWin}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={spin}
                  disabled={isSpinning || getTotalBet(bets) === 0}
                  className={`flex-1 py-4 px-6 rounded-lg font-bold text-white text-xl transition-all ${
                    isSpinning || getTotalBet(bets) === 0
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transform hover:scale-105'
                  }`}
                >
                  {isSpinning ? 'GIRANDO...' : 'GIRAR'}
                </button>
                <button
                  onClick={clearBets}
                  disabled={isSpinning}
                  className="py-4 px-6 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-white transition-colors disabled:bg-gray-600"
                >
                  LIMPIAR
                </button>
              </div>
              
              {message && (
                <div className={`mt-4 p-3 rounded-lg text-center font-bold ${
                  message.includes('Ganaste') 
                    ? 'bg-green-600 text-white' 
                    : 'bg-yellow-600 text-gray-900'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shadow-text {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .clip-path-triangle {
          clip-path: polygon(20% 0%, 80% 0%, 50% 100%);
        }
      `}</style>
    </div>
  );
}
