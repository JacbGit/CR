'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gamesService } from '@/lib/gamesService';
import { useAuth } from '@/context/AuthContext';

const WHEEL_SEGMENTS = [
  { id: 0, multiplier: 1.2, probability: 15, color: '#3B82F6', label: '1.2x' },
  { id: 1, multiplier: 0.5, probability: 20, color: '#6B7280', label: '0.5x' },
  { id: 2, multiplier: 2, probability: 12, color: '#F59E0B', label: '2x' },
  { id: 3, multiplier: 0, probability: 15, color: '#1F2937', label: '0x' },
  { id: 4, multiplier: 3, probability: 10, color: '#8B5CF6', label: '3x' },
  { id: 5, multiplier: 1.5, probability: 12, color: '#10B981', label: '1.5x' },
  { id: 6, multiplier: 5, probability: 5, color: '#EC4899', label: '5x' },
  { id: 7, multiplier: 0.8, probability: 18, color: '#9CA3AF', label: '0.8x' },
  { id: 8, multiplier: 2, probability: 10, color: '#F59E0B', label: '2x' },
  { id: 9, multiplier: 10, probability: 3, color: '#EF4444', label: '10x' },
  { id: 10, multiplier: 1.5, probability: 8, color: '#10B981', label: '1.5x' },
  { id: 11, multiplier: 50, probability: 1, color: '#FCD34D', label: '50x' },
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

  const [mounted, setMounted] = useState(false); 
  useEffect(() => {
    setMounted(true); 
  }, []);

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
      
      console.log('=== DEBUG RUEDA ===');
      console.log('Respuesta completa:', response);
      console.log('Segmento ganador ID:', response.result.segment.id);
      console.log('Rotación del backend:', response.result.rotation);
      
      const winningSegmentId = response.result.segment.id;
      const selectedSegment = WHEEL_SEGMENTS.find(s => s.id === winningSegmentId) || WHEEL_SEGMENTS[0];
      
      // ✅ SOLUCIÓN 1: Resetear primero a 0, luego aplicar nueva rotación
      setRotation(0);
      
      // Pequeño delay para que el navegador registre el reset
      setTimeout(() => {
        const newRotation = response.result.rotation;
        console.log('Nueva rotación (sin acumular):', newRotation);
        console.log('==================');
        setRotation(newRotation);
      }, 50);

      setTimeout(() => {
        const winAmount = response.winAmount;
        const netProfit = response.netProfit;
        const newBalance = response.newBalance;

        setBalance(newBalance);
        setResult({
          segment: selectedSegment,
          winAmount,
          netProfit,
        });

        const multiplier = selectedSegment.multiplier;
        
        if (multiplier === 0) {
            setMessage(`💀 ¡K.O.! ${selectedSegment.label} - Perdiste la apuesta ($${betAmount.toFixed(2)})`);
        } else if (multiplier < 1) {
            setMessage(`📉 Perdiste ${selectedSegment.label} - Pérdida Neta: $${Math.abs(netProfit).toFixed(2)}`);
        } else if (multiplier >= 50) {
            setMessage(`🎰💰 ¡JACKPOT! ${selectedSegment.label} - Ganancia Neta: +$${netProfit.toFixed(2)}`);
        } else if (multiplier >= 10) {
            setMessage(`🎉 ¡GRAN PREMIO! ${selectedSegment.label} - Ganancia Neta: +$${netProfit.toFixed(2)}`);
        } else if (netProfit > 0) {
            setMessage(`✅ ¡Ganaste! ${selectedSegment.label} - Ganancia Neta: +$${netProfit.toFixed(2)}`);
        } else if (netProfit === 0) {
            setMessage(`🤝 Sin ganancia ni pérdida - ${selectedSegment.label}`);
        } else {
            setMessage(`😢 Perdiste ${selectedSegment.label} - Pérdida: $${Math.abs(netProfit).toFixed(2)}`);
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white pt-32 pb-8 px-4 md:px-8 flex items-center justify-center">
        <div className="text-2xl font-bold text-yellow-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white pt-32 pb-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Header horizontal: Título a la izquierda, botón a la derecha */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
            🎡 RUEDA DE LA FORTUNA
          </h1>
          <button 
            onClick={() => router.push('/lobby')}
            className="px-8 py-3 bg-gray-950 hover:bg-black text-white rounded-lg font-bold transition-all border-2 border-gray-800 hover:border-gray-700 shadow-xl text-base uppercase tracking-wider"
          >
            SALIR
          </button>
        </div>

        {/* ✅ Mensaje fijo sin animación */}
        <div className="mb-6 h-24 flex items-center justify-center">
          {message && (
            <div className={`text-center py-4 px-8 rounded-2xl font-bold text-xl ${
              result && result.netProfit > betAmount ? 'bg-yellow-500' : 
              result && result.netProfit > 0 ? 'bg-green-600' : 'bg-blue-600'
            } max-w-2xl shadow-2xl`}>
              {message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
                    transform: `rotate(${rotation}deg)`,
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
                    
                    const x1 = (200 + 200 * Math.cos(startRad)).toFixed(4);
                    const y1 = (200 + 200 * Math.sin(startRad)).toFixed(4);
                    const x2 = (200 + 200 * Math.cos(endRad)).toFixed(4);
                    const y2 = (200 + 200 * Math.sin(endRad)).toFixed(4);

                    const textAngle = startAngle + anglePerSegment / 2;
                    const textRad = (textAngle * Math.PI) / 180;
                    const textX = (200 + 140 * Math.cos(textRad)).toFixed(4);
                    const textY = (200 + 140 * Math.sin(textRad)).toFixed(4);

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