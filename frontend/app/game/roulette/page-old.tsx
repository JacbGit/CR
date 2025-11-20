'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { soundManager } from '@/lib/soundManager';

// Tipos de apuestas
type BetType = {
  type: 'number' | 'red' | 'black' | 'even' | 'odd' | 'first12' | 'second12' | 'third12' | 
        'first18' | 'second18' | 'column1' | 'column2' | 'column3' | 'twoToOne';
  numbers: number[];
  payout: number;
  position?: { row: number; col: number };
};

// Configuración de la ruleta
const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// Componente de la rueda
const RouletteWheel: React.FC<{ isSpinning: boolean; winningNumber: number | null; onSpinEnd: () => void }> = ({ 
  isSpinning, 
  winningNumber, 
  onSpinEnd 
}) => {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      const numberIndex = ROULETTE_NUMBERS.indexOf(winningNumber);
      const anglePerNumber = 360 / 37;
      const targetAngle = numberIndex * anglePerNumber;
      const extraSpins = 5; // Vueltas adicionales para efecto
      const finalRotation = 360 * extraSpins + targetAngle + (Math.random() * 5 - 2.5);
      
      setRotation(finalRotation);
      
      setTimeout(() => {
        onSpinEnd();
      }, 4000);
    }
  }, [isSpinning, winningNumber, onSpinEnd]);

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-green-600';
    return RED_NUMBERS.includes(num) ? 'bg-red-600' : 'bg-black';
  };

  return (
    <div className="relative w-80 h-80">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 shadow-2xl"></div>
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-800">
        <div 
          className={`relative w-full h-full rounded-full transition-transform ${isSpinning ? 'duration-[4000ms] ease-out' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {ROULETTE_NUMBERS.map((num, index) => {
            const angle = (index * 360) / 37;
            const isRed = RED_NUMBERS.includes(num);
            
            return (
              <div
                key={index}
                className="absolute w-full h-full"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-8 h-32 ${
                  num === 0 ? 'bg-green-600' : isRed ? 'bg-red-600' : 'bg-gray-900'
                } clip-path-triangle`}>
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-sm">
                    {num}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-900"></div>
      <div className="absolute inset-20 rounded-full bg-blue-900"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-500"></div>
      
      {/* Indicador de la bola */}
      {isSpinning && (
        <div 
          className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-lg animate-bounce"
          style={{ animationDuration: '0.5s' }}
        ></div>
      )}
    </div>
  );
};

// Componente de la mesa de apuestas
const BettingTable: React.FC<{
  bets: Map<string, number>;
  onPlaceBet: (betKey: string, amount: number) => void;
  selectedChip: number;
}> = ({ bets, onPlaceBet, selectedChip }) => {
  
  const handleCellClick = (betKey: string) => {
    onPlaceBet(betKey, selectedChip);
  };

  const getCellColor = (num: number) => {
    if (num === 0) return 'bg-green-600 hover:bg-green-500';
    return RED_NUMBERS.includes(num) ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-900 hover:bg-gray-800';
  };

  const renderBetChips = (betKey: string) => {
    const amount = bets.get(betKey) || 0;
    if (amount === 0) return null;
    
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="chip-shadow bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-2 border-yellow-600 smooth-transition hover:scale-110">
          ${amount}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-green-800 p-6 rounded-lg shadow-2xl">
      <div className="grid gap-1">
        <div 
          className="relative cursor-pointer mb-4"
          onClick={() => handleCellClick('0')}
        >
          <div className={`${getCellColor(0)} h-24 flex items-center justify-center rounded text-white font-bold text-xl smooth-transition hover:scale-105`}>
            0
          </div>
          {renderBetChips('0')}
        </div>

        <div className="grid grid-cols-12 gap-1">
          {[
            [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
            [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
            [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
          ].map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((num) => (
                <div 
                  key={num}
                  className="relative cursor-pointer"
                  onClick={() => handleCellClick(num.toString())}
                >
                  <div className={`${getCellColor(num)} h-10 flex items-center justify-center rounded text-white font-bold smooth-transition hover:scale-105`}>
                    {num}
                  </div>
                  {renderBetChips(num.toString())}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-1 mt-2">
          {[1, 2, 3].map((col) => (
            <div 
              key={`col${col}`}
              className="col-span-4 relative cursor-pointer"
              onClick={() => handleCellClick(`column${col}`)}
            >
              <div className="bg-green-700 hover:bg-green-600 h-8 flex items-center justify-center rounded text-white font-bold transition-colors">
                2:1
              </div>
              {renderBetChips(`column${col}`)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-1 mt-2">
          <div 
            className="col-span-4 relative cursor-pointer"
            onClick={() => handleCellClick('first12')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              1st 12
            </div>
            {renderBetChips('first12')}
          </div>
          <div 
            className="col-span-4 relative cursor-pointer"
            onClick={() => handleCellClick('second12')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              2nd 12
            </div>
            {renderBetChips('second12')}
          </div>
          <div 
            className="col-span-4 relative cursor-pointer"
            onClick={() => handleCellClick('third12')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              3rd 12
            </div>
            {renderBetChips('third12')}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-1 mt-2">
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('first18')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              1-18
            </div>
            {renderBetChips('first18')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('even')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              EVEN
            </div>
            {renderBetChips('even')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('red')}
          >
            <div className="bg-red-700 hover:bg-red-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              RED
            </div>
            {renderBetChips('red')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('black')}
          >
            <div className="bg-gray-800 hover:bg-gray-700 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              BLACK
            </div>
            {renderBetChips('black')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('odd')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              ODD
            </div>
            {renderBetChips('odd')}
          </div>
          <div 
            className="relative cursor-pointer"
            onClick={() => handleCellClick('second18')}
          >
            <div className="bg-green-700 hover:bg-green-600 h-10 flex items-center justify-center rounded text-white font-bold transition-colors">
              19-36
            </div>
            {renderBetChips('second18')}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
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

  const chipValues = [1, 5, 25, 100];

  const getTotalBet = () => {
    let total = 0;
    bets.forEach((value) => {
      total += value;
    });
    return total;
  };

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
    
    const totalRefund = getTotalBet();
    setBalance(balance + totalRefund);
    setBets(new Map());
    setLastWin(0);
    setMessage('Apuestas eliminadas');
  };

  const spin = () => {
    if (isSpinning) return;
    if (getTotalBet() === 0) {
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

  const calculateWinnings = (num: number): number => {
    let totalWinnings = 0;

    bets.forEach((betAmount, betKey) => {
      // Apuesta directa al número
      if (betKey === num.toString()) {
        totalWinnings += betAmount * 36; // 35:1 + apuesta original
      }
      
      // Rojo/Negro
      if (betKey === 'red' && RED_NUMBERS.includes(num)) {
        totalWinnings += betAmount * 2;
      }
      if (betKey === 'black' && BLACK_NUMBERS.includes(num)) {
        totalWinnings += betAmount * 2;
      }
      
      // Par/Impar
      if (betKey === 'even' && num !== 0 && num % 2 === 0) {
        totalWinnings += betAmount * 2;
      }
      if (betKey === 'odd' && num % 2 === 1) {
        totalWinnings += betAmount * 2;
      }
      
      // 1-18 / 19-36
      if (betKey === 'first18' && num >= 1 && num <= 18) {
        totalWinnings += betAmount * 2;
      }
      if (betKey === 'second18' && num >= 19 && num <= 36) {
        totalWinnings += betAmount * 2;
      }
      
      // Docenas
      if (betKey === 'first12' && num >= 1 && num <= 12) {
        totalWinnings += betAmount * 3;
      }
      if (betKey === 'second12' && num >= 13 && num <= 24) {
        totalWinnings += betAmount * 3;
      }
      if (betKey === 'third12' && num >= 25 && num <= 36) {
        totalWinnings += betAmount * 3;
      }
      
      // Columnas
      if (betKey === 'column1' && num > 0 && num % 3 === 1) {
        totalWinnings += betAmount * 3;
      }
      if (betKey === 'column2' && num > 0 && num % 3 === 2) {
        totalWinnings += betAmount * 3;
      }
      if (betKey === 'column3' && num > 0 && num % 3 === 0) {
        totalWinnings += betAmount * 3;
      }
    });

    return totalWinnings;
  };

  const onSpinEnd = async () => {
    if (winningNumber !== null) {
      const winnings = calculateWinnings(winningNumber);
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
                {chipValues.map((value) => (
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
                  <span className="text-2xl font-bold text-orange-400 ml-2">${getTotalBet()}</span>
                </div>
                <div className="text-white">
                  <span className="text-gray-400">Última Ganancia:</span>
                  <span className="text-2xl font-bold text-green-400 ml-2">${lastWin}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={spin}
                  disabled={isSpinning || getTotalBet() === 0}
                  className={`flex-1 py-4 px-6 rounded-lg font-bold text-white text-xl transition-all ${
                    isSpinning || getTotalBet() === 0
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
