'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gamesService } from '@/lib/gamesService';
import { useAuth } from '@/context/AuthContext';

// Configuración de la rueda (debe coincidir con el backend)
const WHEEL_SEGMENTS = [
  { id: 0, multiplier: 1.2, color: '#3B82F6', label: '1.2x' },
  { id: 1, multiplier: 1.5, color: '#10B981', label: '1.5x' },
  { id: 2, multiplier: 2, color: '#F59E0B', label: '2x' },
  { id: 3, multiplier: 1.2, color: '#3B82F6', label: '1.2x' },
  { id: 4, multiplier: 3, color: '#8B5CF6', label: '3x' },
  { id: 5, multiplier: 1.5, color: '#10B981', label: '1.5x' },
  { id: 6, multiplier: 5, color: '#EC4899', label: '5x' },
  { id: 7, multiplier: 1.2, color: '#3B82F6', label: '1.2x' },
  { id: 8, multiplier: 2, color: '#F59E0B', label: '2x' },
  { id: 9, multiplier: 10, color: '#EF4444', label: '10x' },
  { id: 10, multiplier: 1.5, color: '#10B981', label: '1.5x' },
  { id: 11, multiplier: 50, color: '#FCD34D', label: '50x' },
];

export default function WheelOfFortune() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{
    segment: typeof WHEEL_SEGMENTS[0];
    winAmount: number;
    netProfit: number;
  } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setBalance(Number(user.balance));
    }
  }, [user]);

  const handleSpin = async () => {
    if (isSpinning || betAmount > balance) return;

    setIsSpinning(true);
    setMessage('🎡 Girando...');
    setResult(null);

    try {
      const response = await gamesService.playWheel({ amount: betAmount });
      
      console.log('Respuesta del backend:', response);
      
      const winningSegmentId = response.result.segment.id;
      const selectedSegment = WHEEL_SEGMENTS.find(s => s.id === winningSegmentId) || WHEEL_SEGMENTS[0];
      
      const finalRotation = rotation + response.result.rotation;
      setRotation(finalRotation);

      setTimeout(() => {
        // ✅ USAR DATOS DEL BACKEND
        const winAmount = response.winAmount;
        const netProfit = response.netProfit;
        const newBalance = response.newBalance;

        setBalance(newBalance);
        setResult({
          segment: selectedSegment,
          winAmount,
          netProfit,
        });

        if (selectedSegment.multiplier >= 50) {
          setMessage(`🎰💰 ¡JACKPOT! ${selectedSegment.label} - Ganaste $${winAmount.toFixed(2)}`);
        } else if (selectedSegment.multiplier >= 10) {
          setMessage(`🎉 ¡GRAN PREMIO! ${selectedSegment.label} - Ganaste $${winAmount.toFixed(2)}`);
        } else if (netProfit > 0) {
          setMessage(`✅ ¡Ganaste! ${selectedSegment.label} - Ganaste $${winAmount.toFixed(2)}`);
        } else if (netProfit === 0) {
          setMessage(`🤝 Empate - Recuperaste tu apuesta`);
        } else {
          setMessage(`${selectedSegment.label} - Ganaste $${winAmount.toFixed(2)}`);
        }

        setIsSpinning(false);
        refreshUser();
      }, 4000);
      
    } catch (error: any) {
      console.error('Error en la rueda:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al jugar. Intenta de nuevo.';
      setMessage(errorMessage);
      setIsSpinning(false);
    }
  };

  const betPresets = [10, 25, 50, 100, 250];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white pt-32 pb-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-4">
            🎡 RUEDA DE LA FORTUNA
          </h1>
          <div className="text-2xl font-bold text-yellow-400">
            Balance: ${balance.toFixed(2)}
          </div>
          <button 
            onClick={() => router.push('/lobby')}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-200 rounded-xl font-bold transition-all border border-gray-600 hover:border-gray-500 shadow-lg text-sm uppercase tracking-wide"
          >
            ← Volver al Lobby
          </button>
        </div>

        {message && (
          <div className={`text-center mb-8 py-4 px-6 rounded-full font-bold text-xl ${
            result && result.netProfit > betAmount ? 'bg-yellow-500' : 
            result && result.netProfit > 0 ? 'bg-green-600' : 'bg-blue-600'
          } max-w-2xl mx-auto shadow-2xl animate-bounce`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Apuesta</h3>
              
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                disabled={isSpinning}
                min="1"
                max={balance}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 mb-4"
              />

              <div className="grid grid-cols-5 gap-2 mb-6">
                {betPresets.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={isSpinning || amount > balance}
                    className="px-2 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSpin}
                disabled={isSpinning || betAmount > balance || betAmount <= 0}
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 text-white rounded-xl font-black text-xl uppercase tracking-wide shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSpinning ? '🎡 GIRANDO...' : '⚙️ GIRAR RUEDA'}
              </button>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Tabla de Pagos</h3>
              <div className="space-y-2">
                {[...WHEEL_SEGMENTS].sort((a, b) => b.multiplier - a.multiplier).filter((seg, idx, arr) => 
                  arr.findIndex(s => s.multiplier === seg.multiplier) === idx
                ).map((segment) => {
                  const segmentsWithMultiplier = WHEEL_SEGMENTS.filter(s => s.multiplier === segment.multiplier).length;
                  const probability = ((segmentsWithMultiplier / WHEEL_SEGMENTS.length) * 100).toFixed(1);
                  
                  return (
                    <div key={segment.id} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: segment.color + '30', borderLeft: `4px solid ${segment.color}` }}>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{segment.label}</span>
                        <span className="text-xs text-gray-300 bg-black/30 px-2 py-1 rounded-full">
                          {probability}%
                        </span>
                      </div>
                      <span className="text-2xl" style={{ color: segment.color }}>●</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-20">
                <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[40px] border-t-yellow-400 drop-shadow-2xl"></div>
              </div>

              <div className="relative w-[500px] h-[500px] rounded-full overflow-hidden shadow-2xl border-8 border-yellow-500">
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full"
                  style={{
                    transform: `rotate(${-rotation}deg)`,
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                  }}
                >
                  {WHEEL_SEGMENTS.map((segment, index) => {
                    const totalSegments = WHEEL_SEGMENTS.length;
                    const anglePerSegment = 360 / totalSegments;
                    
                    const startAngle = index * anglePerSegment - 90;
                    const endAngle = (index + 1) * anglePerSegment - 90;
                    
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    
                    const x1 = 200 + 200 * Math.cos(startRad);
                    const y1 = 200 + 200 * Math.sin(startRad);
                    const x2 = 200 + 200 * Math.cos(endRad);
                    const y2 = 200 + 200 * Math.sin(endRad);

                    const textAngle = startAngle + anglePerSegment / 2;
                    const textRad = (textAngle * Math.PI) / 180;
                    const textX = 200 + 140 * Math.cos(textRad);
                    const textY = 200 + 140 * Math.sin(textRad);

                    return (
                      <g key={segment.id}>
                        <path
                          d={`M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`}
                          fill={segment.color}
                          stroke="#ffffff"
                          strokeWidth="3"
                        />
                        
                        <text
                          x={textX}
                          y={textY}
                          fill="white"
                          fontSize="24"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                        >
                          {segment.label}
                        </text>
                      </g>
                    );
                  })}
                  
                  <circle cx="200" cy="200" r="35" fill="#1F2937" stroke="#FCD34D" strokeWidth="6" />
                  <circle cx="200" cy="200" r="15" fill="#FCD34D" />
                </svg>
              </div>

              <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 animate-pulse pointer-events-none" style={{ width: '530px', height: '530px', top: '-15px', left: '-15px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}