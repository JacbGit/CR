'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gamesService } from '@/lib/gamesService';
import { useAuth } from '@/context/AuthContext';
import { BingoCard } from './components/BingoCard';
import { BingoControls } from './components/BingoControls';
import { BallDisplay } from './components/BallDisplay';
import { PatternSelector } from './components/PatternSelector';
import { PATTERN_INFO } from './constants';
import type { BingoPattern, BingoGameResult } from './types';

export default function BingoPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  const [card, setCard] = useState<number[]>([]);
  const [markedPositions, setMarkedPositions] = useState<number[]>([]);
  const [drawnBalls, setDrawnBalls] = useState<number[]>([]);
  const [currentBall, setCurrentBall] = useState<number | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<BingoPattern>('line_horizontal');
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<BingoGameResult | null>(null);
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (user) {
      setBalance(Number(user.balance));
    }
  }, [user]);

  // Generar cartón inicial
  useEffect(() => {
    generateNewCard();
  }, []);

  const generateNewCard = () => {
    const newCard = generateBingoCard();
    setCard(newCard);
    setMarkedPositions([12]); // Centro siempre marcado
    setDrawnBalls([]);
    setCurrentBall(null);
    setGameResult(null);
    setMessage('');
  };

  const generateBingoCard = (): number[] => {
    const card: number[] = [];
    const ranges = [
      [1, 15],   // B
      [16, 30],  // I
      [31, 45],  // N
      [46, 60],  // G
      [61, 75],  // O
    ];

    // Generar números únicos por columna
    for (let col = 0; col < 5; col++) {
      const [min, max] = ranges[col];
      const available = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      const columnNumbers: number[] = [];
      
      // Tomar 5 números aleatorios únicos
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * available.length);
        columnNumbers.push(available[randomIndex]);
        available.splice(randomIndex, 1);
      }
      
      // Agregar los números de esta columna al cartón (por filas)
      for (let row = 0; row < 5; row++) {
        const index = row * 5 + col;
        if (index === 12) {
          card[12] = 0; // Centro libre
        } else {
          card[index] = columnNumbers[row];
        }
      }
    }
    
    return card;
  };

  const handlePlay = async () => {
    if (betAmount > balance) {
      setMessage('¡Fondos insuficientes!');
      return;
    }
    if (isPlaying) return;

    setMessage('Sorteando bolas...');
    setIsPlaying(true);
    setDrawnBalls([]);
    setCurrentBall(null);
    setMarkedPositions([12]); // Reset, solo el centro
    
    try {
      const result = await gamesService.playBingo({
        amount: betAmount,
        pattern: selectedPattern,
        customCard: card, // ✅ ENVIAR EL CARTÓN AL BACKEND
      });

      // Guardar el resultado completo del backend
      setGameResult(result.result);
      
      // Animar el sorteo de bolas con los datos correctos del backend
      animateBallDraw(
        result.result.drawnBalls, 
        result.result.markedPositions,
        result.winAmount,
        result.result.completedPattern, // ✅ Usar completedPattern del backend
        result.result.allCompletedPatterns || []
      );

    } catch (error: any) {
      console.error('Bingo error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al jugar. Intenta de nuevo.';
      setMessage(errorMessage);
      setIsPlaying(false);
    }
  };

  const animateBallDraw = (
    balls: number[], 
    finalMarkedPositions: number[],
    winAmount: number,
    completedPattern: boolean, // ✅ Añadido
    allCompletedPatterns: BingoPattern[]
  ) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= balls.length) {
        clearInterval(interval);
        setIsPlaying(false);
        refreshUser();
        
        // ✅ Mensaje final basado en completedPattern del backend
        if (completedPattern) {
          const patternsText = allCompletedPatterns.length > 1
            ? `¡Completaste ${allCompletedPatterns.length} patrones!`
            : `Patrón: ${PATTERN_INFO[selectedPattern].name}`;
          
          setMessage(`🎉 ¡BINGO! ${patternsText} - Ganaste $${winAmount.toFixed(2)} en ${balls.length} bolas`);
        } else {
          setMessage(`❌ No completaste el patrón "${PATTERN_INFO[selectedPattern].name}" en 75 bolas. ¡Intenta de nuevo!`);
        }
        return;
      }

      const ball = balls[index];
      setCurrentBall(ball);
      setDrawnBalls(prev => [...prev, ball]);

      // Marcar en el cartón si corresponde
      const posInCard = card.indexOf(ball);
      if (posInCard !== -1) {
        setMarkedPositions(prev =>
          prev.includes(posInCard) ? prev : [...prev, posInCard]
        );
      }

      index++;
    }, 100); // Velocidad de animación (100ms por bola)
  };

  const handleNewGame = () => {
    generateNewCard();
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pt-32 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-2xl tracking-wider mb-2">
              🎱 BINGO ROYALE
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
          </div>
          
          <div className="flex items-center gap-6 bg-black/40 p-4 rounded-2xl border border-yellow-500/20 backdrop-blur-md shadow-xl">
            <button 
              onClick={() => router.push('/lobby')}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-200 rounded-xl font-bold transition-all border border-gray-600 hover:border-gray-500 shadow-lg text-sm uppercase tracking-wide"
            >
              Salir
            </button>
          </div>
        </header>

        {message && (
          <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl z-50 animate-bounce ${
            gameResult?.completedPattern ? 'bg-green-600' : isPlaying ? 'bg-blue-600' : 'bg-red-600'
          } text-white font-bold`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Controles */}
          <div className="space-y-6">
            <PatternSelector
              selectedPattern={selectedPattern}
              onSelectPattern={setSelectedPattern}
              disabled={isPlaying}
            />
            
            <BingoControls
              betAmount={betAmount}
              onBetAmountChange={setBetAmount}
              onPlay={handlePlay}
              onNewCard={handleNewGame}
              isPlaying={isPlaying}
              disabled={isPlaying}
              balance={balance}
            />

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">
                Patrón: {PATTERN_INFO[selectedPattern].name}
              </h3>
              <p className="text-sm text-gray-300 mb-2">
                {PATTERN_INFO[selectedPattern].description}
              </p>
              <p className="text-lg font-bold text-green-400">
                Pago base: {PATTERN_INFO[selectedPattern].multiplier}x
              </p>
              <p className="text-xs text-gray-400 mt-2">
                + Bonus por completar con pocas bolas
              </p>
            </div>

            {/* ✅ Mostrar patrones completados si existen */}
            {gameResult?.allCompletedPatterns && gameResult.allCompletedPatterns.length > 0 && (
              <div className="bg-green-900/50 p-6 rounded-xl border border-green-500">
                <h3 className="text-xl font-bold mb-3 text-green-400">
                  🎉 Patrones Completados
                </h3>
                <div className="space-y-2">
                  {gameResult.allCompletedPatterns.map((pattern) => (
                    <div key={pattern} className="bg-green-800/50 p-2 rounded-lg">
                      <div className="font-bold">{PATTERN_INFO[pattern].name}</div>
                      <div className="text-xs text-green-300">{PATTERN_INFO[pattern].description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna central - Cartón */}
          <div className="flex flex-col items-center space-y-6">
            <BingoCard
              card={card}
              markedPositions={markedPositions}
              highlightedPositions={gameResult?.markedPositions || []}
            />
            
            {currentBall && (
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Última bola</div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl animate-bounce border-4 border-white">
                  {currentBall}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Bolas sorteadas */}
          <div>
            <BallDisplay
              drawnBalls={drawnBalls}
              currentBall={currentBall}
              totalBalls={gameResult?.ballsDrawn || 75}
            />
          </div>
        </div>
      </div>
    </div>
  );
}