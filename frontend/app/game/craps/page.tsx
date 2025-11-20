'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { gamesService } from '@/lib/gamesService';
import { soundManager } from '@/lib/soundManager';

export default function CrapsPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState('pass');
  const [result, setResult] = useState<any>(null);
  const [rolling, setRolling] = useState(false);
  const [showAddCredit, setShowAddCredit] = useState(false);
  const [creditAmount, setCreditAmount] = useState(100);
  const [dice1Animation, setDice1Animation] = useState(1);
  const [dice2Animation, setDice2Animation] = useState(1);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleRoll = async () => {
    setRolling(true);
    setResult(null);
    
    // Inicializar audio en el primer clic
    soundManager.initializeAudio();
    
    // Sonido de dados rodando
    soundManager.playRouletteSpinning();
    
    // Animación: intercambio rápido de imagenes (emoji) cada 80ms
    const animationInterval = setInterval(() => {
      setDice1Animation(Math.floor(Math.random() * 6) + 1);
      setDice2Animation(Math.floor(Math.random() * 6) + 1);
    }, 80);

    try {
      const response = await gamesService.playCraps({ 
        gameType: 'dice', 
        amount: betAmount,
        betType: betType
      });
      
      // Sincronizar con la duración deseada (1s)
      setTimeout(() => {
        clearInterval(animationInterval);
        setDice1Animation(response.result.dice1);
        setDice2Animation(response.result.dice2);
        setResult({
          won: response.result.won,
          dice1: response.result.dice1,
          dice2: response.result.dice2,
          total: response.result.total,
          winAmount: response.winAmount,
          winType: response.result.winType,
          multiplier: response.result.multiplier
        });
        setRolling(false);
        
        // Sonidos según resultado
        if (response.result.won) {
          soundManager.playJackpotSound();
          soundManager.playMoneyFall();
        } else {
          soundManager.playLosSound();
        }
        
        refreshUser();
  }, 1000);
    } catch (error) {
      console.error('Error:', error);
      clearInterval(animationInterval);
      setRolling(false);
    }
  };

  const handleAddCredit = async () => {
    if (creditAmount <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    
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
      soundManager.playMoneyFall();
      alert(`¡Crédito agregado exitosamente! +$${creditAmount}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar crédito');
    }
  };

  const getDiceEmoji = (number: number) => {
    const diceMap: { [key: number]: string } = {
      1: '⚀',
      2: '⚁',
      3: '⚂',
      4: '⚃',
      5: '⚄',
      6: '⚅'
    };
    return diceMap[number] || '🎲';
  };

  if (loading || !user) return null;

  const currentBalance = typeof user.balance === 'number' ? user.balance : parseFloat(user.balance || '0');

  return (
    <>
      {/* Modal Agregar Crédito */}
      {showAddCredit && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-8 max-w-md w-full mx-4 border-4 border-white animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white text-center mb-6">💰 Agregar Crédito</h2>
            
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">Monto</label>
              <input
                type="number"
                min="1"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border-2 border-green-600 rounded-lg text-gray-900 font-bold text-xl"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[10, 50, 100, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setCreditAmount(amount)}
                  className="bg-white hover:bg-gray-200 text-green-800 font-bold py-2 px-4 rounded-lg transition"
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

      <div className="h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-black py-4 px-4 flex flex-col">
        <div className="container mx-auto max-w-6xl flex flex-col h-full">
          <h1 className="casino-title text-4xl text-white text-center mb-2 animate-fade-in-up">
            🎲 Dados Craps 🎲
          </h1>
          
          <div className="text-center mb-3">
            <p className="text-xl text-white font-bold mb-2">
              💰 Balance: ${currentBalance.toFixed(2)}
            </p>
            <button
              onClick={() => setShowAddCredit(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              + Agregar Crédito
            </button>
          </div>

          <div className="flex gap-4 flex-1">
            {/* Panel de Reglas - Lado Izquierdo */}
            <div className="w-1/3 bg-black/50 backdrop-blur-sm rounded-xl p-4 border-2 border-white animate-fade-in-up overflow-y-auto">
              <h2 className="text-xl font-bold text-white text-center mb-3">📋 REGLAS 📋</h2>
              <div className="space-y-2 text-sm">
                <div className="bg-green-800/50 rounded-lg p-2">
                  <div className="text-white font-bold">✅ PASS LINE</div>
                  <div className="text-green-100 text-xs">Ganas si sales 7 u 11</div>
                </div>
                <div className="bg-red-800/50 rounded-lg p-2">
                  <div className="text-white font-bold">❌ DON'T PASS</div>
                  <div className="text-red-100 text-xs">Ganas si sales 2 o 3</div>
                </div>
                <div className="bg-blue-800/50 rounded-lg p-2">
                  <div className="text-white font-bold">🎯 FIELD (x2)</div>
                  <div className="text-blue-100 text-xs">2, 3, 4, 9, 10, 11, 12</div>
                  <div className="text-blue-100 text-xs font-bold">Pago 2:1 en 2 y 12</div>
                </div>
                <div className="bg-purple-800/50 rounded-lg p-2">
                  <div className="text-white font-bold">💀 ANY CRAPS (7:1)</div>
                  <div className="text-purple-100 text-xs">Sale 2, 3 o 12</div>
                </div>
                <div className="bg-yellow-800/50 rounded-lg p-2">
                  <div className="text-white font-bold">⭐ ANY SEVEN (4:1)</div>
                  <div className="text-yellow-100 text-xs">Sale 7</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-2 border-2 border-yellow-400 mt-2">
                  <div className="text-yellow-300 font-bold">💡 CONSEJO</div>
                  <div className="text-gray-200 text-xs">Field paga más pero es más difícil</div>
                </div>
              </div>
            </div>

            {/* Máquina de Dados - Centro */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-2xl p-6 animate-fade-in-up border-4 border-white">
                
                {/* Dados - Diseño Premium 3D */}
                <div className="mb-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-2xl p-8 border-4 border-yellow-400 shadow-2xl" style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'}}>
                  <div className="flex justify-center gap-12">
                    {/* Dado 1 */}
                    <div 
                      className={`flex items-center justify-center relative transition-all ${
                        rolling ? 'dice-flicker' : ''
                      }`}
                    >
                      <div className="relative h-40 w-40">
                        {/* Sombra exterior */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 rounded-3xl blur-lg"></div>
                        
                        {/* Dado principal */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-200 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-4 transition-all ${
                          rolling ? 'border-yellow-500 shadow-yellow-400/50' : 'border-yellow-300 hover:scale-105 hover:border-yellow-400'
                        }`}
                        style={{
                          boxShadow: rolling ? '0 0 30px rgba(234, 179, 8, 0.6)' : '0 10px 30px rgba(0, 0, 0, 0.5)'
                        }}>
                          {/* Reflejo superior */}
                          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl"></div>
                          
                          {/* Número del dado */}
                          <div className={`text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 drop-shadow-lg ${rolling ? 'dice-flicker' : ''}`} style={{textShadow: '3px 3px 8px rgba(0,0,0,0.4)'}}>
                            {getDiceEmoji(dice1Animation)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Plus entre dados */}
                    <div className="flex items-center text-4xl font-black text-yellow-300" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                      +
                    </div>

                    {/* Dado 2 */}
                    <div 
                      className={`flex items-center justify-center relative transition-all ${
                        rolling ? 'dice-flicker' : ''
                      }`}
                    >
                      <div className="relative h-40 w-40">
                        {/* Sombra exterior */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 rounded-3xl blur-lg"></div>
                        
                        {/* Dado principal */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-200 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-4 transition-all ${
                          rolling ? 'border-yellow-500 shadow-yellow-400/50' : 'border-yellow-300 hover:scale-105 hover:border-yellow-400'
                        }`}
                        style={{
                          boxShadow: rolling ? '0 0 30px rgba(234, 179, 8, 0.6)' : '0 10px 30px rgba(0, 0, 0, 0.5)'
                        }}>
                          {/* Reflejo superior */}
                          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl"></div>
                          
                          {/* Número del dado */}
                          <div className={`text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 drop-shadow-lg ${rolling ? 'dice-flicker' : ''}`} style={{textShadow: '3px 3px 8px rgba(0,0,0,0.4)'}}>
                            {getDiceEmoji(dice2Animation)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Igualdad decorativa */}
                  <div className="text-center mt-6 text-2xl font-black">
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 px-6 py-2 rounded-full shadow-lg border-2 border-yellow-200" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)'}}>
                      = {result?.total || '?'}
                    </div>
                  </div>
                </div>

                {/* Tipo de Apuesta */}
                <div className="mb-4">
                  <label className="block text-white font-black mb-3 text-center text-lg drop-shadow-lg">🎯 TIPO DE APUESTA</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setBetType('pass')}
                      className={`py-3 px-3 rounded-lg font-bold text-xs transition-all duration-200 transform hover:scale-105 shadow-lg ${
                        betType === 'pass'
                          ? 'bg-gradient-to-b from-green-300 to-green-500 text-green-900 border-2 border-white scale-105 shadow-green-500/50'
                          : 'bg-gradient-to-b from-green-700 to-green-800 text-white border-2 border-green-600 hover:shadow-green-600/50'
                      }`}
                    >
                      ✅ PASS (7,11)
                    </button>
                    <button
                      onClick={() => setBetType('dont-pass')}
                      className={`py-3 px-3 rounded-lg font-bold text-xs transition-all duration-200 transform hover:scale-105 shadow-lg ${
                        betType === 'dont-pass'
                          ? 'bg-gradient-to-b from-red-300 to-red-500 text-red-900 border-2 border-white scale-105 shadow-red-500/50'
                          : 'bg-gradient-to-b from-red-700 to-red-800 text-white border-2 border-red-600 hover:shadow-red-600/50'
                      }`}
                    >
                      ❌ DON'T (2,3)
                    </button>
                    <button
                      onClick={() => setBetType('field')}
                      className={`py-3 px-3 rounded-lg font-bold text-xs transition-all duration-200 transform hover:scale-105 shadow-lg ${
                        betType === 'field'
                          ? 'bg-gradient-to-b from-blue-300 to-blue-500 text-blue-900 border-2 border-white scale-105 shadow-blue-500/50'
                          : 'bg-gradient-to-b from-blue-700 to-blue-800 text-white border-2 border-blue-600 hover:shadow-blue-600/50'
                      }`}
                    >
                      🎯 FIELD (2x)
                    </button>
                    <button
                      onClick={() => setBetType('any-craps')}
                      className={`py-3 px-3 rounded-lg font-bold text-xs transition-all duration-200 transform hover:scale-105 shadow-lg ${
                        betType === 'any-craps'
                          ? 'bg-gradient-to-b from-purple-300 to-purple-500 text-purple-900 border-2 border-white scale-105 shadow-purple-500/50'
                          : 'bg-gradient-to-b from-purple-700 to-purple-800 text-white border-2 border-purple-600 hover:shadow-purple-600/50'
                      }`}
                    >
                      💀 CRAPS (7:1)
                    </button>
                    <button
                      onClick={() => setBetType('any-seven')}
                      className={`py-3 px-3 rounded-lg font-bold text-xs transition-all duration-200 transform hover:scale-105 shadow-lg ${
                        betType === 'any-seven'
                          ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900 border-2 border-white scale-105 shadow-yellow-500/50'
                          : 'bg-gradient-to-b from-yellow-700 to-yellow-800 text-white border-2 border-yellow-600 hover:shadow-yellow-600/50'
                      }`}
                    >
                      ⭐ SEVEN (4:1)
                    </button>
                  </div>
                </div>

                {/* Apuesta */}
                <div className="mb-4">
                  <label className="block text-white font-black mb-3 text-center text-lg drop-shadow-lg">💵 APUESTA</label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg blur-sm opacity-50"></div>
                    <input
                      type="number"
                      min="1"
                      max={currentBalance}
                      value={betAmount}
                      onChange={(e) => setBetAmount(parseInt(e.target.value) || 1)}
                      className="relative w-full px-4 py-4 border-4 border-white rounded-lg text-green-900 font-black text-2xl text-center bg-white hover:bg-green-50 focus:bg-green-50 focus:outline-none transition shadow-lg"
                      disabled={rolling}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-300 mt-2">
                    Máximo: ${currentBalance.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Resultado - Lado Derecho */}
            <div className="w-1/3 bg-black/50 backdrop-blur-sm rounded-xl p-4 border-2 border-white animate-fade-in-up overflow-auto">
              <h2 className="text-xl font-bold text-white text-center mb-3">📊 RESULTADO 📊</h2>
              
              {result ? (
                <div className={`rounded-2xl p-5 border-4 text-center space-y-3 transition-all ${
                  result.won
                    ? 'bg-gradient-to-b from-green-800/70 to-emerald-900/70 border-green-300 shadow-lg shadow-green-500/50'
                    : 'bg-gradient-to-b from-red-800/70 to-rose-900/70 border-red-300 shadow-lg shadow-red-500/50'
                }`}>
                  <div className={`text-5xl font-bold ${result.won ? 'animate-bounce' : ''}`}>
                    {result.won ? '🎉' : '😢'}
                  </div>
                  <div className={`text-3xl font-black drop-shadow-lg ${result.won ? 'text-green-300' : 'text-red-300'}`}>
                    {result.won ? '¡GANASTE!' : 'PERDISTE'}
                  </div>
                  <div className="text-sm text-gray-200 font-semibold uppercase tracking-wider">
                    {result.winType?.replace(/_/g, ' ')}
                  </div>
                  <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent my-3"></div>
                  <div className={`text-4xl font-black drop-shadow-lg ${result.won ? 'text-green-200' : 'text-red-200'}`}>
                    {result.won ? (
                      <span>+${result.winAmount.toFixed(2)}</span>
                    ) : (
                      <span>-${betAmount.toFixed(2)}</span>
                    )}
                  </div>
                  {result.multiplier && result.multiplier > 1 && (
                    <div className="bg-yellow-500/30 border-2 border-yellow-400 rounded-lg py-2 mt-2">
                      <div className="text-2xl font-black text-yellow-200" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                        ×{result.multiplier}
                      </div>
                      <div className="text-xs text-yellow-100">MULTIPLICADOR</div>
                    </div>
                  )}
                  <div className="text-sm text-gray-300 pt-3">
                    {result.won ? (
                      <span className="font-bold text-green-200">¡Excelente predicción!</span>
                    ) : (
                      <span className="font-bold text-red-200">Intenta nuevamente</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/70 rounded-2xl p-5 border-4 border-gray-600 text-center shadow-lg">
                  <div className="text-3xl font-black text-gray-300 mb-2">🎲</div>
                  <div className="text-gray-300 font-bold">
                    Presiona LANZAR para comenzar
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    El destino te llama...
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleRoll}
            disabled={rolling || betAmount < 1 || betAmount > currentBalance}
            className={`w-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 text-yellow-900 font-black py-5 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-3xl shadow-2xl border-4 border-white mt-4 transform hover:scale-105 active:scale-95 ${
              rolling ? 'animate-pulse' : ''
            }`}
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              boxShadow: rolling ? '0 0 30px rgba(250, 204, 21, 0.8), 0 0 60px rgba(250, 204, 21, 0.4)' : '0 8px 20px rgba(0,0,0,0.4)'
            }}
          >
            {rolling ? '🎲 ¡LANZANDO...! 🎲' : '🎲 LANZAR DADOS 🎲'}
          </button>
        </div>
      </div>
    </>
  );
}
