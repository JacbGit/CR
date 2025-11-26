import React from 'react';

// SIMULACIÓN DE PROPS (Reemplazar con tu archivo de constantes real)
interface WheelSegment { id: number; multiplier: number; probability: number; color: string; label: string; }
const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 0, multiplier: 1.2, probability: 20, color: '#3B82F6', label: '1.2x' },
  { id: 1, multiplier: 1.5, probability: 15, color: '#10B981', label: '1.5x' },
  { id: 2, multiplier: 2, probability: 12, color: '#F59E0B', label: '2x' },
  { id: 3, multiplier: 1.2, probability: 20, color: '#3B82F6', label: '1.2x' },
  { id: 4, multiplier: 3, probability: 10, color: '#8B5CF6', label: '3x' },
  { id: 5, multiplier: 1.5, probability: 15, color: '#10B981', label: '1.5x' },
  { id: 6, multiplier: 5, probability: 5, color: '#EC4899', label: '5x' },
  { id: 7, multiplier: 1.2, probability: 20, color: '#3B82F6', label: '1.2x' },
  { id: 8, multiplier: 2, probability: 12, color: '#F59E0B', label: '2x' },
  { id: 9, multiplier: 10, probability: 3, color: '#EF4444', label: '10x' },
  { id: 10, multiplier: 1.5, probability: 15, color: '#10B981', label: '1.5x' },
  { id: 11, multiplier: 50, probability: 1, color: '#FCD34D', label: '🎰 50x' },
];
const ANGLE_PER_SEGMENT = 360 / WHEEL_SEGMENTS.length; // 30 grados


interface WheelComponentProps {
  rotation: number;
  spinning: boolean;
  betAmount: number;
  currentBalance: number;
  onBetAmountChange: (amount: number) => void;
  onSpin: () => void;
}

export default function WheelComponent({
  rotation,
  spinning,
  betAmount,
  currentBalance,
  onBetAmountChange,
  onSpin
}: WheelComponentProps) {
  return (
    <div className="bg-gradient-to-b from-yellow-500 to-yellow-800 rounded-3xl shadow-2xl p-8 border-8 border-yellow-400 w-full max-w-2xl flex flex-col items-center"
      style={{boxShadow: '0 0 50px rgba(255,200,0,0.7), inset 0 0 30px rgba(0,0,0,0.3)'}}
    >
      <div className="text-center mb-6">
        <h2 className="casino-title text-3xl text-red-800 drop-shadow-lg">✨ ¡GIRA Y GANA! ✨</h2>
      </div>

      {/* Rueda y Puntero */}
      <div className="relative w-[450px] h-[450px] mb-8">
        {/* Puntero de Ganancia */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[20px] w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-red-600 z-20 shadow-xl" />

        {/* Rueda Giratoria (Usando SVG para renderizado correcto) */}
        <div 
          className="w-full h-full rounded-full border-8 border-gray-900 shadow-2xl transition-transform duration-[4000ms] ease-out relative overflow-hidden" 
          style={{ 
            transform: `rotate(${rotation}deg)`,
            backgroundColor: '#FFC107' 
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {WHEEL_SEGMENTS.map((segment, index) => {
              const startAngle = index * ANGLE_PER_SEGMENT;
              const endAngle = (index + 1) * ANGLE_PER_SEGMENT;

              const largeArcFlag = ANGLE_PER_SEGMENT > 180 ? 1 : 0;

              // --- CÓDIGO CORREGIDO (soluciona el error de hidratación) ---
                const x1 = (50 + 50 * Math.cos(Math.PI * (startAngle - 90) / 180)).toFixed(4);
                const y1 = (50 + 50 * Math.sin(Math.PI * (startAngle - 90) / 180)).toFixed(4);
                const x2 = (50 + 50 * Math.cos(Math.PI * (endAngle - 90) / 180)).toFixed(4);
                const y2 = (50 + 50 * Math.sin(Math.PI * (endAngle - 90) / 180)).toFixed(4);

              return (
                <g key={segment.id}>
                  {/* Segmento Path */}
                  <path
                    d={`M 50,50 L ${x1},${y1} A 50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                    fill={segment.color}
                    stroke="#222" 
                    strokeWidth="0.5"
                  />
                  {/* Texto del Segmento */}
                  <text
                    x="50"
                    y="50"
                    fill="white"
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    // Rota el texto para alinearlo con el segmento, y lo desplaza hacia afuera (-35 en Y)
                    transform={`rotate(${startAngle + ANGLE_PER_SEGMENT / 2} 50 50) translate(0 -35)`} 
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}
            {/* Círculo Central */}
            <circle cx="50" cy="50" r="10" fill="#facc15" stroke="#a16207" strokeWidth="1" />
            <circle cx="50" cy="50" r="4" fill="#a16207" />
          </svg>
        </div>
      </div>
      
      {/* Apuesta y Botón */}
      <div className="space-y-4 w-full max-w-sm">
        <div className="bg-red-700/30 rounded-lg p-4 border-2 border-red-600">
          <label className="block text-white font-black mb-2 text-center text-lg">💵 APUESTA</label>
          <input
            type="number"
            min="0"
            max={currentBalance}
            value={betAmount === 0 ? '' : betAmount}
            onChange={(e) => {
              const val = e.target.value;
              onBetAmountChange(val === '' ? 0 : parseInt(val));
            }}
            className="w-full px-4 py-3 border-4 border-yellow-500 rounded-lg text-gray-900 font-black text-2xl text-center bg-yellow-100"
            disabled={spinning}
          />
        </div>

        <button
          onClick={onSpin}
          disabled={spinning || betAmount < 1 || betAmount > currentBalance}
          className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:to-red-900 text-yellow-300 font-black py-6 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed text-3xl shadow-2xl border-4 border-yellow-400 transform hover:scale-105 active:scale-95 drop-shadow-lg"
          style={{textShadow: '0 0 10px rgba(0,0,0,0.8)'}}
        >
          {spinning ? '🍀 ¡SUERTE!' : '🍀 ¡GIRAR! 🍀'}
        </button>
      </div>
    </div>
  );
}