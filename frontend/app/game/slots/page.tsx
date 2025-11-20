'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { gamesService } from '@/lib/gamesService';
import { soundManager } from '@/lib/soundManager';
import SlotMachine from './components/SlotMachine';
import PrizeTable from './components/PrizeTable';
import ResultDisplay from './components/ResultDisplay';
import { SYMBOL_EMOJI_MAP } from './utils/constants';
import { getSymbolEmoji, getWinMessage } from './utils/gameLogic';

// Definiciones locales
const INITIAL_SLOT_STATE = {
  displaySymbols: ['🎰', '🎰', '🎰'],
  stoppedReels: [false, false, false]
};

interface SlotState {
  spinning: boolean;
  showingResult: boolean;
  displaySymbols: string[];
  stoppedReels: boolean[];
  result: any;
}

export default function SlotsPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  
  // Estado del juego
  const [slotState, setSlotState] = useState<SlotState>({
    spinning: false,
    showingResult: false,
    displaySymbols: INITIAL_SLOT_STATE.displaySymbols,
    stoppedReels: INITIAL_SLOT_STATE.stoppedReels,
    result: null
  });

  // Estado de apuestas y UI
  const [betAmount, setBetAmount] = useState(10);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSpin = async () => {
    if (!user) return;
    
    const currentBalance = typeof user.balance === 'number' ? user.balance : parseFloat(user.balance || '0');

    if (betAmount < 1 || betAmount > currentBalance) {
      alert('Apuesta inválida');
      return;
    }

    // Reset state
    setSlotState({
      spinning: true,
      showingResult: false,
      displaySymbols: INITIAL_SLOT_STATE.displaySymbols,
      stoppedReels: [false, false, false],
      result: null
    });
    
    soundManager.initializeAudio();
    soundManager.playSlotSpinSound();

    try {
      const response = await gamesService.playSlots(betAmount);
      const symbols = response.result?.symbols?.map((s: string) => getSymbolEmoji(s)) || INITIAL_SLOT_STATE.displaySymbols;
      
      // Animación de parada de rodillos
      setTimeout(() => {
        setSlotState(prev => ({
          ...prev,
          stoppedReels: [true, false, false],
          displaySymbols: [symbols[0], '🎰', '🎰']
        }));
      }, 1500);
      
      setTimeout(() => {
        setSlotState(prev => ({
          ...prev,
          stoppedReels: [true, true, false],
          displaySymbols: [symbols[0], symbols[1], '🎰']
        }));
      }, 2500);
      
      setTimeout(() => {
        // Map backend response to SlotsResult interface
        const gameResult = {
          won: response.result.won,
          symbols: response.result.symbols,
          winAmount: response.winAmount,
          winType: response.result.winType,
          multiplier: response.result.multiplier,
          betAmount: response.betAmount
        };

        setSlotState(prev => ({
          ...prev,
          spinning: false,
          showingResult: true,
          stoppedReels: [true, true, true],
          displaySymbols: symbols,
          result: gameResult
        }));
        
        // Sonidos de resultado
        if (gameResult.won) {
          if (gameResult.winType === 'jackpot') {
            soundManager.playJackpotSound();
          } else {
            soundManager.playWinChime();
          }
          soundManager.playMoneyFall();
        } else {
          soundManager.playLosSound();
        }
        
        refreshUser();
      }, 3500);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error al jugar');
      setSlotState(prev => ({ ...prev, spinning: false, stoppedReels: [false, false, false] }));
    }
  };

  if (loading || !user) return null;

  const currentBalance = typeof user.balance === 'number' ? user.balance : parseFloat(user.balance || '0');

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-black to-black pt-32 pb-4 px-4 flex flex-col">
        <div className="container mx-auto max-w-3xl flex-1 flex flex-col justify-between">
          {/* Header */}
          <div className="text-center mb-4 animate-fade-in-up">
            <h1 className="casino-title text-6xl text-yellow-300 drop-shadow-lg mb-2" style={{textShadow: '0 0 20px rgba(255,200,0,0.8), 0 0 40px rgba(255,100,0,0.6)'}}>
              🎰 Jackpot 🎰
            </h1>
          </div>

          {/* Máquina de Slots Principal */}
          <div className="flex-1 flex flex-col justify-center items-center mb-4">
            <SlotMachine 
              stoppedReels={slotState.stoppedReels}
              displaySymbols={slotState.displaySymbols}
              spinning={slotState.spinning}
              betAmount={betAmount}
              onBetAmountChange={setBetAmount}
              currentBalance={currentBalance}
              onSpin={handleSpin}
            />

            {/* Resultado */}
            <ResultDisplay 
              result={slotState.result}
              showingResult={slotState.showingResult}
              betAmount={betAmount}
            />
          </div>

          {/* Tabla de Premios */}
          <PrizeTable />
        </div>
      </div>
    </>
  );
}
