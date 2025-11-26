'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gamesService } from '@/lib/gamesService';
import { useAuth } from '@/context/AuthContext';

// Import from the local adapted library
import { 
  RouletteTable, 
  RouletteWheel, 
  ChipList, 
  useRoulette 
} from './index';

// Chip images
const chipsMap = {
  '1': '/images/chips/white-chip.png',
  '10': '/images/chips/blue-chip.png',
  '100': '/images/chips/black-chip.png',
  '500': '/images/chips/cyan-chip.png',
};

const BET_MAPPING: Record<string, string> = {
  '1ST_DOZEN': 'first12',
  '2ND_DOZEN': 'second12',
  '3RD_DOZEN': 'third12',
  '1ST_COLUMN': 'column1',
  '2ND_COLUMN': 'column2',
  '3RD_COLUMN': 'column3',
  '19_TO_36': 'second18',
  '1_TO_18': 'first18',
  'ODD': 'odd',
  'EVEN': 'even',
  'RED': 'red',
  'BLACK': 'black',
};

export default function RoulettePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { bets, total, onBet, clearBets } = useRoulette();
  
  const [selectedChip, setSelectedChip] = useState<string>('1');
  const [winningBet, setWinningBet] = useState<string>('-1');
  const [wheelStart, setWheelStart] = useState(false);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setBalance(Number(user.balance));
    }
  }, [user]);

  const handleSpin = async () => {
    if (total === 0) {
      setMessage('¡Por favor realiza una apuesta primero!');
      return;
    }
    if (total > balance) {
      setMessage('¡Fondos insuficientes!');
      return;
    }
    if (wheelStart) return;

    setMessage('');
    
    try {
      // Prepare payload for API
      // Convert bets object to array expected by backend
      const betArray: { betKey: string; amount: number }[] = [];

      for (const [id, bet] of Object.entries(bets)) {
        let betKey = id;
        
        // Check if it's a mapped bet type
        if (BET_MAPPING[id]) {
          betKey = BET_MAPPING[id];
        } else if (isNaN(Number(id)) && !id.includes('-')) {
          // If it's not a number, not in our mapping, and not a hyphenated multi-bet
          console.warn(`Unsupported bet type: ${id}`);
          setMessage(`Tipo de apuesta no soportado: ${id}. Solo se soportan números individuales, splits y apuestas externas.`);
          return;
        }
        // If it is a number (e.g. "0", "36") or a multi-bet (e.g. "1-2"), we keep it as is.

        betArray.push({
          betKey: betKey,
          amount: (bet as any).amount
        });
      }

      const payload = {
        bets: betArray
      };

      // Call backend
      const result = await gamesService.playRoulette(payload);
      
      // Start animation
      // The backend returns 'result' object which contains winningNumber
      setWinningBet(result.result.winningNumber.toString());
      setWheelStart(true);

      // We'll handle the payout and balance update in onSpinningEnd

    } catch (error: any) {
      console.error('Spin error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al girar. Por favor intenta de nuevo.';
      setMessage(errorMessage);
      setWheelStart(false);
    }
  };

  const handleEndSpin = (winner: string) => {
    setWheelStart(false);
    refreshUser(); // Update balance from backend
    
    // We can also calculate local payout if we want to show a message immediately
    // But the backend already processed it.
    // We can fetch the last game history to see the payout or trust the user balance update.
    // For now, let's just show the winner.
    setMessage(`¡La bola cayó en ${winner}!`);
    
    // Clear bets after a delay or let user clear them?
    // Usually in roulette you might want to re-bet, so we keep them.
    // But if we want to clear:
    // clearBets();
  };

  const handleClear = () => {
    if (!wheelStart) {
      clearBets();
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900 via-black to-black text-white pt-32 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-2xl tracking-wider mb-2" style={{filter: 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.5))'}}>
              🎡 RULETA ROYALE
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
          </div>
          
          <div className="flex items-center gap-6 bg-black/40 p-4 rounded-2xl border border-yellow-500/20 backdrop-blur-md shadow-xl">
            <button 
              onClick={() => router.push('/lobby')}
              className="px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-200 rounded-xl font-bold transition-all border border-gray-600 hover:border-gray-500 shadow-lg text-sm uppercase tracking-wide"
            >
              Salir
            </button>
          </div>
        </header>

        {message && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl z-50 animate-bounce">
            {message}
          </div>
        )}

        <div className="flex flex-col items-center gap-8">
          
          {/* Wheel Section */}
          <div className="transform scale-75 md:scale-100">
            <RouletteWheel
              start={wheelStart}
              winningBet={winningBet as any}
              onSpinningEnd={handleEndSpin}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-4 items-center bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="text-xl font-bold">
              Apuesta Total: <span className="text-yellow-400">${total}</span>
            </div>
            <button
              onClick={handleClear}
              disabled={wheelStart || total === 0}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              BORRAR
            </button>
            <button
              onClick={handleSpin}
              disabled={wheelStart || total === 0}
              className="px-8 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform active:scale-95 transition-all"
            >
              {wheelStart ? 'GIRANDO...' : 'GIRAR'}
            </button>
          </div>

          {/* Table Section */}
          <div className="w-full overflow-x-auto bg-gradient-to-br from-green-800 to-green-950 p-8 rounded-xl border-8 border-yellow-800/50 shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_0_60px_rgba(0,0,0,0.3)] relative backdrop-blur-sm">
            <div className="min-w-[800px] flex flex-col items-center relative z-10">
              <RouletteTable 
                chips={chipsMap} 
                bets={bets} 
                onBet={onBet(selectedChip)} 
                readOnly={wheelStart} 
              />
            </div>
          </div>

          {/* Chips Selection */}
          <div className="bg-gray-800 p-4 rounded-full shadow-lg">
            <ChipList
              chips={chipsMap}
              selectedChip={selectedChip}
              onChipPressed={setSelectedChip} 
            />
          </div>

        </div>
      </div>
    </div>
  );
}
