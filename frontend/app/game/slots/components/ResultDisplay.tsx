import { SlotsResult } from '../utils/types';
import { getWinMessage } from '../utils/gameLogic';

interface ResultDisplayProps {
  result: SlotsResult | null;
  showingResult: boolean;
  betAmount: number;
}

export default function ResultDisplay({ result, showingResult, betAmount }: ResultDisplayProps) {
  if (!result || !showingResult) {
    return null;
  }

  return (
    <div className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 text-center animate-fade-in-up border-4 mt-6 ${
      result.won 
        ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300 animate-pulse-glow' 
        : 'bg-gradient-to-r from-red-600 to-red-800 border-red-900'
    }`}>
      {result.won && result.winType && (
        <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
          {getWinMessage(result.winType, result.multiplier || 0)}
        </h2>
      )}
      <h3 className="text-4xl font-black text-white mb-3">
        {result.won ? '🎉 ¡GANASTE! 🎉' : '😢 PERDISTE'}
      </h3>
      <p className="text-5xl font-black text-white drop-shadow-lg">
        {result.won ? `+$${result.winAmount.toFixed(2)}` : `-$${(result.betAmount || betAmount).toFixed(2)}`}
      </p>
    </div>
  );
}
