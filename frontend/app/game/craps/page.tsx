'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { gamesService } from '@/lib/gamesService';
import { soundManager } from '@/lib/soundManager';
import DiceDisplay from './components/DiceDisplay';
import BetSelector from './components/BetSelector';
import ResultPanel from './components/ResultPanel';
import { BET_TYPES } from './utils/constants';
import { BetType } from './utils/types';

// Definiciones locales para reemplazar imports faltantes
const INITIAL_DICE_STATE = {
  dice1: 1,
  dice2: 1,
  sum: 2
};

const BET_OPTIONS = [
  { value: BET_TYPES.PASS, label: 'Pase (Pass Line)' },
  { value: BET_TYPES.DONT_PASS, label: 'No Pase (Don\'t Pass)' },
  { value: BET_TYPES.FIELD, label: 'Campo (Field)' },
  { value: BET_TYPES.ANY_CRAPS, label: 'Cualquier Craps' },
  { value: BET_TYPES.ANY_SEVEN, label: 'Cualquier 7' }
];

interface GameState {
  dice1: number;
  dice2: number;
  sum: number;
  point: number | null;
  message: string;
  rolling: boolean;
  showResult: boolean;
}

const getWinMessage = (won: boolean, amount: number, sum: number, point: number | null) => {
  if (won) return `¡Ganaste $${amount}! Sacaste ${sum}`;
  if (point) return `Punto establecido en ${point}. ¡Saca ${point} de nuevo para ganar!`;
  return `Perdiste. Sacaste ${sum}`;
};

export default function CrapsPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  
  // Estado del juego
  const [gameState, setGameState] = useState<GameState>({
    dice1: INITIAL_DICE_STATE.dice1,
    dice2: INITIAL_DICE_STATE.dice2,
    sum: INITIAL_DICE_STATE.sum,
    point: null,
    message: '¡Haz tu apuesta para comenzar!',
    rolling: false,
    showResult: false
  });

  // Estado de apuestas
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<BetType>('pass');
  const [lastResult, setLastResult] = useState<any>(null);

  // Redirección si no hay usuario
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleRoll = async () => {
    if (!user) return;
    
    const currentBalance = typeof user.balance === 'number' ? user.balance : parseFloat(user.balance || '0');
    
    if (betAmount < 1 || betAmount > currentBalance) {
      setGameState(prev => ({ ...prev, message: 'Apuesta inválida' }));
      return;
    }

    setGameState(prev => ({ ...prev, rolling: true, showResult: false, message: 'Lanzando dados...' }));
    setLastResult(null);
    
    // Efectos de sonido
    soundManager.playClickSound(); // Reemplazo de playDiceShakeSound

    try {
      // Llamada al servicio corregida
      const response = await gamesService.playCraps({
        gameType: 'dice',
        betType: selectedBet,
        amount: betAmount
      });
      
      // Simulación de animación
      setTimeout(() => {
        soundManager.playSlotSpinSound(); // Reemplazo de playDiceRollSound
        
        const result = response.result;
        const won = result.won;
        const winAmount = response.winAmount;
        
        // Merge winAmount into the result object so ResultPanel can access it
        const fullResult = { ...result, winAmount };
        
        setLastResult(fullResult);
        setGameState(prev => ({
          ...prev,
          dice1: result.dice1,
          dice2: result.dice2,
          sum: result.total,
          point: result.point || null,
          rolling: false,
          showResult: true,
          message: getWinMessage(won, winAmount, result.total, result.point)
        }));

        if (won) {
          soundManager.playWinChime();
          soundManager.playMoneyFall();
        } else {
          soundManager.playLosSound();
        }
        
        refreshUser();
      }, 1000);
    } catch (error: any) {
      console.error('Error:', error);
      setGameState(prev => ({ 
        ...prev, 
        rolling: false, 
        message: error.response?.data?.message || 'Error al jugar' 
      }));
    }
  };

  if (loading || !user) return null;

  const currentBalance = typeof user.balance === 'number' ? user.balance : parseFloat(user.balance || '0');

  const getHintMessage = () => {
    switch (selectedBet) {
      case 'pass':
        return gameState.point ? '¡Saca el punto antes que un 7!' : '¡Saca 7 u 11 para ganar!';
      case 'dont-pass':
        return gameState.point ? '¡Saca un 7 antes que el punto!' : '¡Saca 2 o 3 para ganar! (12 empata)';
      case 'field':
        return 'Ganas con 2, 3, 4, 9, 10, 11, 12';
      case 'any-craps':
        return 'Ganas con 2, 3, 12';
      case 'any-seven':
        return 'Ganas con 7';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-black pt-32 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-6xl font-black text-white mb-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] tracking-wider">
            🎲 CRAPS 🎲
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Panel Izquierdo - Mesa de Juego */}
          <div className="space-y-6">
            {/* Área de Dados */}
            <DiceDisplay 
              dice1={gameState.dice1} 
              dice2={gameState.dice2} 
              total={gameState.sum}
              rolling={gameState.rolling} 
            />

            {/* Información de Ayuda */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
              <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">Objetivo</h3>
              <p className="text-lg text-yellow-400 font-bold animate-pulse">
                {getHintMessage()}
              </p>
            </div>
          </div>

          {/* Panel Derecho - Controles */}
          <div className="space-y-6">
            {/* Selector de Apuestas */}
            <BetSelector 
              betType={selectedBet}
              onBetTypeChange={setSelectedBet}
              disabled={gameState.rolling}
            />

            {/* Control de Monto y Jugar */}
            <div className="space-y-4">
              <div className="bg-green-900/30 rounded-lg p-4 border-2 border-green-600">
                <label className="block text-white font-black mb-2 text-center text-lg">💵 APUESTA</label>
                <input
                  type="number"
                  min="1"
                  max={currentBalance}
                  value={betAmount === 0 ? '' : betAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBetAmount(val === '' ? 0 : parseInt(val));
                  }}
                  className="w-full px-4 py-3 border-4 border-yellow-500 rounded-lg text-gray-900 font-black text-2xl text-center bg-yellow-100"
                  disabled={gameState.rolling}
                />
              </div>

              <button
                onClick={handleRoll}
                disabled={gameState.rolling || betAmount < 1 || betAmount > currentBalance}
                className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:to-green-900 text-yellow-300 font-black py-6 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed text-3xl shadow-2xl border-4 border-yellow-400 transform hover:scale-105 active:scale-95 drop-shadow-lg"
                style={{textShadow: '0 0 10px rgba(0,0,0,0.8)'}}
              >
                {gameState.rolling ? '🎲 LANZANDO...' : '🎲 ¡LANZAR! 🎲'}
              </button>
            </div>

            {/* Panel de Resultados */}
            <ResultPanel 
              result={lastResult}
              betAmount={betAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
