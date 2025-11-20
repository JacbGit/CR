'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { gamesService } from '@/lib/gamesService';
import { soundManager } from '@/lib/soundManager';

export default function SlotsPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [betAmount, setBetAmount] = useState(10);
  const [result, setResult] = useState<any>(null);
  const [spinning, setSpinning] = useState(false);
  const [showingResult, setShowingResult] = useState(false);
  const [displaySymbols, setDisplaySymbols] = useState<string[]>(['🎰', '🎰', '🎰']);
  const [stoppedReels, setStoppedReels] = useState<boolean[]>([false, false, false]);
  const [showAddCredit, setShowAddCredit] = useState(false);
  const [creditAmount, setCreditAmount] = useState(100);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

    const handleSpin = async () => {
    if (betAmount < 1 || betAmount > (typeof user?.balance === 'number' ? user.balance : parseFloat(user?.balance || '0'))) {
      alert('Apuesta inválida');
      return;
    }

    setSpinning(true);
    setResult(null);
    setShowingResult(false);
    setDisplaySymbols(['🎰', '🎰', '🎰']);
    setStoppedReels([false, false, false]);
    
    // Inicializar audio en el primer clic
    soundManager.initializeAudio();
    
    // Sonido de spin inicial
    soundManager.playSlotSpinSound();

    try {
      const response = await gamesService.playSlots(betAmount);
      const symbols = response.result?.symbols?.map((s: string) => getSymbolEmoji(s)) || ['🎰', '🎰', '🎰'];
      
      // Detener cada rodillo progresivamente
      setTimeout(() => {
        setStoppedReels([true, false, false]);
        setDisplaySymbols([symbols[0], '🎰', '🎰']);
      }, 1500);
      
      setTimeout(() => {
        setStoppedReels([true, true, false]);
        setDisplaySymbols([symbols[0], symbols[1], '🎰']);
      }, 2500);
      
      setTimeout(() => {
        setStoppedReels([true, true, true]);
        setDisplaySymbols(symbols);
        setSpinning(false);
        setShowingResult(true);
        setResult(response);
        
        // Sonidos según resultado
        if (response.result.won) {
          if (response.result.winType === 'jackpot') {
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
      setSpinning(false);
      setShowingResult(false);
      setStoppedReels([false, false, false]);
    }
  };

  const handleAddCredit = async () => {
    if (creditAmount <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    
    // Sonido de click
    soundManager.playClickSound();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/transactions/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ amount: creditAmount }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar crédito');
      }

      await refreshUser();
      setShowAddCredit(false);
      
      // Sonido de dinero al confirmar depósito
      soundManager.playMoneyFall();
      
      alert(`¡Crédito agregado exitosamente! +$${creditAmount}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar crédito');
    }
  };

  const getWinMessage = (winType: string, multiplier: number) => {
    if (winType === 'jackpot') return '💰 ¡JACKPOT! 💰';
    if (winType === 'triple') return `🎊 ¡TRIPLE! x${multiplier} 🎊`;
    if (winType === 'double') return `✨ ¡DOBLE! x${multiplier} ✨`;
    return '';
  };

  const getSymbolEmoji = (symbol: string) => {
    const emojiMap: { [key: string]: string } = {
      'CHERRY': '🍒',
      'LEMON': '🍋',
      'ORANGE': '🍊',
      'GRAPE': '🍇',
      'STAR': '⭐',
      'DIAMOND': '💎',
      'SEVEN': '7'
    };
    return emojiMap[symbol] || symbol;
  };

  if (loading || !user) return null;

  const currentBalance = typeof user.balance === 'number' ? user.balance : parseFloat(user.balance || '0');

  return (
    <>
      {/* Modal Agregar Crédito */}
      {showAddCredit && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-8 max-w-md w-full mx-4 border-4 border-yellow-400 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white text-center mb-6">💰 Agregar Crédito</h2>
            
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">Monto</label>
              <input
                type="number"
                min="1"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border-2 border-yellow-600 rounded-lg text-gray-900 font-bold text-xl"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[10, 50, 100, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setCreditAmount(amount)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAddCredit(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCredit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-screen bg-gradient-to-b from-red-900 via-black to-black py-4 px-4 flex flex-col">
        <div className="container mx-auto max-w-3xl flex-1 flex flex-col justify-between">
          {/* Header */}
          <div className="text-center mb-4 animate-fade-in-up">
            <h1 className="casino-title text-6xl text-yellow-300 drop-shadow-lg mb-2" style={{textShadow: '0 0 20px rgba(255,200,0,0.8), 0 0 40px rgba(255,100,0,0.6)'}}>
              🎰 Jackpot 🎰
            </h1>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl text-yellow-400 font-black drop-shadow-lg">💰 ${currentBalance.toFixed(2)}</p>
              <button
                onClick={() => setShowAddCredit(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-2 px-4 rounded-full transition shadow-lg border-2 border-green-400 text-lg"
              >
                + Crédito
              </button>
            </div>
          </div>

          {/* Máquina de Slots Principal */}
          <div className="flex-1 flex flex-col justify-center items-center mb-4">
            {/* Cajón exterior de la máquina */}
            <div 
              className="bg-gradient-to-b from-yellow-600 to-yellow-900 rounded-3xl shadow-2xl p-8 border-8 border-yellow-400 w-full max-w-xl"
              style={{boxShadow: '0 0 50px rgba(255,200,0,0.7), inset 0 0 30px rgba(0,0,0,0.3)'}}
            >
              {/* Nombre de máquina */}
              <div className="text-center mb-6">
                <h2 className="casino-title text-3xl text-red-800 drop-shadow-lg">🎰 Tragamonedas Deluxe 🎰</h2>
              </div>

              {/* Rodillos */}
              <div className="flex justify-center gap-6 mb-8 bg-black/20 rounded-2xl p-6 border-4 border-red-600">
                {[0, 1, 2].map((index) => (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-b from-white to-gray-200 rounded-2xl shadow-2xl overflow-hidden h-44 w-44 relative transition-all duration-300 border-4 flex items-center justify-center flex-col ${
                      stoppedReels[index] 
                        ? 'border-green-400 scale-110 shadow-green-500/70' 
                        : 'border-red-600 animate-pulse'
                    }`}
                    style={stoppedReels[index] ? {boxShadow: '0 0 40px rgba(34,197,94,0.9), inset 0 0 20px rgba(34,197,94,0.3)'} : {}}
                  >
                    {stoppedReels[index] ? (
                      <div className="text-8xl animate-fade-in-up font-bold drop-shadow-lg">
                        {displaySymbols[index]}
                      </div>
                    ) : (
                      <div className="animate-spin-slot absolute w-full h-full">
                        {Array.from({ length: 4 }).flatMap((_, batch) => [
                          <div key={`cherry-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">🍒</div>,
                          <div key={`lemon-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">🍋</div>,
                          <div key={`orange-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">🍊</div>,
                          <div key={`grape-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">🍇</div>,
                          <div key={`star-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">⭐</div>,
                          <div key={`diamond-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">💎</div>,
                          <div key={`seven-${batch}`} className="text-6xl text-center h-44 flex items-center justify-center font-bold">7</div>,
                        ])}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Apuesta y Botón */}
              <div className="space-y-4">
                <div className="bg-red-700/30 rounded-lg p-4 border-2 border-red-600">
                  <label className="block text-white font-black mb-2 text-center text-lg">💵 APUESTA</label>
                  <input
                    type="number"
                    min="1"
                    max={currentBalance}
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border-4 border-yellow-500 rounded-lg text-gray-900 font-black text-2xl text-center bg-yellow-100"
                    disabled={spinning}
                  />
                </div>

                <button
                  onClick={handleSpin}
                  disabled={spinning || betAmount < 1 || betAmount > currentBalance}
                  className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:to-red-900 text-yellow-300 font-black py-6 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed text-3xl shadow-2xl border-4 border-yellow-400 transform hover:scale-105 active:scale-95 drop-shadow-lg"
                  style={{textShadow: '0 0 10px rgba(0,0,0,0.8)'}}
                >
                  {spinning ? '🎰 GIRANDO...' : '🎰 ¡GIRAR! 🎰'}
                </button>
              </div>
            </div>

            {/* Resultado */}
            {result && showingResult && (
              <div className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 text-center animate-fade-in-up border-4 mt-6 ${
                result.result.won 
                  ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300 animate-pulse-glow' 
                  : 'bg-gradient-to-r from-red-600 to-red-800 border-red-900'
              }`}>
                {result.result.won && result.result.winType && (
                  <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
                    {getWinMessage(result.result.winType, result.result.multiplier)}
                  </h2>
                )}
                <h3 className="text-4xl font-black text-white mb-3">
                  {result.result.won ? '🎉 ¡GANASTE! 🎉' : '😢 PERDISTE'}
                </h3>
                <p className="text-5xl font-black text-white drop-shadow-lg">
                  {result.result.won ? `+$${result.winAmount.toFixed(2)}` : `-$${betAmount.toFixed(2)}`}
                </p>
              </div>
            )}
          </div>

          {/* Tabla de Premios - Abajo */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border-4 border-yellow-400 animate-fade-in-up">
            <h2 className="text-2xl font-black text-yellow-400 text-center mb-4">💎 TABLA DE PREMIOS 💎</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-yellow-700/50 rounded-lg p-3 text-center border-2 border-yellow-400">
                <div className="text-4xl mb-1">7 7 7</div>
                <div className="text-yellow-300 font-black text-sm">x100 JACKPOT!</div>
              </div>
              <div className="bg-yellow-700/50 rounded-lg p-3 text-center border-2 border-yellow-400">
                <div className="text-4xl mb-1">💎 💎 💎</div>
                <div className="text-yellow-300 font-black text-sm">x50</div>
              </div>
              <div className="bg-yellow-700/50 rounded-lg p-3 text-center border-2 border-yellow-400">
                <div className="text-4xl mb-1">⭐ ⭐ ⭐</div>
                <div className="text-yellow-300 font-black text-sm">x25</div>
              </div>
              <div className="bg-yellow-700/50 rounded-lg p-3 text-center border-2 border-yellow-400">
                <div className="text-4xl mb-1">🍇 🍇 🍇</div>
                <div className="text-yellow-300 font-black text-sm">x15</div>
              </div>
              <div className="bg-yellow-700/50 rounded-lg p-3 text-center border-2 border-yellow-400">
                <div className="text-4xl mb-1">🍒 🍒 🍒</div>
                <div className="text-yellow-300 font-black text-sm">x10</div>
              </div>
              <div className="bg-yellow-700/50 rounded-lg p-3 text-center border-2 border-yellow-400">
                <div className="text-xl mb-1">Dos Iguales</div>
                <div className="text-yellow-300 font-black text-sm">x2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
