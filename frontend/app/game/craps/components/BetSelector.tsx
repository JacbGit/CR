import { BetType } from '../utils/types';

interface BetSelectorProps {
  betType: BetType;
  onBetTypeChange: (type: BetType) => void;
  disabled?: boolean;
}

export default function BetSelector({ betType, onBetTypeChange, disabled }: BetSelectorProps) {
  return (
    <div className="bg-green-900/30 rounded-lg p-4 border-2 border-green-600 mb-4">
      <label className="block text-white font-black mb-4 text-center text-lg drop-shadow-lg">🎯 TIPO DE APUESTA</label>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onBetTypeChange('pass')}
          disabled={disabled}
          className={`py-4 px-4 rounded-xl font-black text-sm transition-all duration-200 transform hover:scale-105 shadow-lg ${
            betType === 'pass'
              ? 'bg-gradient-to-b from-green-300 to-green-500 text-green-900 border-2 border-white scale-105 shadow-green-500/50'
              : 'bg-gradient-to-b from-green-700 to-green-800 text-white border-2 border-green-600 hover:shadow-green-600/50'
          }`}
        >
          ✅ PASS (7,11)
        </button>
        <button
          onClick={() => onBetTypeChange('dont-pass')}
          disabled={disabled}
          className={`py-4 px-4 rounded-xl font-black text-sm transition-all duration-200 transform hover:scale-105 shadow-lg ${
            betType === 'dont-pass'
              ? 'bg-gradient-to-b from-red-300 to-red-500 text-red-900 border-2 border-white scale-105 shadow-red-500/50'
              : 'bg-gradient-to-b from-red-700 to-red-800 text-white border-2 border-red-600 hover:shadow-red-600/50'
          }`}
        >
          ❌ DON'T (2,3)
        </button>
        <button
          onClick={() => onBetTypeChange('field')}
          disabled={disabled}
          className={`py-4 px-4 rounded-xl font-black text-sm transition-all duration-200 transform hover:scale-105 shadow-lg ${
            betType === 'field'
              ? 'bg-gradient-to-b from-blue-300 to-blue-500 text-blue-900 border-2 border-white scale-105 shadow-blue-500/50'
              : 'bg-gradient-to-b from-blue-700 to-blue-800 text-white border-2 border-blue-600 hover:shadow-blue-600/50'
          }`}
        >
          🎯 FIELD (2x)
        </button>
        <button
          onClick={() => onBetTypeChange('any-craps')}
          disabled={disabled}
          className={`py-4 px-4 rounded-xl font-black text-sm transition-all duration-200 transform hover:scale-105 shadow-lg ${
            betType === 'any-craps'
              ? 'bg-gradient-to-b from-purple-300 to-purple-500 text-purple-900 border-2 border-white scale-105 shadow-purple-500/50'
              : 'bg-gradient-to-b from-purple-700 to-purple-800 text-white border-2 border-purple-600 hover:shadow-purple-600/50'
          }`}
        >
          💀 CRAPS (7:1)
        </button>
        <button
          onClick={() => onBetTypeChange('any-seven')}
          disabled={disabled}
          className={`py-4 px-4 rounded-xl font-black text-sm transition-all duration-200 transform hover:scale-105 shadow-lg col-span-2 ${
            betType === 'any-seven'
              ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900 border-2 border-white scale-105 shadow-yellow-500/50'
              : 'bg-gradient-to-b from-yellow-700 to-yellow-800 text-white border-2 border-yellow-600 hover:shadow-yellow-600/50'
          }`}
        >
          ⭐ SEVEN (4:1)
        </button>
      </div>
    </div>
  );
}
